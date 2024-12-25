import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./History.css";

function History({ setDetails }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          alert("Please login first!");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:3001/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.history) {
          setProducts(response.data.history);
        }
      } catch (error) {
        console.error("Error fetching history:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="history-container">
      <h1 style={{fontSize:"50px",marginTop:"5rem"}}>
        <span className="highlighted-title">ProBot</span> Search History
      </h1>
      <div className="card-container">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard setDetails={setDetails} key={product._id} item={product} />
          ))
        ) : (
          <div className="no-history-message">
            <p>Your search history is empty. Start exploring now!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
