from dotenv import load_dotenv
from langchain_openai import  ChatOpenAI
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage, BaseMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, START
from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.prompts import load_prompt
from agent.tools.generate_sql_and_chart import generate_sql_and_chart
from agent.tools.get_schema import get_schema
from agent.tools.insight_Tool import insight_agent
from agent.tools.fetch_db import fetch_data
import uuid


load_dotenv()

class chatstate(TypedDict):
   messages:Annotated[list[BaseMessage],add_messages]

template = load_prompt('agent/prompts/main_agent_prompt.json')
def chat_node(state:chatstate):
   msg = state["messages"]
   sys_prompt = SystemMessage(content=template.invoke({}).to_string())
   if not any(m.type == "system" for m in msg):
    msg = [sys_prompt] + msg
   try:
      response = llm.invoke(msg)
   except Exception as e:
      print("LLM ERROR:", e)
      response = AIMessage(content=f"Error: {str(e)}")
   return {"messages": [response]}
# *****************tools*******************

tools =[
   generate_sql_and_chart,
   get_schema,
   insight_agent

]
tool_node = ToolNode(tools)

llm = ChatOpenAI(model="gpt-4o",temperature=0.2).bind_tools(tools)

graph = StateGraph(chatstate)
graph.add_node("chat_node",chat_node)
graph.add_node("tools",tool_node)
graph.add_edge(START,"chat_node")
graph.add_conditional_edges("chat_node",tools_condition)
graph.add_edge("tools","chat_node")

# Checkpointer
checkpointer = InMemorySaver()

chatbot = graph.compile(checkpointer=checkpointer)
config = {"configurable": {"thread_id": str(uuid.uuid4())}}
if __name__ == "__main__":
   while True :
      inp = input("Enter ur msg: ")
      response = chatbot.invoke({"messages":[HumanMessage(content=inp)]},config=config)
      print(response["messages"][-1].content)