import psycopg2
from langchain_core.tools import tool
import json
from agent.tools.generate_sql_and_chart import SCHEMA_CONTEXT

@tool
def get_schema() -> str:
    """
   Retrieve the database schema and sample data from the dataset.

    This tool provides structural information about the database so the
    agent can understand how the data is organized before generating SQL queries.
    It returns the table names, column names, and a small number of sample rows.

    The schema helps the agent:
    - identify available tables and columns
    - understand data types and relationships
    - observe example values in the dataset

    Returns
    -------
    str
        A formatted description of the database schema containing:

        - table names
        - column names and data types
        - a few sample rows from each table

    Notes
    -----
    - This tool should be used when the agent needs to understand the structure
      of the database before generating SQL queries.
    - The sample rows are provided only to help understand the data format and
      should not be treated as the complete dataset.
    """
    return SCHEMA_CONTEXT