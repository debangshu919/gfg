<p align="center">
  <h1 align="center">📊 GFG — AI Business Intelligence Platform</h1>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13+-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.104+-green.svg" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-18+-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
</p>

An AI-powered Business Intelligence platform that revolutionizes how users explore and understand business data through natural conversation. Built with **FastAPI**, **LangGraph**, and a modern **React** frontend.

## ✨ Key Features

- **🤖 Natural Language Queries**: Ask business questions in plain English and get instant insights
- **📊 Dynamic Visualizations**: Automatically generated charts and graphs tailored to your data
- **🔍 Intelligent SQL Generation**: AI-powered conversion from natural language to optimized SQL queries
- **💬 Conversational Interface**: Interactive chat experience for data exploration
- **🚀 Real-time Analysis**: Instant responses with live data processing
- **🎯 Business Intelligence**: Comprehensive analytics for revenue, sales, and operational metrics

## 🏗️ Architecture Overview

```
gfg/
├── api/
│   └── main.py              # FastAPI server (REST endpoints)
├── agent/
│   ├── workflow.py           # LangGraph chatbot (AI agent logic)
│   └── tools/
│       └── sql_generator.py  # Tool: converts natural language → SQL
├── frontend/                 # React app (Chart.js visualisations)
├── .env                      # Environment variables (API keys)
├── requirements.txt          # Python dependencies (pinned)
├── pyproject.toml            # Project metadata (uv / pip)
└── README.md
```

## 🎯 Use Cases

### Business Analytics
- **Revenue Analysis**: "What is our total revenue this quarter?"
- **Sales Performance**: "Show me sales by region for the last 6 months"
- **Trend Identification**: "Which products are showing the highest growth?"

### Operational Insights
- **Customer Metrics**: "How many new customers did we acquire last month?"
- **Performance Tracking**: "What are our top-performing product categories?"
- **Comparative Analysis**: "Compare this year's performance with last year"

## 🔧 Technology Stack

### Backend
- **FastAPI**: High-performance async web framework
- **LangGraph**: Advanced AI agent orchestration
- **OpenAI GPT**: Natural language processing and understanding
- **PostgreSQL**: Robust database for business data
- **Uvicorn**: Lightning-fast ASGI server

### Frontend
- **React 18**: Modern, component-based UI framework
- **Chart.js**: Interactive data visualization library
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework

## 🤖 AI Agent Capabilities

The intelligent agent can:
- Understand complex business queries in natural language
- Generate optimized SQL queries for data retrieval
- Determine the best visualization type for your data
- Provide contextual insights and recommendations
- Handle follow-up questions and conversations

## � Data Visualization

Automatic chart generation based on query type:
- **Bar Charts**: Perfect for categorical comparisons
- **Line Charts**: Ideal for time-series data and trends
- **Pie Charts**: Great for proportional data representation
- **Area Charts**: Excellent for cumulative data visualization

## 🔒 Security & Performance

- **API Key Protection**: Secure environment variable management
- **Input Validation**: Comprehensive request sanitization
- **Error Handling**: Graceful failure recovery
- **Optimized Queries**: Efficient SQL generation for fast responses
- **Caching Strategy**: Intelligent response caching for improved performance

## 🚀 What Makes GFG Special

1. **Zero Learning Curve**: No need to learn SQL or complex BI tools
2. **Instant Insights**: Get answers to business questions in seconds
3. **Adaptive Intelligence**: AI learns from your query patterns
4. **Scalable Architecture**: Built to handle enterprise-level data
5. **Modern UI/UX**: Intuitive interface designed for business users

## 📝 License

This project was built for the GFG Hackathon.