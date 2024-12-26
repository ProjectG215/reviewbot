// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./ProductCard.css";

// const ProductCard = ({ product, username }) => {
//   const navigate = useNavigate();

//   const handleReanalyze = async (e) => {
//       e.preventDefault();
//       setLoading(true);
//       setError(null);
  
//       try {
//         const formData = new URLSearchParams();
//         formData.append("url", product.productLink);
  
//         const res = await axios.post("http://localhost:5000/scrape", formData, {
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         });
  
//         const { product_details, reviews,specifications,highlights } = res.data;
//         console.log(res.data);
    
//         const reviewsArray = reviews.map((review)=>{return review["review"]})
        
//         let positive = 0,
//           negative = 0;
//         try {
//           const sentimentResponse = await axios.post("http://localhost:5000/senti", {
//             reviewTexts: reviewsArray,
//           });
//           const { positive: posCount, negative: negCount } = sentimentResponse.data;
//           positive = posCount;
//           negative = negCount;
//         } catch (error) {
//           console.error("Error in sentiment analysis:", error);
//         }
  
//         let summary = "No summary available.";
//         try {
//           const summaryResponse = await axios.post("http://localhost:4000/summarize", {
//             reviews: reviewsArray,
//           });
//           console.log(summaryResponse);
//           summary = summaryResponse.data.summary || summary;
//         } catch (error) {
//           console.error("Error in summarization:", error);
//         }
  
//         try {
//           const response = await axios.post("http://localhost:5000/upload_reviews", {
//             reviews: res.data,
//           });
//           console.log("Uploaded reviews");
//         } catch (error) {
//           console.error("Error in uploading reviews:", error);
//         }
  
//         const username = localStorage.getItem("username");
//         console.log(username); // Retrieve the username
  
//         try {
//           const response = await axios.post('http://localhost:4000/products', {
//             productName: product_details.name,
//             productPrice: product_details.price,
//             productImage: product_details.image,
//             productRating: product_details.rating,
//             productLink: url,
//             username:username, // Include username in the request
//           });
//           console.log('Product saved:', response.data);
//         } catch (error) {
//           console.error('Error saving product:', error);
//         }
  
  
//         navigate("/product", {
//           state: {
//             product: {
//               image: product_details.image || null,
//               name: product_details.name || "Unknown Product",
//               price: product_details.price || "Price not available",
//               sumRes: summary,
//               pos: positive,
//               neg: negative,
//               high: product_details.highlights || [],
//               rating: product_details.rating || "No rating",
//               reviews: reviewsArray, 
//             },
//           },
//         });
//       } catch (err) {
//         console.log(err);
//         setError(err.response?.data || "Error fetching product details.");
//       } finally {
//         setLoading(false);
//       }
//     };
//   };

//   return (
//     <div className="product-card">
//       {product.image && <img src={product.image} alt={product.name} className="product-card-image" />}
//       <div className="product-card-info">
//         <h2 className="product-card-title">{product.name}</h2>
//         <p className="product-card-username">Searched by: {username}</p>
//         <button onClick={handleReanalyse} className="product-card-button">
//           Re-analyze
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
