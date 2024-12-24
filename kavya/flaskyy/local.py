import faiss
import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

PERSIST_DIR = "./vector_store"

def get_embedding(text_data):
    return model.encode(text_data)

def create_or_load_vector_store(scraped_data):
    if not os.path.exists(PERSIST_DIR):
        os.makedirs(PERSIST_DIR)
    
    embeddings = []
    for item in scraped_data:
        embeddings.append(get_embedding(item))
    
    embedding_matrix = np.array(embeddings).astype('float32')
    embedding_matrix /= np.linalg.norm(embedding_matrix, axis=1, keepdims=True)

    index = faiss.IndexFlatIP(embedding_matrix.shape[1])
    index.add(embedding_matrix)

    faiss.write_index(index, PERSIST_DIR + "/faiss_index.index")
    return index

def get_question_embedding(question):
    return get_embedding(question)

def retrieve_relevant_docs(question,data):
    KNOWLEDGE_VECTOR_DATABASE = faiss.read_index(PERSIST_DIR + "/faiss_index.index")

    question_embedding = get_question_embedding(question)
    

    D, I = KNOWLEDGE_VECTOR_DATABASE.search(np.array([question_embedding], dtype=np.float32), k=3)

    retrieved_docs_text = [data["reviews"][i] for i in I[0]]

    return retrieved_docs_text


with open("appleReviews.json") as f:
    data = json.load(f)


index = create_or_load_vector_store(data)

question = "what is the color of the phone?"
relevant_docs = retrieve_relevant_docs(question,data)
print("Relevant Documents:", relevant_docs)


