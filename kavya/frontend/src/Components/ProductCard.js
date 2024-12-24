import React from 'react';
import { Star, RotateCw } from 'lucide-react';

const ProductCard =({ product, onReanalyze }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div className="relative aspect-square">
        <img
          src={product.productImage}
          alt={product.productName}
          style={{ width:'337.77px', height:'337.77px'}}
          className="object-contain"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{product.productRating}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
          {product.productName}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">
            {product.productPrice}
          </span>
          <a
            href={product.productLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            View Details
          </a>
        </div>

        <button
          onClick={() => onReanalyze(product)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 group"
        >
          <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          Re-analyze
        </button>
      </div>
    </div>
  );
}


export default ProductCard;