import io
import json
import uuid

import pandas as pd
import psycopg2
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage, ToolMessage
from pydantic import BaseModel

from agent.csv_agent import analyze_csv_logic
from agent.main_agent import chatbot
from agent.tools.insight_Tool import insight_agent

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
    thread_id: str | None = None


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

        # Use a stable thread_id per client session (if provided)
        # so you keep conversational context without sharing it
        # across users or browser refreshes.
        thread_id = prompt.thread_id or str(uuid.uuid4())
        request_config = {"configurable": {"thread_id": thread_id}}

        response = chatbot.invoke(
            {"messages": [HumanMessage(content=prompt.message)]},
            config=request_config,
        )

        messages = response["messages"]
        ai_response = messages[-1].content

        # Only consider tools that were invoked *after* the current
        # user message in this turn. This avoids reusing an old
        # ToolMessage from a previous question in the same thread.
        tool_result = None

        # Find the last HumanMessage matching the current prompt
        # and only look for tools that occurred after it.
        last_human_idx = None
        for idx in range(len(messages) - 1, -1, -1):
            msg = messages[idx]
            if isinstance(msg, HumanMessage) and msg.content == prompt.message:
                last_human_idx = idx
                break

        if last_human_idx is not None:
            for msg in reversed(messages[last_human_idx + 1 :]):
                if isinstance(msg, ToolMessage):
                    try:
                        parsed_msg = json.loads(msg.content)
                        if isinstance(parsed_msg, dict):
                            tool_result = parsed_msg
                            break  # take the most recent tool for this turn
                    except (json.JSONDecodeError, TypeError):
                        continue

        #  CASE 1 — No tool used (normal chat)
        if not tool_result:
            return {
                "success": True,
                "type": "chat",
                "prompt": prompt.message,
                "response": ai_response,
                "thread_id": thread_id,
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
                "thread_id": thread_id,
            }
        #  CASE 2 — Dataset cannot answer
        if not sql or sql == "null":
            return {
                "success": True,
                "type": "chat",
                "prompt": prompt.message,
                "response": ai_response,
                "thread_id": thread_id,
            }

        #  CASE 3 — Valid SQL query
        chart_type = tool_result["chart_type"]
        x_axis = tool_result.get("x_axis")
        y_axis = tool_result.get("y_axis")

        columns, rows = fetch_data(sql)
        data = [dict(zip(columns, row)) for row in rows]

        insights = None
        try:
            if hasattr(insight_agent, "invoke"):
                insight_result = insight_agent.invoke(
                    {"sql_query": sql, "question": prompt.message}
                )
            else:
                insight_result = insight_agent(sql_query=sql, question=prompt.message)
            if isinstance(insight_result, dict):
                insights = insight_result.get("insights")
        except Exception as e:
            print("Insight generation error:", str(e))

        return {
            "success": True,
            "type": "data",
            "prompt": prompt.message,
            "response": ai_response,
            "insights": insights,
            "sql_query": sql,
            "chart_type": chart_type,
            "x_axis": x_axis,
            "y_axis": y_axis,
            "data": data,
            "thread_id": thread_id,
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
