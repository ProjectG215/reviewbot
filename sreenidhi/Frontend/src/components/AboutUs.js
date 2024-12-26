import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">About Us</h1>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to <strong>ReviewBot</strong> – your intelligent assistant for product reviews! At ReviewBot, we believe that finding the right product should be easier and faster. Our mission is to help consumers make informed decisions by providing clear, concise, and insightful product reviews.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Whether you’re looking for a deep dive into product features or just a quick overview, ReviewBot is here to assist.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Who We Are</h2>
        <p className="text-lg text-gray-700 mb-4">
          We are a team of passionate developers, designers, and data enthusiasts, working at the intersection of technology and consumer experience. Our goal is to simplify the process of reading and analyzing product reviews, so you can focus on choosing what’s best for you.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">What We Do</h2>
        <p className="text-lg text-gray-700 mb-4">
          ReviewBot leverages the power of <strong>AI and Machine Learning</strong> to analyze and summarize thousands of product reviews from various e-commerce platforms. Our smart algorithm processes user-generated content, highlights key features, and provides sentiment analysis, helping users get a complete picture of a product's strengths and weaknesses in just a few seconds.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Why ReviewBot?</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-4 space-y-2">
          <li><strong>Save Time:</strong> No need to read through hundreds of reviews. ReviewBot condenses them into clear, meaningful summaries.</li>
          <li><strong>Sentiment Analysis:</strong> Know at a glance how other customers feel about the product.</li>
          <li><strong>Accurate Insights:</strong> Get reliable information based on comprehensive data analysis.</li>
          <li><strong>User-Friendly:</strong> Our simple interface ensures you can find the information you need quickly and efficiently.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Our Vision</h2>
        <p className="text-lg text-gray-700 mb-4">
          Our vision is to become a trusted companion in your online shopping journey. By continuously improving our AI algorithms and expanding our data sources, we aim to offer the most relevant, accurate, and helpful product reviews to millions of users worldwide.
        </p>

        <div className="text-center mt-8">
          <p className="text-lg text-gray-600">Thank you for choosing <strong>ReviewBot</strong>!</p>
          <p className="text-lg text-gray-600 mt-2">We’re here to make your shopping experience smarter, faster, and more enjoyable.</p>
        </div>

        <div className="text-center mt-8">
          <p className="text-lg text-gray-600">For any inquiries or feedback, feel free to reach out at:</p>
          <a href="mailto:contact@reviewbot.com" className="text-blue-500 hover:underline">contact@reviewbot.com</a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
