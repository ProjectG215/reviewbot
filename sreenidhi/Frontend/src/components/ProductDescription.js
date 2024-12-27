import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const ProductDescription = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [summary, setSummary] = useState("Loading summary...");
  const [sentiment, setSentiment] = useState({ positive: 0, negative: 0 });
  const [productDetails, setProductDetails] = useState(() => {
    return (
      location.state?.productDetails ||
      JSON.parse(localStorage.getItem("productDetails"))
    );
  });
  const [loading, setLoading] = useState(true);

  const reviews = location.state?.reviews || [];

  // Save product details to local storage on mount
  useEffect(() => {
    if (location.state?.productDetails) {
      localStorage.setItem(
        "productDetails",
        JSON.stringify(location.state.productDetails)
      );
    }
  }, [location.state]);

  // Fetch product summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviews }),
        });

        if (response.ok) {
          const data = await response.json();
          setSummary(data.summary);
        } else {
          throw new Error("Failed to summarize reviews.");
        }
      } catch (error) {
        setSummary("Error summarizing reviews.");
        console.error("Summary Fetch Error:", error);
      }
    };

    if (reviews.length > 0) {
      fetchSummary();
    } else {
      setSummary("No reviews available for summarization.");
    }
  }, [reviews]);

  // Fetch sentiment analysis
  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const response = await fetch("http://localhost:5000/senti", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewTexts: reviews.map((r) => r.review) }),
        });

        if (response.ok) {
          const data = await response.json();
          setSentiment(data);
        } else {
          throw new Error("Failed to analyze sentiment.");
        }
      } catch (error) {
        console.error("Sentiment Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (reviews.length > 0) {
      fetchSentiment();
    } else {
      setLoading(false);
    }
  }, [reviews]);

  // Pie chart data configuration
  const pieData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        data: [sentiment.positive, sentiment.negative],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderColor: ["#388E3C", "#D32F2F"],
        borderWidth: 1,
      },
    ],
  };

  // Render conditional message if product details are missing
  if (!productDetails) {
    return <div className="text-center mt-10 text-gray-600">No product details found!</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6 pt-20">
      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Product Image */}
          <div className="md:w-1/4 p-4 bg-gray-100 flex items-center justify-center">
            <img
              src={productDetails.image || "https://via.placeholder.com/300"}
              alt="Product"
              className="w-1/2 max-w-full rounded-lg shadow-lg object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-3/4 p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              {productDetails.name || "Product Name"}
            </h1>
            <p className="text-lg text-gray-600 mb-3">
              <span className="font-semibold">Price: </span>
              {productDetails.price || "N/A"}
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <span className="font-semibold">Rating: </span>
              {productDetails.rating || "N/A"}
            </p>
            <p className="text-gray-700 text-md leading-relaxed">
              {productDetails.description || "No additional description available."}
            </p>
          </div>
        </div>
      </div>

      {/* Summary and Sentiment Section */}
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Summary</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
        </div>

        {/* Sentiment Analysis Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Sentiment</h2>
          {loading ? (
            <div className="text-center text-gray-600">Loading sentiment analysis...</div>
          ) : (
            <div className="text-gray-700 space-y-2">
              <p className="text-lg">
                <span className="font-semibold">Positive Reviews:</span> {sentiment.positive}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Negative Reviews:</span> {sentiment.negative}
              </p>
            </div>
          )}
          <div className="mt-6 flex justify-center">
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} height={150} />
          </div>
        </div>
      </div>

      {/* Chatbot Section */}
      <div className="max-w-7xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Need More Help?</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          If you have any further questions about the product, our chatbot is here to assist you.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/chatbot") }
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none"
          >
            Chat with Us Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;