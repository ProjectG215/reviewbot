import React, { useEffect, useState } from 'react';
import "./ProductList.css"


function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [LoggedIn,setLoggedIn] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            console.log(token);
            if(token){
              setLoggedIn(true);
            try {
                const response = await fetch('http://localhost:3001/products', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}` // Include the token in the headers
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data); // Store products in state
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
      else{
        setLoading(false);
      }
    }
        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!LoggedIn) {
      return (
          <div className='container'>
              <h2>Please log in to see the products.</h2>
          </div>
      ); // Show message if not logged in
  }

  if (error) {
      return (
          <div className='container'>
              <h2>Error: {error}</h2>
          </div>
      ); // Show error message if there's an error
  }

  return (
        <div className='product-container'> {/* New container for products */}
            <h1 className='mt-100'>Product List</h1>
            <div className='product-grid'> {/* Using the grid within the new container */}
                {products.map(product => (
                    <div key={product.productId} className='cardStyle'>
                        <h2>{product.productName}</h2>
                        <p>Rating: {product.rating}</p>
                        <button>Review</button>
                    </div>
                ))}
            </div>
        </div>
);


}

export default ProductList;
