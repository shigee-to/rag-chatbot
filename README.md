# RAG ChatBot - PDF ナレッジ検索 AI

このアプリは、LangChain や OpenAI API の実践的な活用方法を学びながら、  
PDF ベースの社内ナレッジ検索を想定したチャットボットとして開発しました。

PDF をアップロードすると、その内容に基づいて ChatGPT が質問に回答してくれます。  
社内のマニュアルや技術資料などを効率的に活用する仕組みを、自分でゼロから構築しました。

---

## 機能概要

- PDF をアップロードし、内容に基づいた回答を取得
- LangChain を活用した RAG 構成（ベクトル検索＋生成 AI）
- FastAPI（バックエンド） + Next.js（フロントエンド）
- Docker 化によりローカル環境構築も簡単

---

## 使用技術

| 分類           | 技術スタック                       |
| -------------- | ---------------------------------- |
| フロントエンド | Next.js (TypeScript), Tailwind CSS |
| バックエンド   | FastAPI                            |
| AI 関連        | LangChain, OpenAI GPT-3.5          |
| ベクトル DB    | FAISS                              |
| その他         | Docker, Python, Axios              |

---

## セットアップ手順

```bash
git clone 
cd rag-chatbot

# .env ファイルを作成し、OpenAI APIキーを記載
echo "OPENAI_API_KEY=sk-xxxx..." > .env

# Dockerでバックエンド起動
docker-compose up --build

# フロントエンド起動
cd frontend
npm install
npm run dev
```
