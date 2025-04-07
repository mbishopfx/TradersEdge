'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

// Function to format text content with proper spacing and lists
const formatMessageContent = (content: string) => {
  // Convert markdown-like formats for code, emphasis, etc.
  let formattedContent = content
    // Handle inline code with backticks
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Handle emphasis with asterisks
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Convert paragraphs to proper JSX
  const paragraphs = formattedContent.split('\n\n').filter(p => p.trim() !== '');
  
  return paragraphs.map((paragraph, pIndex) => {
    // Check if this is a code block (if it starts with ```code or if each line starts with spaces or tabs)
    if (paragraph.startsWith('```') && paragraph.endsWith('```')) {
      const codeContent = paragraph.slice(3, -3);
      // Check if there's a language indicator
      const firstLineBreak = codeContent.indexOf('\n');
      let code = codeContent;
      let language = '';
      
      if (firstLineBreak > 0 && firstLineBreak < 20) {
        language = codeContent.slice(0, firstLineBreak).trim();
        code = codeContent.slice(firstLineBreak + 1);
      }
      
      return (
        <div key={pIndex} className="my-3 bg-gray-900 rounded-md p-3 overflow-x-auto">
          <pre>
            <code>{code}</code>
          </pre>
          {language && <div className="text-xs text-gray-500 mt-1">{language}</div>}
        </div>
      );
    }
    // Check if this paragraph contains a list
    else if (paragraph.includes('\n- ')) {
      const [listIntro, ...listItems] = paragraph.split('\n- ');
      
      return (
        <div key={pIndex} className="mb-3">
          {listIntro && <p className="mb-1" dangerouslySetInnerHTML={{ __html: listIntro }} />}
          <ul className="list-disc pl-5 space-y-1">
            {listItems.map((item, iIndex) => (
              <li key={`${pIndex}-${iIndex}`} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>
      );
    } 
    // Check if this paragraph contains numbered list
    else if (/\n[0-9]+\.\s/.test(paragraph)) {
      const [listIntro, ...listItemsRaw] = paragraph.split(/\n[0-9]+\.\s/);
      const listItems = listItemsRaw.filter(item => item.trim() !== '');
      
      return (
        <div key={pIndex} className="mb-3">
          {listIntro && <p className="mb-1" dangerouslySetInnerHTML={{ __html: listIntro }} />}
          <ol className="list-decimal pl-5 space-y-1">
            {listItems.map((item, iIndex) => (
              <li key={`${pIndex}-${iIndex}`} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ol>
        </div>
      );
    }
    // Handle regular paragraphs with potential line breaks
    else {
      const lines = paragraph.split('\n');
      if (lines.length > 1) {
        return (
          <p key={pIndex} className="mb-3">
            {lines.map((line, lIndex) => (
              <React.Fragment key={`${pIndex}-${lIndex}`}>
                <span dangerouslySetInnerHTML={{ __html: line }} />
                {lIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      }
      // Simple paragraph
      return <p key={pIndex} className="mb-2" dangerouslySetInnerHTML={{ __html: paragraph }} />;
    }
  });
};

export default function TradingInsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to Trading Insights! I'm your personal trading advisor. With years of experience in retail trading, I can help you analyze market conditions, identify potential opportunities, and develop trading strategies that suit your style. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/trading-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userId: user?.uid || 'anonymous',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting trading insights:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting to our analysis service. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-6 rounded-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Trading Insights
        </h1>
        <p className="text-gray-300 mb-6">
          Chat with our AI trading expert to get personalized insights and strategies for your trading journey.
        </p>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 h-[500px] mb-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700 shadow-lg'
                }`}
              >
                <div className={`text-sm prose prose-invert max-w-none ${
                  message.role === 'assistant' ? 'prose-p:mb-3 prose-headings:mt-4 prose-headings:mb-2' : ''
                }`}>
                  {message.role === 'assistant' 
                    ? formatMessageContent(message.content)
                    : <p>{message.content}</p>
                  }
                </div>
                <p className="text-xs mt-3 opacity-60 text-right">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block max-w-[80%] rounded-lg p-3 bg-gray-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market analysis, trading strategies, risk management..."
            disabled={isLoading}
            className="flex-grow px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
} 