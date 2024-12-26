from huggingface_hub import InferenceClient

# Initialize the client
client = InferenceClient(api_key="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")

# Input text for summarization
prompt = (
    "Summarize the text: Awesome product very happy to hold this. "
    "Better In hand feel, matte finish. Good camera, Brighter screen with Dynamic Island, "
    "USBC, great battery life. 60Hz display is a dealbreaker for some. Its not much noticeable. "
    "Camera No doubt iPhones camera are best of any other smartphone, primary camera is now 48mp "
    "which gives quite sharp images, 2x in portrait mode is definitely a game changer in base variant. "
    "Battery 3349 mAH is quite better as compared to older versions. Performance Apple improve performance "
    "by introducing A16 bionic chip, no doubt performance is on top. Display In display we get dynamic island "
    "which gives phone more. Switch from android to iPhone Just wow. Camera and battery backup is outstanding "
    "for daily use Awesome Awesome. Pic Quality Awesome."
)

# Encode the prompt as bytes
encoded_prompt = prompt.encode('utf-8')

# Call the model with the binary-encoded content
response = client.post(
    model="microsoft/Phi-3.5-vision-instruct",  # Ensure the model is correct
    data=encoded_prompt  # Pass the encoded text
)

# Print the result
print(response)
