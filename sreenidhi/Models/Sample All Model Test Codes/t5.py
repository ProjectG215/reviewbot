from flask import Flask, request, jsonify
from flask_ngrok import run_with_ngrok
import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration

app = Flask(__name__)
run_with_ngrok(app)  # Start ngrok when the app is run

# Load the model and tokenizer
model = T5ForConditionalGeneration.from_pretrained('t5-small')
tokenizer = T5Tokenizer.from_pretrained('t5-small')
device = torch.device('cpu')

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    if 'text' not in data:
        return jsonify({'error': 'Please provide text to summarize'}), 400

    text = data['text']
    preprocessed_text = text.strip().replace('\n', '')
    t5_input_text = 'summarize: ' + preprocessed_text
    
    tokenized_text = tokenizer.encode(t5_input_text, return_tensors='pt', max_length=512).to(device)
    summary_ids = model.generate(tokenized_text, min_length=30, max_length=120)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    
    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run()






# # !pip install transformers
# # !pip install torch
# import torch
# from transformers import T5Tokenizer, T5ForConditionalGeneration, T5Config
# # initialize the pretrained model
# model = T5ForConditionalGeneration.from_pretrained('t5-small')
# tokenizer = T5Tokenizer.from_pretrained('t5-small')
# device = torch.device('cpu')

# # input text
# text = """
# just upgraded from iphone 12 to 15 and I totally loved this 15 series.\n
# Camera:- No doubt iphones camera are best of any other smartphone, primary camera is now 48mp which gives quite sharp images, 2x in portrait mode is definitely a game changer in base varient.\n
# Battery:- 3349 mAH is quite better as compared to older versions.\n
# Performance:- Apple improve performance by introducing A-16 bionic chip, no doubt performance is on top.
# """
# ## preprocess the input text
# preprocessed_text = text.strip().replace('\n','')
# t5_input_text = 'summarize: ' + preprocessed_text

# print(t5_input_text)
# print(len(t5_input_text.split()))

# tokenized_text = tokenizer.encode(t5_input_text, return_tensors='pt', max_length=512).to(device)
# summary_ids = model.generate(tokenized_text, min_length=30, max_length=120)
# summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

# print(summary)