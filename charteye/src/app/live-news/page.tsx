'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function LiveNewsPage() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Format time to relative format (e.g., "2 minutes ago")
  const formatRelativeTime = (timestamp: string) => {
    if (!timestamp) return 'Unknown time';
    
    try {
      const now = new Date();
      const time = new Date(timestamp);
      const diffMs = now.getTime() - time.getTime();
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHr = Math.round(diffMin / 60);
      
      if (diffSec < 60) return 'Just now';
      if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
      if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
      
      return time.toLocaleDateString();
    } catch (err) {
      console.error('Error formatting time:', err);
      return 'Unknown time';
    }
  };

  // Handle chat message submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsChatLoading(true);
    setChatError(null);

    try {
      console.log("Sending request to chat API...");
      const response = await fetch('/api/news-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          currency: 'XAU', // Default to gold
          history: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to get response from chat API');
      }
      
      // Make sure we have a valid response
      if (!data.response || typeof data.response !== 'string') {
        console.error("Invalid response format:", data);
        throw new Error('Invalid response format from API');
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error in chat:', err);
      setChatError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsChatLoading(false);
    }
  };

  // Don't render anything until after mounting to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Financial News Chat</h1>
        <p className="text-sm text-gray-400">
          Ask questions about the latest financial news
        </p>
      </div>
      
      {/* Chat Interface */}
      <div className="w-full">
        <div className="bg-gray-800 rounded-md border border-gray-700 min-h-[600px] flex flex-col">
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-green-400" />
              <h2 className="text-lg font-medium">News Chat</h2>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Ask questions about the latest financial news
            </p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {formatRelativeTime(message.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {chatError && (
                <div className="bg-red-900/30 border border-red-700 text-red-100 px-4 py-3 rounded-md">
                  <p className="text-sm">{chatError}</p>
                </div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about the latest news..."
                className="flex-1 bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                disabled={isChatLoading || !inputMessage.trim()}
                className={`px-4 py-2 rounded-md ${
                  isChatLoading || !inputMessage.trim()
                    ? 'bg-gray-600 text-gray-400'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 