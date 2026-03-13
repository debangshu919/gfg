from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import BaseModel,Field
import psycopg2
import os
import json

load_dotenv()

# schema 
from pydantic import BaseModel, Field
from typing import Optional

class SQLResponse(BaseModel):

    sql_query: str = Field(
        description="PostgreSQL SELECT query written in a single line. Only use columns from the dataset."
    )

    chart_type: str = Field(
        description="Best chart type to visualize the query result",
        examples=["metric", "bar", "line", "pie", "scatter"]
    )

    x_axis: Optional[str] = Field(
        description="Column name used for x-axis if the chart requires it",
        default=None
    )

    y_axis: Optional[str] = Field(
        description="Column name used for y-axis if the chart requires it",
        default=None
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

@tool
def sql_generator(question: str) -> dict:
   """
   Generate SQL query from a user question using the database schema.
   Returns JSON containing SQL query and recommended chart type.
   """
   schema = get_schema()
   prompt = f"""
You are an expert data analyst and SQL specialist responsible for converting business questions into SQL queries for a business intelligence dashboard.
Your goal is to translate a natural language question into a correct SQL query using the provided database schema.
DATABASE SCHEMA:{schema}
USER QUESTION:{question}

TASK:
1. Understand the user's analytical intent.
2. Generate a valid SQL SELECT query that answers the question.
3. Recommend the best chart type to visualize the result.

SCHEMA ANALYSIS:
Before writing the SQL query:
1. Identify the table(s) relevant to the user question.
2. Identify the column(s) needed to answer the question.
3. Ensure every column used in the SQL query exists in the schema.
Only after confirming the relevant tables and columns, generate the SQL query.

SQL RULES:
1. Only generate SELECT queries.
2. NEVER generate INSERT, UPDATE, DELETE, DROP, ALTER, or CREATE statements.
3. Use only tables and columns that exist in the provided schema.
4. Do not invent columns or tables.
5. Write the SQL query in a SINGLE LINE.
6. Prefer aggregation when analyzing data (SUM, AVG, COUNT).
7. Use GROUP BY when aggregating by categories.
8. Use ORDER BY when ranking or sorting results.
9. Use LIMIT when returning top results.
10. Use LOWER() for case-insensitive string comparisons if filtering text values.
11. Avoid returning large raw datasets unless explicitly requested.

CHART SELECTION RULES:
Choose the chart type based on the query result:
metric: Use when the result returns a single numeric value (e.g., total, average, count).
bar: Use when comparing values across categories.
line: Use when showing trends over time or ordered sequences.
pie: Use when showing percentage or distribution of a total.
scatter: Use when showing the relationship between two numeric variables.


AXIS SELECTION RULES:
If a chart requires axes:
x_axis: Use the categorical or time column.
y_axis: Use the numeric aggregated column.
If the chart type is "metric", x_axis and y_axis should be null.


OUTPUT FORMAT:
Return ONLY valid JSON.
The JSON must follow this structure:
{{
  "sql_query": "SQL query written in one line",
  "chart_type": "metric | bar | line | pie | scatter",
  "x_axis": "column name or null",
  "y_axis": "column name or null"
}}

Do not include explanations.
Do not include markdown.
Return only JSON.


Example"

User question: Which region generated the highest revenue?

Expected output:
{{
  "sql_query": "SELECT region, SUM(revenue) AS total_revenue FROM sales GROUP BY region ORDER BY total_revenue DESC",
  "chart_type": "bar",
  "x_axis": "region",
  "y_axis": "total_revenue"
}}
"""
   result = structured_llm.invoke(prompt)
   print(json.dumps(result.model_dump()))
   return json.dumps(result.model_dump())

if __name__ == "__main__":
   sql_generator("Total revenue from januarry to febrary in 2024")