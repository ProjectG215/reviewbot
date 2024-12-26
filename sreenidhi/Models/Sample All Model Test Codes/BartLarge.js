import fs from "fs";

// Function to read text from a file
function readTextFromFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    {
      headers: {
        Authorization: `Bearer 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`, // Use an environment variable for the API key
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

const filePath = "combined_reviews.txt";
let fileContent = readTextFromFile(filePath);

// Ensure input length is within model limits
if (fileContent.length > 1024) {
  fileContent = fileContent.slice(0, 1024); // Truncate to 1024 characters
}

query({
  inputs: `Please summarize the reviews in 100 words maximum: \n ${fileContent}`,
  parameters: {
    max_length: 100, // Maximum length for the output
  },
}).then((response) => {
  console.log(JSON.stringify(response));
});










// import fs from "fs";
// import { HfInference } from "@huggingface/inference";

// // Initialize Hugging Face client with your API token
// const client = new HfInference("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");

// // Function to read text from a file
// function readTextFromFile(filePath) {
//   return fs.readFileSync(filePath, "utf8");
// }

// (async () => {
//   try {
//     // Read the content of the text file
    // const filePath = "combined_reviews.txt";
    // const fileContent = readTextFromFile(filePath);

//     // Send the file content to the model with a summarization request
//     const chatCompletion = await client.summarization({
//       model: "facebook/bart-large-cnn",
//       messages: 
//         {
//           "inputs": `Please provide a summary of the following reviews:\n\n${fileContent}\n `, // Summarization prompt
//         },
      
//       max_tokens: 500, // Adjust token limit as needed
//     });

//     // Log the summarized output
//     // console.log("Summarized Output:");
//     console.log(chatCompletion);
//     // console.log(chatCompletion.choices[0].message.content); // Updated to access the correct property
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// })();
