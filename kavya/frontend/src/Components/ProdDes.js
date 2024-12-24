// import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart'; 
// import Loader from './Loader';
import {Link} from 'react-router-dom';
import './ProdDes.css';

const ProdDes = ({ product }) => {
  const { image, name, price, rating, pos, neg, sumRes, high } = product;


  console.log("this is ProdDes",image, name, price, rating, pos, neg, sumRes, high);
 
  const chartData = {
    series: [
      {
        data: [
          { id: 0, value: pos, label: 'Positive' },
          { id: 1, value: neg, label: 'Negative' },
        ],
      },
    ],
  };


  return(
    
    <div className="prod-container">
      <div className="prod-wrapper">
        <div className="prod-card">
 
          <div className="prod-main ">
            <div className="prod-image-container">
              <img
                src={image}
                alt={name}
                className="prod-image"
              />
            </div>

            <div className="prod-info">
              <h1 className="prod-title">{name}</h1>
              <div className="prod-price">{price}</div>
              <div className="prod-highlights">
                {high && Array.isArray(high) && high.map((text, index) => (
                  <div key={index} className="prod-highlight-text">
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

              
          <div className="prod-summary-section">
            {sumRes && pos && neg && (
              <div className="prod-summary-wrapper">
                <div className="prod-summary">
                  <h2>Product Summary</h2>
                  <p>{sumRes}</p>
                </div>
                <div className="prod-sentiment-container">
                <h2 className="prod-sentiment-title">Customer Sentiment</h2>
                  <div className="prod-sentiment-chart">
                    
                    <PieChart
                      series={chartData.series}
                      width={400}
                      height={200}
                    />
                  </div>

                  <Link to="/ChatBot" className="prod-back-link" >Have More Queries? <p className='text-primary'>Use our ChatBot</p></Link>
                </div>
              </div>
            )}

            
            
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdDes;