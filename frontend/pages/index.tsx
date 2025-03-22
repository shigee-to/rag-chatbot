import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string>("");

  // ファイル選択
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  // ファイルアップロード
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/upload_pdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("アップロード成功:", res.data);
      setUploadedFilename(res.data.filename); // ← ここが重要！
      alert("アップロード成功: " + res.data.filename);
    } catch (err) {
      alert("アップロード失敗");
      console.error(err);
    }
  };

  // PDFに基づく質問
  const handleSend = async () => {
    if (!input) return;

    if (!uploadedFilename) {
      alert("先にPDFをアップロードしてください！");
      return;
    }

    setMessages((prev) => [...prev, `🧑‍💻: ${input}`]);
    setInput("");

    try {
      const formData = new FormData();
      formData.append("message", input);
      formData.append("filename", uploadedFilename);

      const res = await axios.post(
        "http://localhost:8000/chat_rag_uploaded",
        formData
      );
      setMessages((prev) => [...prev, `🤖: ${res.data.reply}`]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, "❌: エラーが発生しました"]);
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">📄 RAGチャットボット</h1>

      {/* アップロードエリア */}
      <div className="border p-4 rounded shadow">
        <p className="mb-2">PDFを選択してアップロード：</p>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button
          className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
          onClick={handleUpload}
        >
          アップロード
        </button>
        {uploadedFilename && (
          <p className="mt-2 text-sm text-green-600">
            アップロード済: {uploadedFilename}
          </p>
        )}
      </div>

      {/* チャットログ */}
      <div className="border p-4 rounded h-96 overflow-y-scroll bg-white shadow">
        {messages.map((msg, i) => (
          <p key={i} className="mb-2 whitespace-pre-wrap">
            {msg}
          </p>
        ))}
      </div>

      {/* 入力フォーム */}
      <div className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問を入力..."
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          送信
        </button>
      </div>
    </main>
  );
}
