const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const userModel = require('../schemas/loginSchemas');
const userProductModel = require('../schemas/historySchemas');
const signRouter = express.Router();
signRouter.use(cors());
signRouter.use(express.json());



signRouter.post('/signup', async(req,res)=>{
    const {username,password} = req.body;
    const newUser = new userModel({
        username,
        password
    });
    const newUserProduct = new userProductModel({
        username,
        viewedProducts:[]
    });
    
    

    try{
        await newUser.save();
        await newUserProduct.save();
        console.log("User created successfully!");
        res.status(201).send("User created successfully!");
    }
    catch(err){
        console.error("Error creating user:", err);
        res.status(500).send("Error creating user");
        //
    }

})


module.exports = signRouter;