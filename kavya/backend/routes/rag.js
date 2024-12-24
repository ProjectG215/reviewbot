const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const ragRouter = express.Router();

ragRouter.use(cors());
ragRouter.use(express.json());
ragRouter.use(bodyParser.urlencoded({ extended: true }));


ragRouter.post('/chat', async (req, res) => {
    console.log('POST /chat called with data:');
    const { question } = req.body;
  
    if (!question) {
        return res.status(400).json({ error: 'Data or query not provided' });
    }
  
    try {
        const flaskResponse = await axios.post(
            'http://localhost:5000/query',
            {
                question: question, 
            },
            {
                headers: {
                    'Content-Type': 'application/json', 
                },
            }
        );
        
        console.log('Response from Flask:');
        console.log(flaskResponse.data);
        res.status(flaskResponse.status).json(flaskResponse.data);
    } catch (error) {
        console.error('Error communicating with Flask server:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
  });
  
    module.exports = ragRouter;