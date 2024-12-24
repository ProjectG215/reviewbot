from flask import Flask, request, jsonify
from langchain.vectorstores import FAISS
from flask_cors import CORS
from langchain.docstore.document import Document as langchainDocument
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores.utils import DistanceStrategy
from transformers import AutoTokenizer
from huggingface_hub import InferenceClient

app = Flask(__name__)
CORS(app)


# Meta-Llama API details
LLAMA_API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B"
headers = {"Authorization": "Bearer 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"}  # Replace with your API key

client = InferenceClient(api_key="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")

# Initialize global variables
RAW_KNOWLEDGE_BASE = []
KNOWLEDGE_VECTOR_DATABASE = None

MARKDOWN_SEPARATORS = [
    "\n#{1,6}", "```\n", "\n\\\\\\*+\n", "\n---+\n", "\n_+\n", "\n\n", "\n", " ", ""
]

def split_documents(chunk_size, knowledge_base):
    text_splitter = RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
        AutoTokenizer.from_pretrained("nomic-ai/nomic-embed-text-v1"),
        chunk_size=chunk_size,
        chunk_overlap=int(chunk_size / 10),
        add_start_index=True,
        strip_whitespace=True,
        separators=MARKDOWN_SEPARATORS,
    )
    docs_processed = []
    for doc in knowledge_base:
        docs_processed += text_splitter.split_documents([doc])

    unique_texts = {}
    docs_processed_unique = []
    for doc in docs_processed:
        if doc.page_content not in unique_texts:
            unique_texts[doc.page_content] = True
            docs_processed_unique.append(doc)
    return docs_processed_unique

@app.route('/upload_reviews', methods=['POST'])
def upload_reviews():
    global RAW_KNOWLEDGE_BASE, KNOWLEDGE_VECTOR_DATABASE

    # Check if reviews is a list or nested object
    reviews_data = request.json.get('reviews', [])
    if isinstance(reviews_data, dict):
        reviews = reviews_data.get('reviews', [])
    else:
        reviews = reviews_data
    
    if not reviews:
        return jsonify({"error": "No reviews provided"}), 400

    RAW_KNOWLEDGE_BASE = [
        langchainDocument(page_content=review['review']) for review in reviews
    ]

    # Process and index knowledge base
    docs_processed = split_documents(512, RAW_KNOWLEDGE_BASE)

    embed_model = HuggingFaceEmbeddings(
        model_name="nomic-ai/nomic-embed-text-v1",
        model_kwargs={"device": "cpu", "trust_remote_code": True},
        encode_kwargs={"normalize_embeddings": True},
    )

    KNOWLEDGE_VECTOR_DATABASE = FAISS.from_documents(
        docs_processed,
        embed_model,
        distance_strategy=DistanceStrategy.COSINE,
    )

    return jsonify({"message": "Reviews uploaded and processed successfully."})

# def upload_reviews():
#     global RAW_KNOWLEDGE_BASE, KNOWLEDGE_VECTOR_DATABASE

#     reviews = request.json.get('reviews', [])
#     if not reviews:
#         return jsonify({"error": "No reviews provided"}), 400

#     # Convert to langchain documents
#     RAW_KNOWLEDGE_BASE = [
#         langchainDocument(page_content=review['text']) for review in reviews
#     ]

#     # Process and index knowledge base
#     docs_processed = split_documents(512, RAW_KNOWLEDGE_BASE)

#     embed_model = HuggingFaceEmbeddings(
#         model_name="nomic-ai/nomic-embed-text-v1",
#         model_kwargs={"device": "cuda", "trust_remote_code": True},
#         encode_kwargs={"normalize_embeddings": True},
#     )

#     KNOWLEDGE_VECTOR_DATABASE = FAISS.from_documents(
#         docs_processed,
#         embed_model,
#         distance_strategy=DistanceStrategy.COSINE,
#     )

#     return jsonify({"message": "Reviews uploaded and processed successfully."})

@app.route('/query', methods=['POST'])
def query_knowledge_base():
    global KNOWLEDGE_VECTOR_DATABASE
    if KNOWLEDGE_VECTOR_DATABASE is None:
        return jsonify({"error": "Knowledge base is not initialized."}), 400

    user_query = request.json.get('question', '')
    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    retrieval_docs = KNOWLEDGE_VECTOR_DATABASE.similarity_search(query=user_query, k=2)
    retrieved_docs_text = [doc.page_content for doc in retrieval_docs]
    context = "\n".join(retrieved_docs_text)

    prompt = f"""
        Context: {context}

        Question: {user_query}

    Based on the context provided, answer the question as accurately as possible. If the answer is not found in the context, respond with "The information is not available in the provided context."""
    messages = [{"role": "user", "content": prompt}]

    completion = client.chat.completions.create(
        model="Qwen/Qwen2.5-Coder-32B-Instruct",
        messages=messages,
        max_tokens=500
    )
    response = completion.choices[0].message["content"]

    return jsonify({"answer": response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)