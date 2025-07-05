// src/Analyse.js
import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Analyze() {
  const [pdf, setPdf] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", pdf);
    await axios.post("http://127.0.0.1:5000/upload", formData);
    alert("PDF uploaded and processed!");
  };

  const handleAsk = async () => {
    const res = await axios.post("http://localhost:5000/ask", {
      question,
    });
    setAnswer(res.data.answer);
  };

  return (
    <div className="min-h-screen bg-[#FFFCFB] flex flex-col items-center px-4 py-10 font-sans">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-[#093FB4] mb-6 text-center">
          🩺 Medical Report Analyzer
        </h1>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files[0])}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-[#FFD8D8] placeholder-gray-600"
        />
        <button
          onClick={handleUpload}
          className="w-full py-3 mb-6 bg-[#ED3500] text-white rounded-lg font-semibold hover:bg-[#d12f00] transition"
        >
          Upload PDF
        </button>

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something like 'What is the diagnosis?'"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-[#FFFCFB] placeholder-gray-600"
        />
        <button
          onClick={handleAsk}
          className="w-full py-3 mb-6 bg-[#093FB4] text-white rounded-lg font-semibold hover:bg-blue-800 transition"
        >
          Ask Question
        </button>

        {answer && (
          <div className="bg-[#FFD8D8] p-6 rounded-lg mt-4">
            <h3 className="text-lg font-bold text-[#093FB4] mb-2">Answer:</h3>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analyze;
