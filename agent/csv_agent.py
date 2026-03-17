import pandas as pd
import duckdb
from langchain_openai import ChatOpenAI
from langchain_core.prompts import load_prompt
from pydantic import BaseModel, Field
from typing import Optional, Literal

class CSVAnalyzeResponse(BaseModel):
    sql_query: Optional[str] = Field(
        description="PostgreSQL SELECT query written in a single line. Only use columns from the dataset.",
        default=None,
    )

    chart_type: Optional[
        Literal['metric', 'bar','line','pie','scatter', 'histogram']
    ] = Field(
        description="Best chart type to visualize the query result",
        default=None,
    )
    x_axis: Optional[str] = Field(
        description="Column name used for x-axis if the chart requires it",
        default=None,
    )
    y_axis: Optional[str] = Field(
        description="Column name used for y-axis if the chart requires it",
        default=None,
    )
    message: Optional[str] = Field(
        description="Give error message if dataset does not contain information required to answer this question.",
        default=None)

def analyze_csv_logic(df: pd.DataFrame, prompt: str) -> dict:
    print(f"[CSV Agent] Starting analysis for prompt: '{prompt}'")
    try:
        # Clean column names to avoid SQL generation errors (e.g., "Item Type" -> "item_type")
        df.columns = df.columns.str.lower().str.replace(' ', '_')
        
        # Build schema text for the LLM
        schema_text = f"Table: dataset\nColumns:\n"
        for col, dtype in zip(df.columns, df.dtypes):
            schema_text += f"- {col} ({dtype})\n"
        
        sample_rows = df.head(5).to_dict(orient="records")
        schema_text += "\nSample rows:\n"
        for row in sample_rows:
            schema_text += f"{row}\n"
        schema_text += "\n"

        con = duckdb.connect()
        con.register("dataset", df)

        llm = ChatOpenAI(model="gpt-5-nano-2025-08-07")
        structured_llm = llm.with_structured_output(CSVAnalyzeResponse)
        template = load_prompt('agent/prompts/sql_gen_prompt.json')

        prompt_val = template.invoke({'question': prompt, 'schema': schema_text})
        res = structured_llm.invoke(prompt_val)
        result = res.model_dump()

        sql_query = result.get("sql_query")
        chart_type = result.get("chart_type")
        x_axis = result.get("x_axis")
        y_axis = result.get("y_axis")
        print(f"[CSV Agent] Generated SQL: {sql_query}")
        print(f"[CSV Agent] Chart Type: {chart_type}, X: {x_axis}, Y: {y_axis}")

        if not sql_query or sql_query == "null":
            return {
                "success": True,
                "type": "chat",
                "prompt": prompt,
                "response": result.get("message", "Could not generate SQL for the provided question.")
            }

        # Execute duckdb query
        try:
            print("[CSV Agent] Executing SQL against DuckDB...")
            query_result = con.execute(sql_query).df()
            # We need to fill NaNs with None so it's JSON serializable
            query_result = query_result.where(pd.notnull(query_result), None)
            data = query_result.to_dict(orient="records")
            print(f"[CSV Agent] Query returned {len(data)} rows.")
            
            # Use another LLM call to interpret the result
            interpreter_prompt = f"""
You are a helpful data analyst. A user analyzed their CSV file.
User's Question: {prompt}
SQL Query Used: {sql_query}
Query Result Data: {data}

Write a short, professional response explaining these results to the user. Do not include markdown or anything other than the explanation text.
"""
            llm_interpreter = ChatOpenAI(model="gpt-4o-mini")
            ai_response = llm_interpreter.invoke(interpreter_prompt).content

            print(f"[CSV Agent] Interpreter LLM response successfully generated.")

        except Exception as sql_e:
            print(f"[CSV Agent] Error executing or interpreting SQL: {str(sql_e)}")
            data = []
            ai_response = "I encountered an error trying to analyze the data with the generated SQL."

        return {
            "success": True,
            "type": "data",
            "prompt": prompt,
            "response": ai_response,
            "sql_query": sql_query,
            "chart_type": chart_type,
            "x_axis": x_axis,
            "y_axis": y_axis,
            "data": data
        }
    except Exception as e:
        print("Analyze CSV inside Agent Error:", str(e))
        return {
            "success": False,
            "error": str(e)
        }
