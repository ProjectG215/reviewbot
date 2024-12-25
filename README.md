# ProBot - Flipkart ReviewBot  

**ReviewBot** is an AI-powered web application designed to simplify and enhance product review analysis. It provides actionable insights and context-aware answers, making it easier for users to understand product reviews and make informed decisions.  

# Features  
#### 📝 AI-Powered Review Insights
Analyze and classify reviews as positive or negative while summarizing lengthy reviews for quick understanding.  
#### 🤖 Interactive Querying
Use Retrieval-Augmented Generation (RAG) to answer product-related questions accurately.  
#### 🌟 User-Friendly Interface
Clean and responsive design built with React, offering seamless real-time insights.  
# Tech Stack  
- **Frontend**: `React` for a responsive and intuitive UI.  
- **Backend**: `Flask` (AI integration, scraping, RAG) ; `Express` (handles HTTP routes and manages server-side communication) and  `JavaScript (with Express.js)` handles the core backend logic.
- **AI Models**:  
  - **Sentiment Analysis**: Hugging Face’s `siebert/sentiment-roberta-large-english`model integrated with PyTorch.  
  - **Text Summarization**: Hugging Face API for the model `mistralai/Mistral-7B-Instruct-v0.3` integrated via JavaScript.  
  - **RAG Framework**: `nomic-ai/nomic-embed-text-v1` model for embeddings, `FAISS` for vector storage, and `meta-llama/Llama-3.2-1B` as reader LLM for response generation.  
- **Database**: `MongoDB` for optimized storage and retrieval of user data includeing user history.  
- **Web Scraping**: `Python with Playwright` for dynamic data collection.  

## Architechture Diagram

![App Screenshot](https://res.cloudinary.com/duwadnxwf/image/upload/v1735146547/ReviewBot_4Slide_PPT_ug4uiy.jpg)


## Demo

link

## Authors

- [@kavya](https://github.com/kavyaPerepu19)
- [@sankeerthi](https://github.com/kasi0403)
- [@pujitha](https://github.com/pujithakondapally)
- [@sreenidhi](https://github.com/sreenidhi05)
- [@vaidika](https://github.com/vaidikapadigela)
- [@sagarika](https://github.com/banurisagarika)
