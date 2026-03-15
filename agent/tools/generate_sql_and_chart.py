from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import BaseModel,Field
import psycopg2
import os
import json
from pydantic import BaseModel, Field
from typing import Optional
from agent.tools.sql_validator import fix_sql, execute_sql
from typing import Literal
from langchain_core.prompts import load_prompt
load_dotenv()

# model output format
class SQLResponse(BaseModel):
    sql_query: Optional[str] = Field(
        description="PostgreSQL SELECT query written in a single line. Only use columns from the dataset.",
        default=None)

    chart_type: Optional[Literal['metric', 'bar','line','pie','scatter']] = Field(
        description="Best chart type to visualize the query result",
        default=None
        )
    x_axis: Optional[str] = Field(
        description="Column name used for x-axis if the chart requires it",
        default=None)
    y_axis: Optional[str] = Field(
        description="Column name used for y-axis if the chart requires it",
        default=None)
    message: Optional[str] = Field(
        description="Give error message if dataset does not contain information required to answer this question.",
        default=None)
    
# *************llm-models and prompts**************
llm = ChatOpenAI(model="gpt-4o")
structured_llm = llm.with_structured_output(SQLResponse)

template = load_prompt(r'agent\prompts\sql_gen_prompt.json')
# *************get schema and sample of dataset**************
def get_schema_and_samples():
   conn = psycopg2.connect(
      host="aws-1-ap-southeast-1.pooler.supabase.com",
      database="postgres",
      user="postgres.ddmzvulqgwojyfnswvif",
      password="Soumyajit@185",
      port=5432,
      sslmode="require"
   )
   cur = conn.cursor()
   cur.execute("""
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema='public';
   """)

   tables = cur.fetchall()

   schema_text = ""

   for table in tables:
      table = table[0]

      schema_text += f"\nTable: {table}\nColumns:\n"

      cur.execute(f"""
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name='{table}'
      """)

      columns = cur.fetchall()

      for col in columns:
         schema_text += f"- {col[0]} ({col[1]})\n"
      # fetch sample rows
      cur.execute(f"SELECT * FROM {table} LIMIT 5;")
      rows = cur.fetchall()

      if rows:
         schema_text += "\nSample rows:\n"
         for r in rows:
               schema_text += f"{r}\n"

      schema_text += "\n"
   cur.close()
   conn.close()
   # print(schema_text)
   return schema_text
SCHEMA_CONTEXT = get_schema_and_samples()

# ************* Sql generator tool **************
@tool
def generate_sql_and_chart(question: str) -> dict:
   """
    Generate an SQL query and visualization metadata from a natural language question.

    This tool analyzes a user's analytical question about the dataset and converts it
    into a valid SQL query using the database schema. It also determines the most
    appropriate chart type and axis configuration required to visualize the result.

    The generated SQL query is NOT executed by this tool. Instead, the SQL query is
    sent to the backend service, which executes the query against the database and
    returns the resulting data. The backend then uses the provided visualization
    metadata to render the chart for the user.

    Parameters
    ----------
    question : str
        The user's natural language query about the dataset.

    Returns
    -------
    dict
        A structured response containing:

        - sql_query (str | None):
            The generated SQL query. If the dataset cannot answer the question,
            this value will be None.

        - chart_type (str | None):
            Recommended chart type for visualization. Possible values include:
            "metric", "bar", "line", "pie", "scatter".

        - x_axis (str | None):
            Column name used for the x-axis in the visualization.

        - y_axis (str | None):
            Column name used for the y-axis in the visualization.

        - display_chart (bool):
            Indicates whether a chart should be rendered for the query result.

        - message (str | None):
            Explanation returned when the dataset cannot answer the user's question.

    Notes
    -----
    - Only SELECT queries should be generated.
    - The query must use only columns present in the database schema.
    - If the question cannot be answered using the available schema,
      sql_query must be None and an explanatory message should be returned.
    """
   
   print("generate_sql_and_chart tool called")
   schema = SCHEMA_CONTEXT
   prompt = template.invoke({'question':question,'schema':schema})
   res = structured_llm.invoke(prompt)
   result = res.model_dump()
   print(result)
   sql_query = result["sql_query"]
   chart_type = result["chart_type"]
   x_axis = result["x_axis"]
   y_axis = result["y_axis"]
   
   if sql_query is None or sql_query == "null":
    return json.dumps(result)

   max_attempts = 3

   for attempt in range(max_attempts):
      try:
         print(f"Attempt {attempt + 1}: Executing SQL")
         # safety check
         if not sql_query.lower().strip().startswith("select"):
            raise ValueError("Only SELECT queries are allowed")
         # if "limit" not in sql_query.lower():
         #    sql_query += " LIMIT 100"
         data = execute_sql(sql_query)
         print("SQL executed successfully")
         return json.dumps({
               "sql": sql_query,
               "chart_type": chart_type,
               "x_axis": x_axis,
               "y_axis": y_axis
         })
      except Exception as e:
         print("SQL failed:", str(e))
         if attempt == max_attempts - 1:
               raise Exception("SQL failed after retries")
         # fix SQL using LLM
         sql_query = fix_sql(sql_query, str(e), SCHEMA_CONTEXT)

if __name__ == "__main__":
   res = display_graph("Which region generated the highest average revenue per order in 2024?")
   print(res)