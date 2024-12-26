import { HfInference } from "@huggingface/inference";

const client = new HfInference("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");

const chatCompletion = await client.chatCompletion({
	model: "mistralai/Mistral-7B-Instruct-v0.3",
	messages: [
		{
			role: "user",
			content: "Please provide a summary of the following reviews in 100 words: Just go for it.Amazing one.Beautiful camera with super fast processor High quality camera Best mobile phone Camera quality is very nice Battery backup is very good Sound quality is amazing. Camera Quality Is Improved Loving It Very nice Switch from OnePlus to iPhone I am stunned with camera performance. Everything is perfect on iPhone 15. for me its 10 out of 10 Awesome photography experience. Battery backup is good . Display is much better than 14 version. So beautiful, so elegant, just a vowww Totally happy Camera 5 Battery 5 Display 5 Design 5 Just loved the product , colour , design is wow and camera is amazing , just clicked first picture of my grandmother in portrait mode and results r here in front of you guys Awesome product very happy to hold this. Better In hand feel,matte finish. Good camera, Brighter screen with Dynamic Island, USBC, great battery life. 60Hz display is a dealbreaker for some.Its not much noticeable. Thank u Flipkart for the best deal and quick delivery."
		}
	],
	max_tokens: 500
});

console.log(chatCompletion.choices[0].message);



// import fs from "fs";
// import { HfInference } from "@huggingface/inference";

// // Initialize Hugging Face client with your API token
// const client = new HfInference("your hf token here");

// // Function to read text from a file
// function readTextFromFile(filePath) {
//   return fs.readFileSync(filePath, "utf8");
// }

// (async () => {
//   try {
//     // Read the content of the text file
//     const filePath = "combined_reviews.txt";
//     const fileContent = readTextFromFile(filePath);

//     // Send the file content to the model with a summarization request
//     const chatCompletion = await client.chatCompletion({
//       model: "mistralai/Mistral-7B-Instruct-v0.3",
//       messages: [
//         {
//           role: "user",
//           content: `Please provide a summary of the following reviews in 100 words:\n${fileContent}`, // Summarization prompt
//         },
//       ],
//       max_tokens: 500, // Adjust token limit as needed
//     });

//     // Log the summarized output
//     console.log("Summarized Output:");
//     console.log(chatCompletion.choices[0].message.content); // Updated to access the correct property
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// })();