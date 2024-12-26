import React, { useState } from "react";
import axios from "axios";

const ChatBotPage = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSend = async () => {
        if (!input.trim()) {
            return; // Prevent sending empty or whitespace-only messages
        }

        // Add user message to chat
        setMessages([...messages, { role: "user", content: input }]);

        try {
            const response = await axios.post(
                "http://localhost:5000/query", // Backend endpoint
                { question: input }, // Request payload
                { headers: { "Content-Type": "application/json" } } // Headers
            );

            console.log("Input being sent to backend:", input);
            console.log("API Response:", response.data);

            // Add bot's response to chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: "bot", content: response.data.answer },
            ]);
        } catch (error) {
            console.error("Error communicating with the bot:", error);

            // Add error message to chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: "bot", content: "Sorry, there was an error. Please try again later." },
            ]);
        }

        setInput(""); // Clear input field
    };

    return (
        <div className="flex items-center justify-center h-screen bg-white">
            {/* Chat Container */}
            <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl h-[80%] flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 text-white text-center py-4 font-bold text-xl rounded-t-xl">
                    Chatbot
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-100">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[70%] p-4 rounded-lg shadow-md text-sm ${
                                    msg.role === "user"
                                        ? "bg-blue-500 text-white rounded-br-none"
                                        : "bg-gray-300 text-black rounded-bl-none"
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="bg-gray-200 p-4 border-t border-gray-300 flex items-center gap-4 rounded-b-xl">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBotPage;
