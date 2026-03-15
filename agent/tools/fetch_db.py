import psycopg2

def fetch_data(sql_query: str) -> str:
    """
    Execute a SQL query on the database and return the resulting data.
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
        return colnames, rows

    except Exception as e:
        raise Exception(f"Database query failed: {str(e)}")