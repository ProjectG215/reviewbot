import React, { useState } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

const ChatBotPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm ReviewBot. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      isBot: false
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:4000/api/chatbot', { question: input });

      const botMessage = {
        id: messages.length + 2,
        text: response.data.answer || "Sorry, I couldn't process that.",
        isBot: true
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error communicating with the backend:', error.message);

      const errorMessage = {
        id: messages.length + 2,
        text: "Oops! Something went wrong. Please try again later.",
        isBot: true
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="w-full text-center py-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Your Review Assistant: Powered by Technology, Driven by Insights
        </h1>
      </div>

      {/* Chat Container */}
      <div className="flex-1 w-full max-w-4xl mt-6 mx-auto p-4 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
        {/* Chat Window */}
        <div className="overflow-y-auto space-y-4 p-4 max-h-[60vh] flex-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} items-start`}
            >
              <div
                className={`p-3 rounded-lg max-w-[75%] text-sm ${
                  message.isBot
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-blue-500 text-white'
                } shadow-md`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2 border-t border-gray-300 pt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full text-center py-4 text-sm text-gray-600 mt-4">
        <p>© 2024 ReviewBot. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ChatBotPage;






// import React, { useState } from 'react';
// import { Send } from 'lucide-react';
// import axios from 'axios';

// const ChatBotPage = () => {
//   const [messages, setMessages] = useState([
//     { id: 1, text: "Hello! I'm ReviewBot. How can I help you today?", isBot: true }
//   ]);
//   const [input, setInput] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = {
//       id: messages.length + 1,
//       text: input,
//       isBot: false
//     };


//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');

//     try {
      
//       const response = await axios.post('http://localhost:4000/api/chatbot', { question: input });

//       const botMessage = {
//         id: messages.length + 2,
//         text: response.data.answer || "Sorry, I couldn't process that.",
//         isBot: true
//       };


//       setMessages((prev) => [...prev, botMessage]);
//     } 
//     catch (error) 
//     {
//       console.error('Error communicating with the backend:', error.message);

//       const errorMessage = {
//         id: messages.length + 2,
//         text: "Oops! Something went wrong. Please try again later.",
//         isBot: true
//       };


//       setMessages((prev) => [...prev, errorMessage]);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex">
//       {/* <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
//         <h3 className="text-xl font-semibold text-gray-800 mb-4">History</h3>
//         <div className="space-y-2">
//           {messages.filter((m) => !m.isBot).map((message) => (
//             <div
//               key={message.id}
//               className="p-2 rounded bg-gray-50 text-gray-700 truncate"
//             >
//               {message.text}
//             </div>
//           ))}
//         </div>
//       </div> */}

//       <div className="flex-1 flex flex-col">
//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex items-start space-x-2 mb-4 ${
//                 message.isBot ? '' : 'flex-row-reverse space-x-reverse'
//               }`}
//             >
//               <div
//                 className={`p-3 rounded-lg max-w-[80%] ${
//                   message.isBot
//                     ? 'bg-white text-gray-800 border border-gray-200'
//                     : 'bg-blue-600 text-white'
//                 }`}
//               >
//                 {message.text}
//               </div>
//             </div>
//           ))}
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Send className="h-6 w-6" />
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatBotPage;