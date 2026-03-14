from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from pydantic import BaseModel,Field
import psycopg2
import os
import json
from pydantic import BaseModel, Field
from typing import Optional

load_dotenv()

class SQLFixResponse(BaseModel):
    corrected_sql: str

llm = ChatOpenAI(model="gpt-4o-mini")
structured_llm = llm.with_structured_output(SQLFixResponse)

def fix_sql(sql_query, error, schema_context):

    prompt = f"""
You are a SQL debugging expert.

The following SQL query failed when executed.

DATABASE SCHEMA:
{schema_context}

SQL QUERY:
{sql_query}

DATABASE ERROR:
{error}

Task:
Fix the SQL query so that it runs correctly.

Rules:
- Use only columns present in the schema
- Do not invent tables or columns
- Return only the corrected SQL query
"""

    response = llm.with_structured_output(SQLFixResponse).invoke(prompt)

    return response.corrected_sql


def execute_sql(query):
   conn = psycopg2.connect(
      host="aws-1-ap-southeast-1.pooler.supabase.com",
      database="postgres",
      user="postgres.ddmzvulqgwojyfnswvif",
      password="Soumyajit@185",
      port=5432,
      sslmode="require"
   )
   cur = conn.cursor()
   cur.execute(query)
   rows = cur.fetchall()
   cur.close()
   conn.close()
   return rows