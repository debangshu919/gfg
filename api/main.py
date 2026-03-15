import io
import json

import pandas as pd
import psycopg2
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage, ToolMessage
from pydantic import BaseModel

from agent.csv_agent import analyze_csv_logic
from agent.main_agent import chatbot, config

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Chat(BaseModel):
    message: str


def fetch_data(sql_query):
    conn = psycopg2.connect(
        host="aws-1-ap-southeast-1.pooler.supabase.com",
        database="postgres",
        user="postgres.ddmzvulqgwojyfnswvif",
        password="Soumyajit@185",
        port=5432,
        sslmode="require",
    )
    cur = conn.cursor()
    cur.execute(sql_query)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return columns, rows


@app.get("/")
def health():
    return {"success": True, "message": "API is running"}


@app.post("/chat")
def chat(prompt: Chat):
    try:
        print("Received message:", prompt.message)

        response = chatbot.invoke(
            {"messages": [HumanMessage(content=prompt.message)]}, config=config
        )

        messages = response["messages"]
        ai_response = messages[-1].content

        tool_result = None

        for msg in reversed(messages):
            if isinstance(msg, ToolMessage):
                try:
                    parsed_msg = json.loads(msg.content)

                    if isinstance(parsed_msg, dict):
                        tool_result = parsed_msg

                except (json.JSONDecodeError, TypeError):
                    pass

        #  CASE 1 — No tool used (normal chat)
        if not tool_result:
            return {
                "success": True,
                "type": "chat",
                "prompt": prompt.message,
                "response": ai_response,
            }

        # Support both "sql_query" and "sql" keys from tools
        sql = tool_result.get("sql_query") or tool_result.get("sql")
        # CASE — Insight agent result
        if "insights" in tool_result:
            return {
                "success": True,
                "type": "insight",
                "prompt": prompt.message,
                "response": tool_result["insights"],
                "sql_query": tool_result.get("sql_query") or tool_result.get("sql"),
                "data": tool_result.get("data_sample") or tool_result.get("data"),
            }
        #  CASE 2 — Dataset cannot answer
        if not sql or sql == "null":
            return {
                "success": True,
                "type": "chat",
                "prompt": prompt.message,
                "response": ai_response,
            }

        #  CASE 3 — Valid SQL query
        chart_type = tool_result["chart_type"]
        x_axis = tool_result.get("x_axis")
        y_axis = tool_result.get("y_axis")

        columns, rows = fetch_data(sql)
        data = [dict(zip(columns, row)) for row in rows]

        return {
            "success": True,
            "type": "data",
            "prompt": prompt.message,
            "response": ai_response,
            "sql_query": sql,
            "chart_type": chart_type,
            "x_axis": x_axis,
            "y_axis": y_axis,
            "data": data,
        }

    except Exception as e:
        print(str(e))

        return {"success": False, "error": str(e)}


@app.post("/analyze")
async def analyze_csv(prompt: str = Form(...), file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        # Use our new Agent to process CSV logic
        return analyze_csv_logic(df, prompt)
    except Exception as e:
        print("Analyze CSV Error:", str(e))
        return {"success": False, "error": str(e)}
