from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import BaseModel,Field
import psycopg2
import os
import json

load_dotenv()

# schema 
class SQLResponse(BaseModel):
    sql_query: str = Field(
        description="PostgreSQL query written in one line"
    )
    
    chart_type: str = Field(
        description="Best chart to visualize the result",
        examples=["metric","bar","line","pie"]
    )
llm = ChatOpenAI(model="gpt-4o-mini")

structured_llm = llm.with_structured_output(SQLResponse)

def get_schema():
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

   cur.close()
   conn.close()

   return schema_text


def sql_generator(question: str) -> dict:
   """
   Generate SQL query from a user question using the database schema.
   Returns JSON containing SQL query and recommended chart type.
   """
   schema = get_schema()
   prompt = f"""
You are an expert SQL analyst.
Database Schema:
{schema}
User Question:
{question}
Rules:
- Only generate SELECT queries
- Use only columns present in schema
- Use aggregation (SUM, COUNT, GROUP BY) when needed
- Do not use INSERT, UPDATE, DELETE, DROP
- Return SQL in a single line

Also suggest the best chart_type:
metric, bar, line, pie

Return JSON with:
sql_query
chart_type
"""
   result = structured_llm.invoke(prompt)
   print(json.dumps(result.model_dump()))
   return json.dumps(result.model_dump())

if __name__ == "__main__":
   sql_generator("Total revenue from januarry to febrary in 2024")