(async () => {
    const fetch = (await import('node-fetch')).default;
    globalThis.fetch = fetch; 
  })();

  
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { HfInference } = require('@huggingface/inference');
const client = new HfInference("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");
const sumRouter = express.Router();

sumRouter.use(cors());
sumRouter.use(bodyParser.urlencoded({ extended: true }));
sumRouter.use(express.json());

sumRouter.post("/summarize", async (req, res) => {
    console.log("Received request to summarize:");
    const { reviews } = req.body;
  
    if (!reviews || !Array.isArray(reviews)) {
        return res.status(400).json({ error: "Invalid input. Expected an array of reviews." });
    }
  
    try {
        const reviewTexts = reviews.map((review) => review.review).join(' '); 
  
        // console.log("Full review text for summarization:\n");
      
        const chatCompletion = await client.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            messages: [
            {
                role: "user",
                content: `Please provide a  summary of the following reviews in 75 words:\n\n${reviewTexts}`,
            },
            ],
            max_tokens: 400, 
  });
  
  
  const summary = chatCompletion.choices[0].message.content;
  
  return res.json({ summary });
  } catch (error) {
  console.error("Error processing reviews:", error);
  return res.status(500).json({ error: "Failed to process reviews" });
  }
  });
  
  
  module.exports = sumRouter;