// Text Summarization

router.post("/summarize", async (req, res) => {
    console.log("Received request to summarize:", req.body);
    const { reviews } = req.body;
  
    if (!reviews || !Array.isArray(reviews)) {
        return res.status(400).json({ error: "Invalid input. Expected an array of reviews." });
    }
  
    try {
        const reviewTexts = reviews.map((review) => review.review).join(' '); // Joins reviews into a single string
  
        console.log("Full review text for summarization:\n", reviewTexts);
        // Send the file content to the Hugging Face model for summarization
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
  
    // Get the summary from the response
    const summary = chatCompletion.choices[0].message.content;
  
    // Return the summary in the response
    return res.json({ summary });
    } 
    catch (error) 
    {
      console.error("Error processing reviews:", error);
      return res.status(500).json({ error: "Failed to process reviews" });
    }
  });