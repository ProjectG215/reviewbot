import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import './Profile.css';

const Profile = () => {
  const [products, setProducts] = useState([]);
  const username = localStorage.getItem("username"); 
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Initialize the navigate function

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/userProducts", {
          params: { username },
        });
        // Ensure response.data.viewedProducts is populated correctly
        setProducts(response.data.viewedProducts || []);
      } catch (error) {
        console.error("Error fetching user products:", error);
      }
    };

    fetchProducts();
  }, [username]);

    const handleReanalyze = async (e,product) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      try {
        const formData = new URLSearchParams();
        formData.append("url", product.productLink);
  
        const res = await axios.post("http://localhost:5000/scrape", formData, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
  
        const { product_details, reviews,specifications,highlights } = res.data;
        console.log(res.data);
    
        const reviewsArray = reviews.map((review)=>{return review["review"]})
        
        let positive = 0,
          negative = 0;
        try {
          const sentimentResponse = await axios.post("http://localhost:5000/senti", {
            reviewTexts: reviewsArray,
          });
          const { positive: posCount, negative: negCount } = sentimentResponse.data;
          positive = posCount;
          negative = negCount;
        } catch (error) {
          console.error("Error in sentiment analysis:", error);
        }
  
        let summary = "No summary available.";
        try {
          const summaryResponse = await axios.post("http://localhost:4000/summarize", {
            reviews: reviewsArray,
          });
          console.log(summaryResponse);
          summary = summaryResponse.data.summary || summary;
        } catch (error) {
          console.error("Error in summarization:", error);
        }
  
        try {
          const response = await axios.post("http://localhost:5000/upload_reviews", {
            reviews: res.data,
          });
          console.log("Uploaded reviews");
        } catch (error) {
          console.error("Error in uploading reviews:", error);
        }
  
        const username = localStorage.getItem("username");
        console.log(username); // Retrieve the username
  
        navigate("/product", {
          state: {
            product: {
              image: product_details.image || null,
              name: product_details.name || "Unknown Product",
              price: product_details.price || "Price not available",
              sumRes: summary,
              pos: positive,
              neg: negative,
              high: product_details.highlights || [],
              rating: product_details.rating || "No rating",
              reviews: reviewsArray, 
            },
          },
        });
      } catch (err) {
        console.log(err);
        setError(err.response?.data || "Error fetching product details.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="profile-container">
      <h1>Welcome, {username}!</h1>
      <h2>Your Recently Analyzed Products</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="product-card">
              <img
                src={product.productImage} // Corrected property name
                alt={product.productName} // Corrected property name
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.productName}</h3> {/* Corrected property name */}
                <p>Price: {product.productPrice}</p> {/* Corrected property name */}
                <p>Rating: {product.productRating}</p> {/* Corrected property name */}
                <a
                  href={product.productLink} // Corrected property name
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-link"
                >
                  View Product
                </a>
              </div>
              <button
                  className={`reanalyze-button ${loading ? 'loading' : ''}`}
                  onClick={(e) => handleReanalyze(e, product)}
                  disabled={loading}
                >
                  {loading ? 'Re-analyzing...' : 'Re-analyze'}
              </button>
            </div>
          ))
        ) : (
          <p>You haven't analyzed any products yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
