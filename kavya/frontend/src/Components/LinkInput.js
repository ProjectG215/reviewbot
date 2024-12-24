import React, { useState,useEffect } from 'react';
import { Link2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { useAuth } from '../context/AuthContext';

const LinkInput = ({setProduct}) => { 
  const [url, setUrl] = useState('');
  const [flag, setFlag] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const content = useAuth();
  const user = content.username;
  useEffect(() => {
   
    console.log("this is user",user);
  }, [user]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('url', url)
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

      console.log("this is LinkInput",productDetails.image, productDetails.name, productDetails.price, productDetails.rating, sentiment.positive, sentiment.negative, summary, high);
      
      setIsSubmitted(true);
      

      
      
      
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 bg-slate-100">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <Link2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Add Review Link
          </h2>
          <p className="text-gray-600">
            Enter the URL of the product or service you'd like to analyze
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="url">
              URL
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/product"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading} 
          >
            {loading ? 'Analyzing...' : 'Analyze Reviews'}
          </button>
        </form>

        


      </div>
    </div>
}

    {loading && (
          <Loader/>
        )}
    </div>
  );
};

export default LinkInput;
