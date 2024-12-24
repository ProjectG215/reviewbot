import re
import json

with open("appleReviews.json", "r") as file:
    data = json.load(file)

product_details = data.get("product_details", {})
product_details_str = f"Product Name: {product_details.get('name', 'N/A')}, " \
                      f"Price: {product_details.get('price', 'N/A')}, " \
                      f"Rating: {product_details.get('rating', 'N/A')}"

reviews = data.get("reviews", [])
reviews_str = "\n".join([f"Review {review['count']}: {review['review']} (Rating: {review['stars']}, Title: {review['title']})" for review in reviews])

def remove_emojis(text):
    emoji_pattern = re.compile("[\U00010000-\U0010ffff]", flags=re.UNICODE)
    return emoji_pattern.sub(r"", text)

product_details_str_clean = remove_emojis(product_details_str)
reviews_str_clean = remove_emojis(reviews_str)

st = f"{product_details_str_clean}\n\nReviews:\n{reviews_str_clean}"

data = {"context": st}

print(data)
