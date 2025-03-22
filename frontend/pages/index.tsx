import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

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

      setUploadedFilename(res.data.filename);
      alert("アップロード成功: " + res.data.filename);
    } catch (err) {
      alert("アップロード失敗");
      console.error(err);
    }
  };

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
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          📄 RAGチャットボット
        </h1>

        <div className="bg-white rounded-xl shadow p-4 space-y-3">
          <p className="font-medium text-gray-700">PDFをアップロード：</p>
          <div className="flex items-center gap-3">
            <label
              htmlFor="pdf-upload"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-pointer transition"
            >
              ファイルを選択
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition cursor-pointer"
              onClick={handleUpload}
            >
              アップロード
            </button>
          </div>
          {file && (
            <p className="text-sm text-gray-600">
              選択中のファイル: <span className="font-medium">{file.name}</span>
            </p>
          )}
          {uploadedFilename && (
            <p className="text-sm text-green-600">
              アップロード済: {uploadedFilename}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-4 h-96 overflow-y-auto flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap text-sm ${
                msg.startsWith("🧑‍💻")
                  ? "bg-blue-100 self-end text-right"
                  : "bg-gray-100 self-start"
              }`}
            >
              {msg}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            className="flex-1 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力..."
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition cursor-pointer"
            onClick={handleSend}
          >
            送信
          </button>
        </div>
      </div>
    </main>
  );
}
