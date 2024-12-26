from flask import Flask, jsonify
from ctransformers import AutoModelForCausalLM

app = Flask(__name__)

# Load the GGML model
model = AutoModelForCausalLM.from_pretrained(
    "TheBloke/Llama-2-7B-Chat-GGML",
    model_type="llama"
)

# Define the summarization route
@app.route('/summarize', methods=['GET'])
def summarize_text():
    try:
        # Read input text from the file
        file_path = "combined_reviews.txt" 
        with open(file_path, "r", encoding="utf-8") as file:
            input_text = file.read()

        summarized_text = model(
            "Summarize the reviews: "+input_text, 
            max_new_tokens=100
        ).strip()  

        return jsonify({
            "summary": summarized_text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=2000)
