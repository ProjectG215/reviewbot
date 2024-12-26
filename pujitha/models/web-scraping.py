from flask import Flask, request, jsonify
from playwright.sync_api import sync_playwright
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import json
import torch
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document as langchainDocument
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores.utils import DistanceStrategy
from transformers import AutoTokenizer
from huggingface_hub import InferenceClient
import time

app = Flask(__name__)
CORS(app)

LLAMA_API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B"
headers = {"Authorization": "Bearer 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"}  # Replace with your API key

client = InferenceClient(token="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")

# Initialize global variables
RAW_KNOWLEDGE_BASE = []
KNOWLEDGE_VECTOR_DATABASE = None

MARKDOWN_SEPARATORS = [
    "\n#{1,6}", "```\n", "\n\\\\\\*+\n", "\n---+\n", "\n_+\n", "\n\n", "\n", " ", ""
]


@app.route('/senti', methods=['POST'])
def analyze_sentiment():
    tokenizer = AutoTokenizer.from_pretrained("siebert/sentiment-roberta-large-english")
    model = AutoModelForSequenceClassification.from_pretrained("siebert/sentiment-roberta-large-english")
    review_texts = request.json.get('reviewTexts') 
    print("Review texts in flask = ",review_texts)
    if not review_texts or not isinstance(review_texts, list):
        return jsonify({"error": "Invalid input, expected an array of review texts."}), 400
    
    sentiment_results = []
    positive_count = 0
    negative_count = 0
    
    for review in review_texts:
        # Tokenize the input review text
        inputs = tokenizer(review, return_tensors="pt", truncation=True, padding=True, max_length=512)

        # Run the model and get the output
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Get the predicted sentiment (0 = negative, 1 = positive)
        logits = outputs.logits
        sentiment = torch.argmax(logits, dim=-1).item()
        
        if sentiment == 1:
            positive_count += 1
        else:
            negative_count += 1
    

    return jsonify({
        "positive": positive_count,
        "negative": negative_count
    })


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


def toggle_sort(page):
    try:
        page.wait_for_selector("select.OZuttk.JEZ5ey")
        page.select_option("select.OZuttk.JEZ5ey", 'MOST_RECENT')
    
    except Exception as e:
        print(f"Error toggling sort: {e}")

def get_product_details(page):
    try:
        page.wait_for_selector("h1._6EBuvT")
        h1_element = page.query_selector("h1._6EBuvT")
        spans = h1_element.query_selector_all("span")
        product_name = ""
        for span in spans:
            product_name += span.inner_text()            
        

        page.wait_for_selector("//div[@class='Nx9bqj CxhGGd']", timeout=5000)
        product_price = page.locator("//div[@class='Nx9bqj CxhGGd']").inner_text()

        page.wait_for_selector("div._5OesEi.HDvrBb")  
        div_element = page.query_selector("div._5OesEi.HDvrBb")
        product_rating = div_element.query_selector("span.Y1HWO0").inner_text()


        page.wait_for_selector("div.vU5WPQ")        
        div_element = page.query_selector("div.vU5WPQ")
        img_element = div_element.query_selector("img")
        
        image_url = img_element.get_attribute("src")
        print(product_name, product_price, product_rating, image_url)
        
        

        return {
            "name": product_name,
            "price": product_price,
            "rating": product_rating,
            "image": image_url,
        }
    except Exception as e:
        print(f"Error occurred while getting product details: {e}")
        return {}

def get_highlights(page):
    try:
        # Wait for the container div to load
        page.wait_for_selector("div.DOjaWF", timeout=5000)

        # Locate the container with highlights
        highlights_div = page.query_selector("div.DOjaWF")
        if highlights_div:
            # Locate the div containing the "Highlights" list
            Hlist = highlights_div.query_selector("div.xFVion")
            if Hlist:
                print("In the list div")
                # Extract all list items under the ul element
                ul_element = Hlist.query_selector("ul")
                if ul_element:
                    print("In the list element, extracting list items")
                    highlights = [li.inner_text() for li in ul_element.query_selector_all("li._7eSDEz")]
                    return highlights
        return []
    except Exception as e:
        print(f"Error occurred while getting highlights: {e}")
        return []



