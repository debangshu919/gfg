from dotenv import load_dotenv
from langchain_openai import  ChatOpenAI
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage, BaseMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, START
from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import InMemorySaver

from agent.tools.sql_generator import sql_generator
import uuid


load_dotenv()

class chatstate(TypedDict):
   messages:Annotated[list[BaseMessage],add_messages]


def chat_node(state:chatstate):
   msg = state["messages"]
   sys_prompt = SystemMessage(content='''
You are an AI Business Intelligence Analyst.

Your responsibilities:

1. Chat naturally with the user.
2. Answer general questions about the dataset.
3. When the user asks for data analysis,
   use the available tools.

Tools available:
- sql_generator: use to generate sql query

Always use schema information before generating SQL.
Never invent tables or columns.
Explain insights clearly.
                              ''')
   if not any(m.type == "system" for m in msg):
      msg = [sys_prompt] + msg
   try:
      response= llm.invoke(msg)
   except:
      response = AIMessage(content="# Some error occured")
   return {"messages":[response]}

# *****************tools*******************

tools =[sql_generator
        ]
tool_node = ToolNode(tools)

llm = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)

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