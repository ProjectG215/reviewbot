// to connect to MongoDB with mongoose
const mongoose = require('mongoose');
require("dotenv").config();
const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log(`MongoDB Connected`);
    }
    catch(error)
    {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};
module.exports = connectDB;

// MONGO_URI = "mongodb+srv://sarojasreenidhi:sreenidhiMongodb@cluster0.fmwajps.mongodb.net/PS_ReviewBot?retryWrites=true&w=majorityappName=Cluster0"