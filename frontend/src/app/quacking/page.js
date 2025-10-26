// src/app/quacking/page.js
"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { askGemini, analyzeSentiment } from "../api/client";
import { sttSupported, useSpeechToText } from "../lib/stt";
import BackButton from "../components/BackButton";
import {
  speak,
  speakRealistic,
  cancel,
  supported as ttsSupported,
} from "../lib/tts";

export default function Quacking() {
  const [messages, setMessages] = useState([]);
  const [sentiment, setSentiment] = useState("Neutral");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Speech-to-Text: one-shot utterances; auto end when user pauses
  const {
    listening,
    interim,
    finalText,
    error: sttError,
    start,
    stop,
    reset,
  } = useSpeechToText({
    lang: "en-US",
    continuous: false,
    interimResults: true,
  });

  // If user starts speaking, stop any ongoing TTS so it doesn't talk over them
  useEffect(() => {
    if (listening && ttsSupported) {
      try {
        cancel();
      } catch {}
    }
  }, [listening]);

  // Map sentiment to duck image
  const getDuckImage = (sentiment) => {
    const sentimentLower = (sentiment || "neutral").toLowerCase();
    
    if (sentimentLower.includes("good") || sentimentLower.includes("positive")) {
      return "/understanding_grad_duck.png"; // Happy/successful duck
    } else if (sentimentLower.includes("poor") || sentimentLower.includes("negative") || sentimentLower.includes("confused")) {
      return "/confused_grad_duck.png"; // Confused duck
    } else {
      return "/attentive_grad_duck1.png"; // Default/neutral duck
    }
  };

  const sendPrompt = async (prompt, { max_tokens = 4096 } = {}) => {
    const trimmed = (prompt || "").trim();
    if (!trimmed) return;

    // Append user message and an assistant placeholder (loading)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "", isLoading: true },
    ]);
    setIsLoading(true);

    try {
      // Build history from current messages (exclude the loading placeholder we just added)
      const history = messages
        .filter((msg) => !msg.isLoading) // Exclude loading placeholders
        .map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user", // Convert to Gemini format
          content: msg.content,
        }));

      // Get both responses in parallel, both with history
      const [data, sentimentData] = await Promise.all([
        askGemini(trimmed, {
          max_tokens,
          history, // Send conversation history
          duck: "grad" // Pass duck parameter for study session
        }),
        analyzeSentiment(trimmed, {
          max_tokens,
          history, // Send conversation history to sentiment analysis too
          duck: "grad" // Consistent duck parameter
        })
      ]);

      // Update sentiment
      const newSentiment = sentimentData.sentiment || "Neutral";
      console.log("Sentiment analyzed:", newSentiment);
      setSentiment(newSentiment);

      // Replace the trailing placeholder with the actual response
      setMessages((prev) => {
        if (!prev.length) return prev;
        const next = prev.slice();
        const last = next.length - 1;
        if (next[last]?.isLoading) {
          next[last] = { 
            role: "assistant", 
            content: data.text,
            sentiment: newSentiment 
          };
        } else {
          next.push({ 
            role: "assistant", 
            content: data.text,
            sentiment: newSentiment 
          });
        }
        return next;
      });

      // Speak assistant reply (prefer realistic TTS; fallback to browser if unavailable)
      const audio = await speakRealistic({
        text: data.text,
        voice_id: "EDO68oHvNm0rxTewQZSK",
      });
      if (!audio && ttsSupported) {
        try {
          cancel();
        } catch {}
        speak({ text: data.text });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        if (!prev.length) return prev;
        const next = prev.slice();
        const last = next.length - 1;
        if (next[last]?.isLoading) {
          next[last] = {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          };
        } else {
          next.push({
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          });
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const prompt = input;
    setInput("");
    await sendPrompt(prompt, { max_tokens: 10000 });
  };

  // When speech recognition ends and we have an utterance, send it
  useEffect(() => {
    if (!sttSupported) return;
    if (listening) return; // still capturing
    const prompt = (finalText + (interim ? " " + interim : "")).trim();
    if (!prompt) return;

    (async () => {
      try {
        await sendPrompt(prompt, { max_tokens: 10000 });
      } finally {
        // clear transcript after sending; do not auto-restart here, user controls with mic
        try {
          reset();
        } catch {}
      }
    })();
  }, [sttSupported, listening, finalText, interim]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header*/}
      <div className="bg-gray-900 border-b-2 border-amber-800 px-6 py-4 flex justify-between items-center">
        {/* Back button - left aligned */}
        <BackButton />
        
        {/* Sentiment indicator - centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {sentiment && (
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              sentiment.toLowerCase().includes("good") 
                ? "bg-green-600 text-white" 
                : sentiment.toLowerCase().includes("poor")
                ? "bg-red-600 text-white"
                : "bg-gray-600 text-white"
            }`}>
              Understanding: {sentiment}
            </div>
          )}
        </div>
        
        {/* Empty spacer to balance the layout */}
        <div className="w-[88px]"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg mb-2">Start explaining a concept</p>
              <p className="text-sm">
                The duck will ask questions to help you learn
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx}>
              {msg.role === "user" ? (
                // User message - simple style
                <div className="flex justify-end mb-4">
                  <div className="max-w-2xl px-6 py-4 rounded-lg bg-blue-600 text-white">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ) : (
                // Assistant message - Hades style
                <div className="relative max-w-3xl mx-auto">
                  {/* Duck character image - behind and slightly transparent */}
                  <div className="flex justify-center mb-[-60px] relative z-0 opacity-70">
                    <Image
                      src={getDuckImage(msg.sentiment || sentiment)}
                      alt="Duck"
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
                        <div
                          className="w-3 h-3 bg-amber-800 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-amber-800 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-amber-800 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
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
          
          {/* Invisible element at the bottom for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Fixed at bottom */}
      <div className="bg-gray-900 border-t-2 border-amber-800 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            {/* Microphone toggle for voice input */}
            <button
              type="button"
              onClick={() => {
                try {
                  cancel();
                } catch {}
                if (listening) {
                  stop();
                } else {
                  reset();
                  start();
                }
              }}
              title={listening ? "Stop listening" : "Start listening"}
              className={`px-4 py-3 rounded-lg border-2 ${
                listening
                  ? "border-red-500 bg-red-600 text-white"
                  : "border-amber-700 bg-amber-600 text-white"
              } hover:brightness-110 transition flex-shrink-0`}
            >
              {listening ? "🎙️ Stop" : "🎤 Speak"}
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Explain a concept..."
              disabled={isLoading}
              rows={1}
              className="flex-1 px-6 py-4 bg-gray-800 border-2 border-amber-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-600 disabled:opacity-50 text-lg resize-none overflow-hidden min-h-[56px] max-h-[200px]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg border-2 border-amber-800 flex-shrink-0"
            >
              →
            </button>
          </div>
          {sttError && (
            <div className="text-red-400 text-sm mt-2">{String(sttError)}</div>
          )}
        </div>
      </div>
    </div>
  );
}