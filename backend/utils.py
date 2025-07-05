# backend/utils.py
import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI

from langchain.text_splitter import RecursiveCharacterTextSplitter

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GOOGLE_API_KEY)

def process_pdf(file_path):
    loader = PyPDFLoader(file_path)
    pages = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = splitter.split_documents(pages)
    vector_index = FAISS.from_documents(docs, embedding)
    return vector_index, docs

# def ask_question(question, index):
#     qa_chain = RetrievalQA.from_chain_type(
#         llm=llm,
#         retriever=index.as_retriever(),
#         return_source_documents=False
#     )
#     result = qa_chain.run(question)
#     return result

def ask_question(question, index):
    retriever = index.as_retriever()
    docs = retriever.invoke(question)

    context = "\n\n".join([doc.page_content for doc in docs])

    prompt = (
        "You are a knowledgeable medical assistant. Based strictly on the medical document provided, "
        "answer the question below in **Markdown format** using bullet points, headings, and bold text where appropriate "
        "to ensure readability.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}"
    )

    model = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.3,
        google_api_key=GOOGLE_API_KEY
    )

    response = model.invoke(prompt)
    return response.content
    retriever = index.as_retriever()
    docs = retriever.invoke(question)

    context = "\n\n".join([doc.page_content for doc in docs])

    prompt = (
        "You are a knowledgeable medical assistant. Based strictly on the medical document provided, "
        "answer the question below with medically accurate and evidence-based information.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}"
    )

    model = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",  # or gemini-1.5-flash
        temperature=0.3,
        google_api_key=GOOGLE_API_KEY
    )

    response = model.invoke(prompt)
    return response.content



