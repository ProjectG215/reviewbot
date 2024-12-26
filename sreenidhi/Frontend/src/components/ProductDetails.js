import React from "react";

const ProductDetails = ({ product }) => {
  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-sm">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h1 className="text-lg font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 mt-2 text-xl">{product.price}</p>
          <div className="flex items-center mt-3">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.rating} ★
            </span>
            <p className="text-gray-500 ml-2">Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