def get_specifications(page):
    try:
        page.wait_for_selector("div._3Fm-hO", timeout=5000)
        read_more_button = page.locator("button.QqFHMw._4FgsLt")
        if read_more_button and read_more_button.is_visible():
            read_more_button.click()
            print("Clicked specs")
            time.sleep(2)

        specifications_divs = page.query_selector_all("div.GNDEQ-")
        specifications = {}

        for div in specifications_divs:
    
            category = div.query_selector("div._4BJ2V\\+").inner_text() if div.query_selector("div._4BJ2V\\+") else "Unknown Category"
            table_rows = div.query_selector_all("tr.WJdYP6.row")
            category_specs = {}
            for row in table_rows:
                key = row.query_selector("td.\\+fFi1w.col.col-3-12").inner_text() if row.query_selector("td.\\+fFi1w.col.col-3-12") else "Unknown Key"
                value = row.query_selector("td.Izz52n.col.col-9-12").inner_text() if row.query_selector("td.Izz52n.col.col-9-12") else "Unknown Value"
                category_specs[key] = value
            specifications[category] = category_specs      
        return specifications 
       
    except Exception as e:
        try:
            main_div = page.query_selector("div._5Pmv5S")
            plus_button = main_div.query_selector("img")
            if plus_button:
                plus_button.click()
                time.sleep(2)
                print("Clicked plus button")
            else:
                return "No specifications found"
            
            try:
                time.sleep(4)  
                specs_div = page.query_selector("div.sBVJqn._8vsVX1")
                if not specs_div:
                    print("Specs div not found")
                else:
                    print("Specs div found")


                read_more_button = page.wait_for_selector("button:has-text('Read More')", timeout=5000)

                if not read_more_button:
                    print("Read More button not found")
                else:
                    print("Read More button found")
                    read_more_button.click()
                    print("Clicked read more")
                    time.sleep(2)

                    product_specs = {}
                    spec_rows = specs_div.query_selector_all("div.row")
                    for row in spec_rows:
                        label = row.query_selector(".col._9NUIO9")
                        value = row.query_selector(".col.-gXFvC")

                        if label and value:
                            product_specs[label.text_content().strip()] = value.text_content().strip()
                    product_specs_json = json.dumps(product_specs, indent=4)
                    
                    print(product_specs_json)
                    return product_specs_json

            except Exception as e:
                print("Error clicking Read More button:", e)

        except Exception as e:
            print("Error in initial process:", e)
                

            

        return "No specifications found"

def get_reviews(page):
    try:
        
        page.wait_for_selector("a:has(div._23J90q)")
        first_anchor_tag = page.query_selector("a:has(div._23J90q)")
        if first_anchor_tag:
            first_anchor_tag.click()
            print("Clicked view all reviews")
            time.sleep(3)
    except:
        print("Not clicked")
    
    toggle_sort(page)

    reviews_and_ratings = []
    pc = 0
    count = 0

    while pc < 50:
        review_containers = page.query_selector_all("div.EKFha-")
        rating_elements = page.query_selector_all("div[class*='EKFha-'] div.XQDdHH.Ga3i8K")

        for i in range(len(review_containers)):
            container= review_containers[i]
            try:
               
                title_element = container.query_selector("div.row div")
                title = title_element.inner_text() if title_element else "No Title"
                

                if title:
                    title = title.replace("\n", "")
                    title= title[1::]

                if title=="":
                    para = container.query_selector("p.z9E0IG")
                    
                    title = para.inner_text() if para else "No Title"

                
                review_element = container.query_selector("div.row div.ZmyHeo")
                review_text = review_element.inner_text() if review_element else "No Review Text"
                if review_text =="READ MORE" or review_text[1::] ==title:

                    review_text = "No Review Text"

                
                
                rating = rating_elements[i].inner_text() if rating_elements else "No Rating"
                

                reviews_and_ratings.append({
                    "title": title,
                    "review": review_text,
                    "stars": rating,
                    "count": count
                })
                count += 1
            except Exception as e:
                print(f"Error extracting review: {e}")

        print(f"Scraped page {pc}")
        pc += 1

        try:
            
            next_button = page.locator("//a[@class='_9QVEpD' and span[text()='Next']]")
            if next_button.is_visible():
                next_button.click()
                time.sleep(3)
            else:
                break
        except Exception as e:
            print(f"Error navigating to next page: {e}")
            break

    return reviews_and_ratings



@app.route('/scrape', methods=['POST'])
def scrape():
    url = request.form.get('url')
    if not url:
        return jsonify({"error": "URL not provided"}), 400

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            context = browser.new_context()
            page = context.new_page()
            page.goto(url)

            product_details = get_product_details(page)
            specs = get_specifications(page)
            high = get_highlights(page)
            reviews = get_reviews(page)
            

            response = {
                'product_details': product_details,
                'reviews': reviews,
                'specifications':specs,
                'highlights':high
            }

            print(response)
            browser.close()
            return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Error occurred: {e}"}), 500
    



if __name__ == '__main__':
    app.run(debug=True,port=5000)
