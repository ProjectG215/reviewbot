const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { RegisterModel, Product,History,ChatHistory,Chat} = require("./schemas/allSchemas");
const bcrypt = require('bcrypt');
require('dotenv').config();
const axios = require('axios');
const qs = require('qs');
const { HfInference } = require('@huggingface/inference');
const client = new HfInference(process.env.HUGGING_FACE);
const jwt = require("jsonwebtoken")
const http = require('http');
const { Server } = require("socket.io");


const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Example of emitting a message
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

const saltRounds = 10;  // Number of salt rounds for bcrypt hashing


app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Check for existing user
    RegisterModel.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.status(400).json({ error: "User with this email already exists" });
            }
            
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: "Error hashing password" });
                }
                const newUser = new RegisterModel({ name, email, password: hashedPassword });

                newUser.save()
                    .then(() => {
                        res.json({ message: "User registered successfully", id: newUser.id, email: newUser.email});
                    })
                    .catch(err => {
                        console.error(err); // Log the error for debugging
                        res.status(500).json({ error: "Error saving user to the database." });
                    });
            });
        })
        .catch(err => {
            console.error(err); // Log the error for debugging
            res.status(500).json({ error: "Error checking for existing user." });
        });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    RegisterModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ error: "User does not exist" });
            }
            // Compare the entered password with the hashed password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ error: "Error during password comparison" });
                }
                if (isMatch) {
                    const token = jwt.sign(
                        { id: user.id, email: user.email }, 
                        process.env.JWT_SECRET, 
                        { expiresIn: '7d' } // Token will expire in 1 hour
                    );
                    // console.log("Token : ",token);
                    res.json({ message: "User logged in successfully", token:token});
                } else {
                    res.status(400).json({ error: "Invalid credentials" });
                }
            });
        })
        .catch(err => res.status(500).json({ error: "Error finding user" }));
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Error verifying token:", err);  // Debugging line
            return res.status(403).json({ error: "Invalid Token" });
        }
        req.user = user; 
        next();
    });
};

// app.post('/linkInput', authenticateToken, async (req, res, next) => {
//     console.log("Called link input")
//     const { inputValue } = req.body; 
//     const { id: userID } = req.user;
//     console.log(inputValue)
//     console.log(userID)

//     // Step 1: Check if the inputValue is valid
//     if (!inputValue || typeof inputValue !== 'string') {
//         return res.status(400).json({ message: 'Invalid product link provided' });
//     }

//     try {
//         const data = qs.stringify({
//             url: inputValue,
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         });

//         const response = await axios.post('http://localhost:5000/scrape', data, {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//         });

//         console.log("Data received in express = ", response.data);
//         const reviews = response.data.reviews;
//         const details = response.data.product_details;
//         const high = response.data.highlights;
//         const cat = response.data.category;

//         let sentimentRes = null;
//         let sumRes = null;
//         let newProduct
//         try {
//             const product = await Product.findOne({productLink:inputValue})
//             if(!product){
//                 console.log("Product does not exist")
//                 newProduct = await Product.create({
//                     category: cat,
//                     productName: details.name,
//                     image: details.image,
//                     productLink: inputValue,
//                 });
//             }
//             else{
//                 console.log("Product already exists")
//                 newProduct = product;
//             }
//             // console.log("Product ID (from _id):", newProduct._id);
//         } 
//         catch (err) {
//             console.log("Error creating product: ", err.message);
//             return res.status(500).json({ message: 'Error saving product to database', error: err.message });
//         }        
//         try {
//             const productID = newProduct._id;
//             // console.log("New product created with ID = ", productID);
            
//             const updatedHistory = await History.findOneAndUpdate(
//                 { userID: userID }, 
//                 { $addToSet: { productIDs: productID } }, 
//                 { new: true, upsert: true }
//             );
        
//             // console.log('Updated History:', updatedHistory);
//             console.log("History collection completed");
//             console.log("Product collection completed");
//         } 
//         catch (error) {
//             console.log("Error saving in history");
//             console.log(error.message);
//         }        
//         try {
//             console.log("\nLoading knowledge base");
//             await axios.post('http://127.0.0.1:8000/upload_reviews', { reviews });
//             console.log("Loaded successfully");
//         } catch (error) {
//             console.log("Error loading knowledge base: ", error.message);
//             return res.status(500).json({ message: 'Error occurred with knowledge base', error: error.message });
//         }

