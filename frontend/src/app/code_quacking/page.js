// src/app/quacking/page.js
'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Quacking() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add placeholder message immediately to show duck
    const placeholderMessage = { role: 'assistant', content: '', isLoading: true };
    setMessages(prev => [...prev, placeholderMessage]);

    try {
      // Call the backend directly
      const response = await fetch('http://localhost:8000/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          system: "You are a helpful rubber duck assistant that asks Socratic questions to help users learn by explaining concepts. When a user explains something to you, ask thoughtful questions that guide them to deeper understanding. Be encouraging and curious.",
          max_tokens: 2048
        }),
      });

      const data = await response.json();
      
      // Replace placeholder with actual response
      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 && msg.isLoading
          ? { role: 'assistant', content: data.text }
          : msg
      ));
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 && msg.isLoading
          ? { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Left side - Code Editor */}
      <div className="w-1/2 border-r-2 border-amber-800 flex flex-col">
        <div className="bg-gray-800 border-b-2 border-amber-800 px-6 py-4">
          <h2 className="text-amber-400 font-bold text-xl">Code Editor</h2>
        </div>
        <div className="flex-1 p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write or paste your code here..."
            className="w-full h-full bg-gray-800 text-green-400 font-mono text-sm p-4 rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Right side - Duck Dialogue */}
      <div className="w-1/2 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                <p className="text-lg mb-2">Start explaining a concept</p>
                <p className="text-sm">The duck will ask questions to help you learn</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.role === 'user' ? (
                  // User message - simple style
                  <div className="flex justify-end mb-4">
                    <div className="max-w-xl px-6 py-4 rounded-lg bg-blue-600 text-white">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  // Assistant message - Hades style
                  <div className="relative mx-auto">
                    {/* Duck character image - behind and slightly transparent */}
                    <div className="flex justify-center mb-[-60px] relative z-0 opacity-70">
                        <Image 
                          src = "/graduate_duck2.png"
                          alt="Graduate Duck"
                          width={300}
                          height={300}
                          priority
                        />
                    </div>
                    
                    {/* Message box - Hades style */}
                    <div className="relative z-10 bg-gradient-to-b from-amber-100 to-amber-50 border-4 border-amber-800 rounded-lg p-6 pt-12 shadow-2xl">
                      {/* Header banner */}
                      <div className="absolute top-0 left-0 right-0 bg-amber-800 text-amber-100 py-1 px-4 text-center font-bold tracking-wider text-sm border-b-2 border-amber-900">
                        RUBBER DUCK
                      </div>
                      
                      {/* Decorative corners */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-amber-900"></div>
                      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-amber-900"></div>
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-amber-900"></div>
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-amber-900"></div>
                      
                      {/* Message content */}
                      {msg.isLoading ? (
                        <div className="flex space-x-2 items-center">
                          <div className="w-3 h-3 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-3 h-3 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-3 h-3 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : (
                        <p className="text-gray-900 text-lg leading-relaxed font-serif whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input - Fixed at bottom */}
        <div className="bg-gray-900 border-t-2 border-amber-800 px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Explain a concept..."
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-gray-800 border-2 border-amber-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600 disabled:opacity-50 text-lg"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg border-2 border-amber-800"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}