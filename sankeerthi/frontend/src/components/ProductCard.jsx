import React, { useState } from "react";
import "./ProductCard.css";
import axios from "axios";
import Loader from "./Loader";
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ item, setDetails }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = async (link) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/linkInput",
        { inputValue: link },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { productDetails, summary, sentiment, highlights } = response.data;
      setDetails({
        image: productDetails.image,
        name: productDetails.name,
        price: productDetails.price,
        sumRes: summary.summary,
        pos: sentiment.positive,
        neg: sentiment.negative,
        high: highlights,
      });
      navigate("/description");
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      <img
        src={item.image}
        alt={item.productName || "Product Image"}
        className="product-image"
      />
      <div className="product-details">
        <h2 className="product-title">{item.productName || "Product Name Unavailable"}</h2>
        <div className="product-category">{item.category || "Uncategorized"}</div>
        <div className="card-footer">
          <button
            className="product-link"
            onClick={() => handleAnalysis(item.productLink)}
          >
            Perform Analysis
          </button>
          <br></br>
          <br></br>
          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