//         try {
//             console.log("\nCalling sentiment analysis");
//             sentimentRes = await axios.post('http://localhost:3001/analyzeSentiment', { reviews });
//         } catch (error) {
//             console.error("Sentiment analysis failed: ", error.message);
//             return res.status(500).json({ message: 'Error occurred with sentiment', error: error.message });
//         }

//         try {
//             sumRes = await axios.post(
//                 'http://localhost:3001/summarize',
//                 { reviews },
//                 { headers: { 'Content-Type': 'application/json' } }
//             );
//             console.log("Summary successful");
//         } catch (error) {
//             console.log("Error in summarization: ", error.message);
//         }

//         res.status(200).json({
//             productDetails: details,
//             summary: sumRes?.data,
//             sentiment: sentimentRes?.data,
//             highlights: high,
//         });
//     } catch (error) {
//         console.error("Server error: ", error.message);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

app.post('/linkInput', authenticateToken, async (req, res, next) => {
    console.log("Called link input");
    const { inputValue } = req.body;
    const { id: userID } = req.user;
    console.log(inputValue);
    console.log(userID);

    if (!inputValue || typeof inputValue !== 'string') {
        return res.status(400).json({ message: 'Invalid product link provided' });
    }

    try {
        io.emit("progress", { stage: 1, message: "Validating product link" });
        const data = qs.stringify({
            url: inputValue,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        io.emit("progress", { stage: 2, message: "Scraping product data" });
        const response = await axios.post('http://localhost:5000/scrape', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        

        console.log("Data received in express = ", response.data);
        const reviews = response.data.reviews;
        const details = response.data.product_details;
        const high = response.data.highlights;
        const cat = response.data.category;

        let sentimentRes = null;
        let sumRes = null;
        let newProduct;

        try {
            const product = await Product.findOne({ productLink: inputValue });
            if (!product) {
                console.log("Product does not exist");
                newProduct = await Product.create({
                    category: cat,
                    productName: details.name,
                    image: details.image,
                    productLink: inputValue,
                });
            } else {
                console.log("Product already exists");
                newProduct = product;
            }
            const productID = newProduct._id;
            await History.findOneAndUpdate(
                { userID: userID },
                { $addToSet: { productIDs: productID } },
                { new: true, upsert: true }
            );
        } catch (err) {
            console.log("Error managing product data: ", err.message);
            return res.status(500).json({ message: 'Error saving product to database', error: err.message });
        }

        io.emit("progress", { stage: 3, message: "Loading knowledge base" });

        try {
            console.log("\nLoading knowledge base");
            await axios.post('http://127.0.0.1:8000/upload_reviews', { reviews });
            console.log("Loaded successfully");
        } catch (error) {
            console.log("Error loading knowledge base: ", error.message);
            return res.status(500).json({ message: 'Error occurred with knowledge base', error: error.message });
        }

        io.emit("progress", { stage: 4, message: "Performing sentiment analysis" });

        try {
            console.log("\nCalling sentiment analysis");
            sentimentRes = await axios.post('http://localhost:3001/analyzeSentiment', { reviews });
        } catch (error) {
            console.error("Sentiment analysis failed: ", error.message);
            return res.status(500).json({ message: 'Error occurred with sentiment', error: error.message });
        }

        io.emit("progress", { stage: 5, message: "Summarizing reviews" });

        try {
            sumRes = await axios.post(
                'http://localhost:3001/summarize',
                { reviews },
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log("Summary successful");
        } catch (error) {
            console.log("Error in summarization: ", error.message);
            return res.status(500).json({ message: 'Error occurred during summarization', error: error.message });
        }

        res.status(200).json({
            productDetails: details,
            summary: sumRes?.data,
            sentiment: sentimentRes?.data,
            highlights: high,
        });
    } catch (error) {
        console.error("Server error: ", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


app.post('/analyzeSentiment', async (req, res) => {
    // console.log("Received request:", req.body);
    const { reviews } = req.body;

    if (!reviews || !Array.isArray(reviews)) {
        return res.status(400).json({ error: "Invalid input. Expected an array of reviews." });
    }

    try {
        console.log("\nin sentiment function")
        const reviewTexts = reviews.map((review) => review.review);
        // console.log(reviewTexts);
        const response = await axios.post('http://localhost:5000/senti', {reviewTexts} , {
            headers: {
                'Content-Type': 'application/json',  
            }
        });

        const positiveCount = response.data.positive;
        const negativeCount = response.data.negative;
        console.log("Sentiment Analysis Response:", response.data);

        res.status(200).json({
            positive: positiveCount,
            negative: negativeCount
        });
    } catch (error) {
        console.error("Error during sentiment analysis:", error);
        res.status(500).json({ error: "Failed to process sentiment analysis." });
    }
});

app.post("/summarize", async (req, res) => {
        // console.log("Received request to summarize:", req.body);
        const { reviews } = req.body;

        if (!reviews || !Array.isArray(reviews)) {
            return res.status(400).json({ error: "Invalid input. Expected an array of reviews." });
        }

        try {
            const reviewTexts = reviews.map((review) => review.review).join(' '); // Joins reviews into a single string

            // console.log("Full review text for summarization:\n", reviewTexts);
    
            const chatCompletion = await client.chatCompletion({
                model: "mistralai/Mistral-7B-Instruct-v0.3",
                messages: [
                {
                    role: "user",
                    content: `Please provide a summary of the following reviews in 75 words:\n\n${reviewTexts}`,
                },
                ],
                max_tokens: 400, // Adjust token limit as needed
      });
  
      const summary = chatCompletion.choices[0].message.content;
  
      return res.json({ summary });
    } catch (error) {
      console.error("Error processing reviews:", error);
      return res.status(500).json({ error: "Failed to process reviews" });
    }
  });

app.post('/chatBot',async(req,res)=>{
    const {question} = req.body;
    try{
        const response = await axios.post("http://127.0.0.1:8000/query",{question});
        console.log(response?.data);
        res.status(200).json(response.data);
    }
    catch(error){
        console.log(error);
    }
})

app.get('/history', authenticateToken, async (req, res) => {
    const { id: userID } = req.user;

    try {
        const history = await History.findOne({ userID: userID }, { productIDs: 1, _id: 0 });

        if (!history || !history.productIDs.length) {
            return res.status(404).json({ message: 'No history found for this user' });
        }

        const prodIDs = history.productIDs; 

        const hist = await Promise.all(
            prodIDs.map(async (prodID) => {
                try {
                    const productResponse = await axios.get(`http://localhost:3001/products`, { params: { prodID } });
                    return productResponse.data;
                } catch (error) {
                    console.log(`Error fetching product with ID ${prodID}:`, error.message);
                    return null; 
                }
            })
        );

        const filteredHistory = hist.filter(Boolean); 

        res.status(200).json({
            history: filteredHistory
        });

    } catch (error) {
        console.log("Error fetching history");
        console.log(error.message);
        res.status(500).json({ message: 'Error fetching history', error: error.message });
    }
});

app.get('/products', async (req, res) => {
    const { prodID } = req.query; 

    try {
        const product = await Product.findOne({ 
            $or: [
                { _id: prodID }, 
                { productId: prodID } 
            ] 
        }); 

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json(product); 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

app.get('/chats', authenticateToken, async (req, res) => {
    const { id: userID } = req.user;
    const { productId } = req.query;
  
    try {
      const chatHistory = await Chat.findOne({ user: userID, productId });
      if (!chatHistory) {
        return res.status(200).json({ conversation: [] }); // No previous chats
      }
      res.status(200).json({ conversation: chatHistory.conversation });
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ message: 'Error fetching chat history' });
    }
  });
  
  // Route to store new messages
  app.post('/storeMessage', authenticateToken, async (req, res) => {
    const { id: userID } = req.user;
    const { productId, sender, text } = req.body;
  
    try {
      let chat = await Chat.findOne({ user: userID, productId });
  
      // If chat does not exist, create a new one
      if (!chat) {
        chat = new Chat({
          user: userID,
          productId,
          conversation: { [new Date().toISOString()]: `${sender}: ${text}` }
        });
      } else {
        // Append the new message to the existing conversation
        chat.conversation.set(new Date().toISOString(), `${sender}: ${text}`);
      }
  
      await chat.save();
  
      // Update the ChatHistory to keep track of all the user's chats
      let chatHistory = await ChatHistory.findOne({ user: userID });
      if (!chatHistory) {
        chatHistory = new ChatHistory({ user: userID, chat: [chat._id] });
      } else if (!chatHistory.chat.includes(chat._id)) {
        chatHistory.chat.push(chat._id);
      }
      await chatHistory.save();
  
      res.status(200).json({ message: 'Message stored successfully' });
    } catch (error) {
      console.error('Error storing message:', error);
      res.status(500).json({ message: 'Error storing message' });
    }
  });
  
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });