const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const sentiRouter = express.Router();

sentiRouter.use(cors());
sentiRouter.use(express.json());
sentiRouter.use(bodyParser.urlencoded({ extended: true }));

sentiRouter.post('/senti', async (req, res) => {
    console.log("Received request for sentii:");
    const { reviews } = req.body;
  
    if (!reviews || !Array.isArray(reviews)) {
        return res.status(400).json({ error: "Invalid input. Expected an array of reviews." });
    }
  
    try {
        const reviewTexts = reviews.map((review) => review.review);
        // console.log(reviewTexts);
        const response = await axios.post('http://localhost:5000/senti', {reviewTexts} , {
            headers: {
                'Content-Type': 'application/json',  
            }
        });
  
        const positiveCount = response.data.positive;
        const negativeCount = response.data.negative;
        // console.log("Sentiment Analysis Response:", response.data);
  
        res.status(200).json({
            positive: positiveCount,
            negative: negativeCount
        });
    } catch (error) {
        console.error("Error during sentiment analysis:", error);
        res.status(500).json({ error: "Failed to process sentiment analysis." });
    }
  });
  

  module.exports = sentiRouter;

