# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import process_pdf, ask_question
import os

app = Flask(__name__)
CORS(app)

# Global storage
pdf_store = {}

@app.route("/upload", methods=["POST"])
def upload_pdf():
    file = request.files['file']
    file_path = f"./sample_reports/{file.filename}"
    file.save(file_path)

    index, docs = process_pdf(file_path)
    pdf_store["index"] = index
    pdf_store["docs"] = docs

    return jsonify({"message": "PDF processed successfully."})


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question")

    if "index" not in pdf_store:
        return jsonify({"error": "Upload a PDF first."}), 400

    answer = ask_question(question, pdf_store["index"])
    return jsonify({
    "status": "success",
    "response_type": "medical_insight",
    "answer": answer.strip()
})




if __name__ == "__main__":
    app.run(debug=True)
