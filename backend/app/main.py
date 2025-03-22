from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from openai import OpenAI

# LangChain用
from app.rag_utils import create_qa_chain

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# FastAPIアプリ初期化
app = FastAPI()

# CORS設定（Next.jsのポートを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# クエリの入力形式
class ChatRequest(BaseModel):
    message: str

# ChatGPTだけで応答（通常のチャット）
@app.post("/chat")
def chat(req: ChatRequest):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": req.message}]
    )
    return {"reply": response.choices[0].message.content}

# RAG（PDFベースで回答）用チェーン
qa_chain = create_qa_chain()

@app.post("/chat_rag")
def chat_rag(req: ChatRequest):
    response = qa_chain.invoke({"query": req.message})
    return {"reply": response["result"]}
