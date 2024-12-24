(async () => {
  const fetch = (await import('node-fetch')).default;
  globalThis.fetch = fetch; 
})();

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const ProductModel = require('../schemas/productSchemas');
const userProductModel = require('../schemas/historySchemas');
const { HfInference } = require('@huggingface/inference');
const client = new HfInference("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");
const scrapeRouter = express.Router();



scrapeRouter.use(cors());
scrapeRouter.use(bodyParser.urlencoded({ extended: true }));
scrapeRouter.use(bodyParser.json());


scrapeRouter.post('/scrape', async (req, res) => {
  console.log('POST /scrape called with URL:', req.body.url); 
  const { url ,username} = req.body;

  if (!url) {
      return res.status(400).json({ error: "URL not provided" });
  }
  if (!username) {
    return res.status(400).json({ error: "Username not provided" });
  }

  
//  scrape flask caaaaall
  try {
      const flaskResponse = await axios.post(
          'http://localhost:5000/scrape',
          new URLSearchParams({ url }), {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
          }
      );

        // console.log('Response from Flask:', flaskResponse.data);

      const pDetails = flaskResponse.data.product_details;
      const high = flaskResponse.data.highlights;


      const newProduct = new ProductModel({
        productName: pDetails.name,
        productPrice: pDetails.price,
        productImage: pDetails.image,
        productRating: pDetails.rating,
        productLink: url,
      });
      
// call to create new product      
      try{
        await newProduct.save();
        console.log("product created successfully")
      }
      catch{
        console.log("error creating new product");
      }
      const reviews = flaskResponse.data.reviews;
      // console.log("Reviews:", reviews);
      let summarizeResponse = null;
      let sentimentResponse = null;
      const productId = newProduct.productId;


// updating history
      try {

        let userProduct = await userProductModel.findOne({ username });
    
        if (userProduct) {
  
          if (!userProduct.viewedProducts.includes(productId)) {
            userProduct.viewedProducts.push(productId);
            await userProduct.save();
            console.log(`Product ID ${productId} added to username ${username}'s viewedProducts`);
          } else {
            console.log(`Product ID ${productId} already exists in username ${username}'s viewedProducts`);
          }
        } else {
          
          userProduct = new userProductModel({
            username,
            viewedProducts: [productId],
          });
          await userProduct.save();
          console.log(`New userProduct created for username ${username} with productId ${productId}`);
        }
    

      } catch (error) {
        console.error('Error updating user products:', error.message);
        
      }
// summarization express route
      try{
         summarizeResponse = await axios.post(
          'http://localhost:8000/api/summarize',
          { reviews },
          { headers: { 'Content-Type': 'application/json' } }
          
      );
      console.log("summarized");
      }
      catch{
        console.log("error in summarizing");
      }
// sentiment express route
      try{
        sentimentResponse = await axios.post(
          'http://localhost:8000/api/senti',
          { reviews },
          { headers: { 'Content-Type': 'application/json' } }
      );
      console.log("sentiment analyzed");
      }
      catch{
        console.log("error in sentiment analysis");
      }

// knowledge base upload faiss filling
      try{
        const knowledge = await axios.post(
          "http://localhost:5000/upload_reviews",
          {reviews:flaskResponse.data},
          {headers: { 'Content-Type': 'application/json' } }
        );
        console.log("knowledge uploaded");
        console.log(knowledge.data.knowledge_base);
      }
      catch{
        console.log("error in uploading knowledge");
      }

    console.log("Product Details:", pDetails);
    console.log("Summary:", summarizeResponse.data.summary);
    console.log("Sentiment:", sentimentResponse.data);
    console.log("Highlights:", high);

      res.status(200).json({
          productDetails: pDetails,
          summary: summarizeResponse.data.summary,
          sentiment: sentimentResponse.data,
          high: high
      });
 

      
  } catch (error) {
      console.error('Error communicating with Flask server:', error.message);
      res.status(500).json({ error: 'Error communicating with Flask server' });
  }
});

module.exports = scrapeRouter;