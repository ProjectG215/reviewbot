const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
const Product = require("./schemas/Product");
const User = require("./schemas/User");


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
// });


const { HfInference } = require('@huggingface/inference');
const client = new HfInference("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");

// const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);
      res.json({ message: 'Login successful', token, username: user.username }); // Send the username here
    } else {
      res.status(400).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post("/summarize", async (req, res) => {
  console.log("Received request to summarize:");
  const { reviews } = req.body;

  if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({ error: "Invalid input. Expected an array of reviews." });
  }

  try {
      const chatCompletion = await client.chatCompletion({
          model: "mistralai/Mistral-7B-Instruct-v0.3",
          messages: [
          {
              role: "user",
              content: `Please provide a  summary of the following reviews in 75 words:\n\n${reviews}`,
          },
          ],
          max_tokens: 400, 
        });
      const summary = chatCompletion.choices[0].message.content;
      return res.json({ summary });
  } 
  catch (error) {
    console.error("Error processing reviews:", error);
    return res.status(500).json({ error: "Failed to process reviews"});
  }
});

app.post('/products', async (req, res) => {
  const { productName, productPrice, productImage, productRating, productLink, username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newProduct = new Product({
      productName,
      productPrice,
      productImage,
      productRating,
      productLink,
    });

    const savedProduct = await newProduct.save();

    // Add the product reference to the user's products array
    user.products.push(savedProduct._id);
    await user.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

app.get('/userProducts', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username }).populate('products');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ viewedProducts: user.products });
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ error: 'Failed to fetch user products' });
  }
});

// app.get("/analyze", async (req, res) => {
//   const { productLink } = req.query;

//   if (!productLink) {
//     return res.status(400).json({ error: "No product link provided" });
//   }

//   try {
//     // Call your scraping and sentiment analysis logic here
//     const formData = new URLSearchParams();
//     formData.append("url", productLink);

//     const scrapeResponse = await axios.post("http://localhost:5000/scrape", formData, {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     });

//     const { product_details, reviews } = scrapeResponse.data;
//     const reviewsArray = reviews.map((review) => review.review);

//     let positive = 0, negative = 0;

//     // Sentiment analysis
//     try {
//       const sentimentResponse = await axios.post("http://localhost:5000/senti", {
//         reviewTexts: reviewsArray,
//       });
//       const { positive: posCount, negative: negCount } = sentimentResponse.data;
//       positive = posCount;
//       negative = negCount;
//     } catch (error) {
//       console.error("Error in sentiment analysis:", error);
//     }

//     // Summarization
//     let summary = "No summary available.";
//     try {
//       const summaryResponse = await axios.post("http://localhost:4000/summarize", {
//         reviews: reviewsArray,
//       });
//       summary = summaryResponse.data.summary || summary;
//     } catch (error) {
//       console.error("Error in summarization:", error);
//     }

//     // Send the complete response to the frontend
//     res.json({
//       productDetails: {
//         image: product_details.image,
//         name: product_details.name,
//         price: product_details.price,
//         rating: product_details.rating,
//         highlights: product_details.highlights,
//       },
//       reviews: reviewsArray,
//       sentiment: { positive, negative },
//       summary,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Error analyzing the product link." });
//   }
// });

app.get("/analyze", async (req, res) => {
  const { productLink } = req.query;

  if (!productLink) {
      return res.status(400).json({ error: "No product link provided" });
  }

  try {
      // Check if the product details have already been scraped (i.e., in your DB)
      let productDetails = await Product.findOne({ productLink: productLink });

      if (!productDetails) {
          // If product is not in the database, initiate scraping
          const formData = new URLSearchParams();
          formData.append("url", productLink);

          const scrapeResponse = await axios.post("http://localhost:5000/scrape", formData, {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });

          const { product_details, reviews } = scrapeResponse.data;
          const reviewsArray = reviews.map((review) => review.review);

          let positive = 0, negative = 0;

          // Sentiment analysis
          try {
              const sentimentResponse = await axios.post("http://localhost:5000/senti", {
                  reviewTexts: reviewsArray,
              });
              const { positive: posCount, negative: negCount } = sentimentResponse.data;
              positive = posCount;
              negative = negCount;
          } catch (error) {
              console.error("Error in sentiment analysis:", error);
          }

          // Summarization
          let summary = "No summary available.";
          try {
              const summaryResponse = await axios.post("http://localhost:4000/summarize", {
                  reviews: reviewsArray,
              });
              summary = summaryResponse.data.summary || summary;
          } catch (error) {
              console.error("Error in summarization:", error);
          }

          // Save the product details to the database
          productDetails = new Product({
              productName: product_details.name,
              productPrice: product_details.price,
              productImage: product_details.image,
              productRating: product_details.rating,
              productLink: productLink,
              reviews: reviewsArray,
              sentiment: { positive, negative },
              summary,
          });

          await productDetails.save();
      }

      res.json({
          productDetails: {
              image: productDetails.productImage,
              name: productDetails.productName,
              price: productDetails.productPrice,
              rating: productDetails.productRating,
              highlights: productDetails.highlights,
          },
          reviews: productDetails.reviews,
          sentiment: productDetails.sentiment,
          summary: productDetails.summary,
      });

  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error analyzing the product link.",message:err });
  }
});





const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
