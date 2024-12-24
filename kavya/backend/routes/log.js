const express = require('express');
const cors = require('cors'); 
const userModel = require('../schemas/loginSchemas'); 

const logRouter = express.Router();
logRouter.use(cors()); 
logRouter.use(express.json()); 

logRouter.post('/login', async (req, res) => {
    console.log("Request Body: ", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username or password missing');
    }

    const user = await userModel.findOne({ username }).exec();
    if (!user) {
        return res.status(400).send('User not found');
    }
    if (user.password !== password) {
        return res.status(400).send('Invalid password');
    }
    
    return res.status(200).send('Login successful');
});

logRouter.get('/getUsers', async (req, res) => {
    const users = await userModel.find().exec();
    res.status(200).send(users);
    console.log(users);
    console.log('Users fetched');
});

logRouter.post('/create', async (req, res) => {
    const newUser = new userModel({
        username: 'testUser',
        password: 'testPassword'
    });
    
    try {
        await newUser.save();
        console.log("User created successfully!");
        res.status(201).send("User created successfully!");
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).send("Error creating user");
    }
});

module.exports = logRouter;