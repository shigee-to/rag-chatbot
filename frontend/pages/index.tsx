import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = async () => {
    if (!input) return;

    setMessages((prev) => [...prev, `🧑‍💻: ${input}`]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: input,
      });
      setMessages((prev) => [...prev, `🤖: ${res.data.reply}`]);
    } catch (err) {
      setMessages((prev) => [...prev, "❌: エラーが発生しました"]);
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧠 ChatBot UI</h1>

      <div className="border p-4 rounded h-96 overflow-y-scroll mb-4 bg-white shadow">
        {messages.map((msg, i) => (
          <p key={i} className="mb-2 whitespace-pre-wrap">
            {msg}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問を入力..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          送信
        </button>
      </div>
    </main>
  );
}
