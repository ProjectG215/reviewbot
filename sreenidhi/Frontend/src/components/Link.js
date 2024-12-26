import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Link = () => {
  const [productLink, setProductLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setProductLink(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateProductLink(productLink)) {
      setErrorMessage("");
      setLoading(true);

      const formData = new FormData();
      formData.append("url", productLink);

      try {
        const response = await fetch("http://127.0.0.1:5000/scrape", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);

          navigate("/productDescription", 
            { 
              state: 
              { productDetails: data.product_details, 
                highlights: data.highlights,
                reviews: data.reviews  
              } 
            });
        } 

        else 
        {
          setErrorMessage("Failed to fetch data. Please try again.");
        }
      } catch (error) {
        console.error("Error during API call:", error);
        setErrorMessage("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Please enter a valid product link.");
    }
  };

  const validateProductLink = (link) => {
    const urlPattern = /^(https?:\/\/)?([\w\d\-_]+\.){1,2}[\w\d\-_]+\/?/;
    return urlPattern.test(link);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-black-700 mb-4 text-center">
          Product Insights
        </h1>
        <p className="text-gray-600 text-sm text-center mb-6">
          Enter a product link to analyze reviews, highlights, and details.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            placeholder="Paste the product link here"
            value={productLink}
            onChange={handleInputChange}
          />
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Get Insights"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ReviewBot is here to help you make informed decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Link;









// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Link = () => {
//   const [productLink, setProductLink] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleInputChange = (event) => {
//     setProductLink(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (validateProductLink(productLink)) {
//       setErrorMessage("");
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("url", productLink);

//       try {
//         const response = await fetch("http://127.0.0.1:5000/scrape", {
//           method: "POST",
//           body: formData,
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log("API Response:", data); 

//           navigate("/productDescription", 
//             { 
//               state: 
//               { productDetails: data.product_details, 
//                 highlights:data.highlights,
//                 reviews: data.reviews  
//               } 
//             });
//         } 

//         else 
//         {
//           setErrorMessage("Failed to fetch data. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error during API call:", error);
//         setErrorMessage("An error occurred while fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setErrorMessage("Please enter a valid product link.");
//     }
//   };

//   const validateProductLink = (link) => {
//     const urlPattern = /^(https?:\/\/)?([\w\d\-_]+\.){1,2}[\w\d\-_]+\/?/;
//     return urlPattern.test(link);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
//       <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-xl">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
//           Get Product Analysis
//         </h1>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <input
//             type="text"
//             className="w-full p-3 border rounded-lg"
//             placeholder="Enter product link"
//             value={productLink}
//             onChange={handleInputChange}
//           />
//           {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold"
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "Submit"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Link;






