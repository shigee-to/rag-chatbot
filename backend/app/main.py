from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
from openai import OpenAI
from app.rag_utils import create_qa_chain_from_pdf

app = FastAPI()

# CORS設定（Next.jsフロントからアクセス許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAIクライアント
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# アップロード用ディレクトリ
UPLOAD_DIR = "app/uploaded"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# チャット用モデル
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(req: ChatRequest):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": req.message}]
    )
    return {"reply": response.choices[0].message.content}

# PDFファイルをアップロード
@app.post("/upload_pdf")
def upload_pdf(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_DIR, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": f"{file.filename} をアップロードしました！", "filename": file.filename}

# アップロード済PDFに対して質問
@app.post("/chat_rag_uploaded")
def chat_rag_uploaded(message: str = Form(...), filename: str = Form(...)):
    pdf_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(pdf_path):
        return {"error": "ファイルが存在しません"}

    qa_chain = create_qa_chain_from_pdf(pdf_path)
    response = qa_chain.invoke({"query": message})
    return {"reply": response["result"]}
