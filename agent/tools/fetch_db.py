import psycopg2
from langchain_core.tools import tool
import json

@tool
def fetch_data(sql_query: str) -> str:
    """
    Fetches data from the PostgreSQL database using the provided SQL query.
    Takes a valid SQL SELECT query as input and returns the fetched data as a JSON string.
    """
    print("fetch data tool called")
    try:
        conn = psycopg2.connect(
            host="aws-1-ap-southeast-1.pooler.supabase.com",
            database="postgres",
            user="postgres.ddmzvulqgwojyfnswvif",
            password="Soumyajit@185",
            port=5432,
            sslmode="require"
        )
        cur = conn.cursor()
        cur.execute(sql_query)
        rows = cur.fetchall()
        
        # Get column names
        colnames = [desc[0] for desc in cur.description] if cur.description else []
        
        cur.close()
        conn.close()
        
        # Convert to list of dicts for JSON serialization
        result = [dict(zip(colnames, row)) for row in rows]
        print(result)
        return json.dumps(result, default=str)
    except Exception as e:
        return json.dumps({"error": str(e)})
