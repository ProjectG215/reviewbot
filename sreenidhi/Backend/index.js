const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js"); // or ./db depending on file location
const router = require("./routes/AllRoutes.js");
const cors = require("cors");


dotenv.config(); 

connectDB();
const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use("/api", router); // use routes

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



