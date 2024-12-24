import React, { useEffect, useState } from 'react';
import { Bot, MessageSquareText, Brain, Sparkles } from 'lucide-react';

const stages = [
  {
    title: 'Scraping Reviews',
    icon: MessageSquareText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Summarizing Reviews',
    icon: Bot,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Analysing Sentiment',
    icon: Brain,
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
  },
];

export default function Loader() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-8 w-full max-w-md">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = currentStage === index;
          const isPast = currentStage > index;

          return (
            <div
              key={stage.title}
              className={`transition-all duration-500 transform ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            >
              <div
                className={`flex items-center space-x-4 p-4 rounded-lg ${
                  isActive ? stage.bgColor : 'bg-gray-50'
                } transition-colors duration-300`}
              >
                <div
                  className={`p-3 rounded-full ${
                    isActive ? stage.bgColor : 'bg-gray-100'
                  } transition-colors duration-300`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? stage.color : 'text-gray-400'
                    } transition-colors duration-300`}
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      isActive ? stage.color : 'text-gray-400'
                    } transition-colors duration-300`}
                  >
                    {stage.title}
                  </h3>
                  {isActive && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              stage.color.replace('text', 'bg')
                            } animate-bounce`}
                            style={{
                              animationDelay: `${i * 150}ms`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {isPast && (
                  <Sparkles className="w-5 h-5 text-green-500 animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
