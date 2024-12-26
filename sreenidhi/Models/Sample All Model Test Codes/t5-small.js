// async function query(data) {
// 	const response = await fetch(
// 		"https://api-inference.huggingface.co/models/google-t5/t5-small",
// 		{
// 			headers: {
// 				Authorization: "Bearer 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",
// 				"Content-Type": "application/json",
// 			},
// 			method: "POST",
// 			body: JSON.stringify(data),
// 		}
// 	);
// 	const result = await response.json();
// 	return result;
// }

// query({"inputs": "Just upgraded from iphone 12 to 15 and I totally loved this 15 series.\nCamera:- No doubt iphones camera are best of any other smartphone, primary camera is now 48mp which gives quite sharp images, 2x in portrait mode is definitely a game changer in base varient.\nBattery:- 3349 mAH is quite better as compared to older versions.\nPerformance:- Apple improve performance by introducing A-16 bionic chip, no doubt performance is on top."}).then((response) => {
// 	console.log(JSON.stringify(response));
// });

import express from 'express';
import axios from 'axios'; // Ensure you install this with `npm install axios`

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Hugging Face Query Function
async function query(data) {
  try {
    const response = await axios.post(
        "https://api-inference.huggingface.co/models/google/t5-v1_1-small",
        //"https://api-inference.huggingface.co/models/MK-5/t5-small-Abstractive-Summarizer",
        //"https://api-inference.huggingface.co/models/google/t5-v1_1-small",
      //"https://api-inference.huggingface.co/models/google-t5/t5-small",
      //MK-5/t5-small-Abstractive-Summarizer
      data,
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the response body
  } catch (error) {
    console.error("Error querying Hugging Face API:", error.response?.data || error.message);
    throw new Error("Failed to fetch data from Hugging Face API");
  }
}

// API Endpoint
app.post("/summary", async (req, res) => {
  try {
    const inputData = req.body; // Expecting { "inputs": "<your-text>" }
    if (!inputData || !inputData.inputs) {
      return res.status(400).json({ error: "Invalid request. 'inputs' field is required." });
    }

    const response = await query(inputData);
    res.status(200).json(response); // Send back the Hugging Face response
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
