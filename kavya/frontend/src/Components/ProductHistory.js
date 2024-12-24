import React, { useState, useEffect } from 'react';
import  ProductCard  from './ProductCard';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import  Loader  from './Loader';
import { useNavigate } from 'react-router-dom';


const ProductHistory = (setProduct) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const content = useAuth();
  const user = content.username;
  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/history/${user}`);
      setProducts(response.data);
    } catch (error) {
      console.log("Error in getting products:", error);
    }
  };

  const handleReanalyze = async(product) => {
    console.log("Reanalyze clicked for product:", product);
    setLoading(true); 

    try {
      const formData = new URLSearchParams();
      formData.append('url', product.productLink)
      formData.append('username', user)


      const res = await axios.post('http://localhost:8000/api/scrape', formData, {

        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
       
      // productDetails: pDetails,
      //     summary: summarizeResponse.data.summary,
      //     sentiment: sentimentResponse.data,

      const { productDetails, summary, sentiment,high} = res.data;

      // console.log(res.data);


      // console.log(productDetails);
      setProduct({
        image: productDetails.image,
        name: productDetails.name,
        price: productDetails.price,
        rating: productDetails.rating,
        sumRes: summary,
        pos: sentiment.positive,
        neg: sentiment.negative,
        high: high,
      });

      console.log("this productHis",productDetails.image, productDetails.name, productDetails.price, productDetails.rating, sentiment.positive, sentiment.negative, summary, high);
      
      
      

      
      
      
      // console.log('Response:', res.data);
      // console.log('Product Details:', productDetails); 
      
      
     
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
      navigate('/product'); 

      
    }

    

  };

  return (
    <div>


      {!loading &&
    <div>
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
        <span className="text-gray-600">{products.length} items analyzed</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            onReanalyze={handleReanalyze}
          />
        ))}
      </div>
    </div>

    </div>}

    {
      loading &&
      <Loader/>
    }


    </div>
  );
};

export default ProductHistory;
