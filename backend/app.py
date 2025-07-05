# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import process_pdf, ask_question
import os
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, datetime
from functools import wraps 

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key_here'


client = MongoClient("mongodb+srv://sameekshamenda19:R0HrXewa0Z2qUO2J@medanalyse.cdwabgx.mongodb.net/?retryWrites=true&w=majority&appName=medanalyse")
db = client.medAnalyze
users = db.users

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



# Utility function to verify token
def token_required(f):
    @wraps(f)  # <== THIS is the fix
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            user = users.find_one({'email': data['email']})
            if not user:
                raise Exception('User not found')
        except:
            return jsonify({'message': 'Invalid Token'}), 401
        return f(user, *args, **kwargs)
    return wrapper

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if users.find_one({'email': data['email']}):
        return jsonify({'message': 'Email already registered'}), 400

    hashed_pw = generate_password_hash(data['password'])
    users.insert_one({
        'name': data['name'],
        'email': data['email'],
        'password': hashed_pw,
        'history': []
    })
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users.find_one({'email': data['email']})
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = jwt.encode({
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, app.config['SECRET_KEY'])
    return jsonify({'token': token})

@app.route('/ask_auth', methods=['POST'])
@token_required
def ask_auth(user):
    data = request.json
    qna = {
        'question': data['question'],
        'answer': 'Mocked Answer from AI backend',
        'timestamp': datetime.datetime.utcnow()
    }
    users.update_one({'email': user['email']}, {'$push': {'history': qna}})
    return jsonify({'answer': qna['answer']})

@app.route('/history', methods=['GET'])
@token_required
def history(user):
    return jsonify({'history': user['history']})


if __name__ == "__main__":
    app.run(debug=True)
