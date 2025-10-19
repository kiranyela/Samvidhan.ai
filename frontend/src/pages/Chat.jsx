import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Scale } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ...existing imports...


const sendPromptToBackend = async (problem) => {
  try {
    const response = await fetch('/api/chat/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem }),
    });
    const data = await response.json();
    return data.response || data.error || "No response from AI.";
  } catch (error) {
    return "Error: Unable to get response from AI.";
  }
};

    const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

  const aiResponse = await sendPromptToBackend(input.trim());
    setIsTyping(false);
    setMessages((prev) => [
        ...prev,
        { sender: "bot", text: aiResponse }
    ]);
    };
  

  const handleSuggestionClick = (suggestion) => {
    setMessages([{ sender: "user", text: suggestion }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "bot", 
          text: `Regarding "${suggestion}" - The Indian Constitution provides specific protections and procedures. Let me explain the relevant legal framework, constitutional articles, and your rights in this matter...` 
        },
      ]);
    }, 1800);
  };

  return (
    <main className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      {/* Premium Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative bg-white/60 backdrop-blur-xl border-b border-emerald-100/50 shadow-sm sticky top-0 z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Scale className="text-white w-6 h-6" strokeWidth={2.5} />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  Samvidhan.ai
                </span>
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-0.5">AI-Powered Constitutional Assistant</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="text-emerald-600 w-6 h-6" />
          </motion.div>
        </div>
      </motion.header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center px-4 py-16">
            <div className="max-w-5xl mx-auto w-full text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Hero Icon */}
                <motion.div 
                  className="relative w-24 h-24 mx-auto mb-10"
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl blur-xl opacity-40"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <Scale className="text-white w-12 h-12" strokeWidth={2.5} />
                  </div>
                </motion.div>

                {/* Hero Text */}
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
                  Understanding Your
                  <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                    Constitutional Rights
                  </span>
                </h2>
                <p className="text-slate-600 text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
                  Get expert guidance on Indian Constitutional Law, fundamental rights, 
                  and legal procedures powered by AI
                </p>

                {/* Suggestion Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {[
                    { text: "What are my fundamental rights under the Constitution?", icon: "🏛️", gradient: "from-blue-500 to-indigo-600" },
                    { text: "How can I file a Public Interest Litigation?", icon: "📜", gradient: "from-purple-500 to-pink-600" },
                    { text: "Explain Right to Life under Article 21", icon: "⚖️", gradient: "from-emerald-500 to-teal-600" },
                    { text: "What is the Right to Information Act?", icon: "📋", gradient: "from-orange-500 to-red-600" }
                  ].map((suggestion, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="group relative p-6 text-left bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 rounded-3xl hover:border-emerald-400/60 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                      <div className="relative flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl">{suggestion.icon}</span>
                        </div>
                        <span className="text-slate-700 font-medium leading-relaxed text-base pt-2 group-hover:text-emerald-700 transition-colors">
                          {suggestion.text}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 py-10">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`mb-10 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-5 max-w-4xl ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <motion.div 
                      className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl ${
                        msg.sender === "user" 
                          ? "bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white" 
                          : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700"
                      }`}
                      whileHover={{ scale: 1.1, rotate: msg.sender === "user" ? -5 : 5 }}
                    >
                      {msg.sender === "user" ? (
                        <span className="font-bold text-sm">You</span>
                      ) : (
                        <Scale className="w-5 h-5" strokeWidth={2.5} />
                      )}
                    </motion.div>

                    {/* Message Content */}
                    <div className={`flex-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                      <div className="text-xs font-bold tracking-wide text-slate-500 mb-2 uppercase">
                        {msg.sender === "user" ? "You" : "Samvidhan.ai"}
                      </div>
                      <motion.div 
                        className={`inline-block px-6 py-4 rounded-3xl shadow-xl ${
                          msg.sender === "user"
                            ? "bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white rounded-br-md"
                            : "bg-white text-slate-800 border-2 border-slate-200/60 rounded-bl-md"
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="text-[15px] leading-relaxed">
                          {msg.text}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-10 flex justify-start"
                >
                  <div className="flex gap-5 max-w-4xl">
                    <div className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 shadow-xl">
                      <Scale className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold tracking-wide text-slate-500 mb-2 uppercase">
                        Samvidhan.ai
                      </div>
                      <div className="inline-block px-6 py-4 rounded-3xl bg-white border-2 border-slate-200/60 shadow-xl rounded-bl-md">
                        <div className="flex gap-1.5">
                          {[0, 0.15, 0.3].map((delay, i) => (
                            <motion.span
                              key={i}
                              className="w-2.5 h-2.5 bg-emerald-600 rounded-full"
                              animate={{ 
                                scale: [1, 1.3, 1], 
                                opacity: [0.4, 1, 0.4] 
                              }}
                              transition={{ 
                                duration: 1.2, 
                                repeat: Infinity, 
                                delay 
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Premium Input Area */}
      <div className="relative border-t border-emerald-100/50 bg-white/60 backdrop-blur-xl p-6">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-end gap-4 bg-white border-2 border-slate-300/60 rounded-3xl p-2 shadow-2xl hover:border-emerald-500/60 focus-within:border-emerald-600 transition-all duration-300">
            <input
              type="text"
              placeholder="Ask about constitutional law, fundamental rights, legal procedures..."
              className="flex-1 bg-transparent px-5 py-4 text-base focus:outline-none placeholder:text-slate-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            />
            <motion.button
              onClick={handleSend}
              disabled={!input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-2xl p-3.5 transition-all duration-300 shadow-xl shadow-emerald-500/30 disabled:shadow-none"
            >
              <Send size={22} strokeWidth={2.5} />
            </motion.button>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4 font-medium">
            Samvidhan.ai provides general legal information. Always consult a qualified lawyer for specific legal advice.
          </p>
        </div>
      </div>
    </main>
  );
}