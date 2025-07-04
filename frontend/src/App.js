import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
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
    <div className="App">
      <h1>🩺 Medical Report Analyzer</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload PDF</button>

      <br /><br />
      <input
        type="text"
        value={question}
        placeholder="Ask something like 'What is the diagnosis?'"
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAsk}>Ask</button>

      {answer && (
        <div className="answer">
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
