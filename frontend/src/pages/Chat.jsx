import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Scale, Mic, Volume2, Pause } from "lucide-react";

// Component to format AI responses with headings, bullet points, and clickable links
const FormattedMessage = ({ text }) => {
  // Function to detect and convert URLs to clickable links and handle bold text
  const linkifyText = (text) => {
    // First handle bold text (**text**)
    const boldRegex = /\*\*(.+?)\*\*/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split by both patterns
    const parts = text.split(/(\*\*.+?\*\*|https?:\/\/[^\s]+)/g);
    
    return parts.map((part, i) => {
      // Check if it's a URL
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 underline font-medium transition-colors break-all"
          >
            {part}
          </a>
        );
      }
      
      // Check if it's bold text
      const boldMatch = part.match(boldRegex);
      if (boldMatch) {
        const boldContent = part.replace(/\*\*/g, '');
        return (
          <strong key={i} className="font-semibold text-emerald-900 text-[15px]">
            {boldContent}
          </strong>
        );
      }
      
      return part;
    });
  };

  const formatText = (text) => {
    const lines = text.split('\n');
    const formatted = [];
    let currentList = [];
    let listType = null;

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        if (currentList.length > 0) {
          formatted.push({ type: listType, items: [...currentList] });
          currentList = [];
          listType = null;
        }
        return;
      }

      // Check for numbered lists (1. or 1) format)
      const numberedMatch = trimmedLine.match(/^(\d+)[.)]\s+(.+)$/);
      if (numberedMatch) {
        if (listType !== 'ordered') {
          if (currentList.length > 0) {
            formatted.push({ type: listType, items: [...currentList] });
            currentList = [];
          }
          listType = 'ordered';
        }
        currentList.push(numberedMatch[2]);
        return;
      }

      // Check for bullet points (-, *, •)
      const bulletMatch = trimmedLine.match(/^[-*•]\s+(.+)$/);
      if (bulletMatch) {
        if (listType !== 'unordered') {
          if (currentList.length > 0) {
            formatted.push({ type: listType, items: [...currentList] });
            currentList = [];
          }
          listType = 'unordered';
        }
        currentList.push(bulletMatch[1]);
        return;
      }

      // Check for markdown bold headings (**text** at start of line)
      const boldHeadingMatch = trimmedLine.match(/^\*\*(.+?)\*\*:?$/);
      if (boldHeadingMatch) {
        if (currentList.length > 0) {
          formatted.push({ type: listType, items: [...currentList] });
          currentList = [];
          listType = null;
        }
        formatted.push({ type: 'heading', level: 2, text: boldHeadingMatch[1] });
        return;
      }

      // Check for headings (##, ###)
      const headingMatch = trimmedLine.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        if (currentList.length > 0) {
          formatted.push({ type: listType, items: [...currentList] });
          currentList = [];
          listType = null;
        }
        const level = headingMatch[1].length;
        formatted.push({ type: 'heading', level, text: headingMatch[2] });
        return;
      }

      // Lines ending with : might be headings (but not too long and not containing URLs)
      if (trimmedLine.endsWith(':') && trimmedLine.length < 80 && !trimmedLine.includes('http')) {
        if (currentList.length > 0) {
          formatted.push({ type: listType, items: [...currentList] });
          currentList = [];
          listType = null;
        }
        formatted.push({ type: 'heading', level: 3, text: trimmedLine.slice(0, -1) });
        return;
      }

      // Regular paragraph text
      if (currentList.length > 0) {
        formatted.push({ type: listType, items: [...currentList] });
        currentList = [];
        listType = null;
      }
      formatted.push({ type: 'paragraph', text: trimmedLine });
    });

    // Push remaining list items
    if (currentList.length > 0) {
      formatted.push({ type: listType, items: [...currentList] });
    }

    return formatted;
  };

  const formattedContent = formatText(text);

  return (
    <div className="space-y-4">
      {formattedContent.map((item, idx) => {
        if (item.type === 'heading') {
          const HeadingTag = item.level === 1 ? 'h2' : item.level === 2 ? 'h3' : 'h4';
          const sizeClass = item.level === 1 ? 'text-xl' : item.level === 2 ? 'text-lg' : 'text-base';
          return (
            <HeadingTag 
              key={idx} 
              className={`${sizeClass} font-bold text-emerald-800 mt-6 mb-3 first:mt-0 flex items-center gap-2`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              {item.text}
            </HeadingTag>
          );
        }
        
        if (item.type === 'ordered') {
          return (
            <ol key={idx} className="space-y-2.5 ml-1">
              {item.items.map((listItem, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-slate-700 leading-relaxed pt-0.5">
                    {linkifyText(listItem)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }
        
        if (item.type === 'unordered') {
          return (
            <ul key={idx} className="space-y-2.5 ml-1">
              {item.items.map((listItem, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 mt-2"></span>
                  <span className="flex-1 text-slate-700 leading-relaxed">
                    {linkifyText(listItem)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        
        return (
          <p key={idx} className="text-slate-700 leading-relaxed">
            {linkifyText(item.text)}
          </p>
        );
      })}
    </div>
  );
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const utterRef = useRef(null);
  const autoSendRef = useRef(false);
  const [lang, setLang] = useState("en-IN");

  // Lightweight script-based detection to infer locale
  const detectLangFromText = (text) => {
    const t = (text || "").trim();
    if (!t) return null;
    const RE = {
      devanagari: /[\u0900-\u097F]/,    // Hindi, Marathi
      bengali: /[\u0980-\u09FF]/,       // Bengali
      gurmukhi: /[\u0A00-\u0A7F]/,      // Punjabi
      gujarati: /[\u0A80-\u0AFF]/,
      oriya: /[\u0B00-\u0B7F]/,
      tamil: /[\u0B80-\u0BFF]/,
      telugu: /[\u0C00-\u0C7F]/,
      kannada: /[\u0C80-\u0CFF]/,
      malayalam: /[\u0D00-\u0D7F]/,
    };
    const MAP = {
      devanagari: "hi-IN",
      bengali: "bn-IN",
      gurmukhi: "pa-IN",
      gujarati: "gu-IN",
      oriya: "or-IN",
      tamil: "ta-IN",
      telugu: "te-IN",
      kannada: "kn-IN",
      malayalam: "ml-IN",
    };
    for (const [script, re] of Object.entries(RE)) {
      if (re.test(t)) return MAP[script];
    }
    // If only ASCII/Latin characters, keep current or fallback to English
    return "en-IN";
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = lang;
    recog.onresult = (e) => {
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + " ";
      }
      if (finalText.trim()) {
        // Detect locale from finalized chunk and restart with new lang if needed
        const detected = detectLangFromText(finalText);
        if (detected && detected !== lang) {
          setLang(detected);
          try { recog.stop(); } catch {}
          // The recognition instance will be rebuilt with new lang by this effect
        }
        setInput((prev) => (prev ? prev + " " : "") + finalText.trim());
      }
    };
    recog.onend = async () => {
      setListening(false);
      if (autoSendRef.current) {
        autoSendRef.current = false;
        if (input.trim()) {
          await handleSend();
        }
      }
    };
    recognitionRef.current = recog;
  }, [lang]);

  useEffect(() => {
    return () => {
      try { window.speechSynthesis?.cancel(); } catch {}
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, []);

  const toggleListening = () => {
    const recog = recognitionRef.current;
    if (!recog) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (listening) {
      try { recog.stop(); } catch {}
      setListening(false);
    } else {
      try { autoSendRef.current = true; recog.start(); setListening(true); } catch {}
    }
  };

  const speakMessage = (index, text) => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis not supported in this browser.");
      return;
    }
    // If clicking the one already speaking => pause/stop
    if (speakingIndex === index) {
      try { window.speechSynthesis.cancel(); } catch {}
      setSpeakingIndex(null);
      utterRef.current = null;
      return;
    }
    // Start speaking selected
    try { window.speechSynthesis.cancel(); } catch {}
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 1.0;
    u.pitch = 1.0;
    try {
      const voices = window.speechSynthesis?.getVoices?.() || [];
      const v = voices.find(v => v.lang === lang);
      if (v) u.voice = v;
    } catch {}
    u.onend = () => {
      setSpeakingIndex(null);
      utterRef.current = null;
    };
    utterRef.current = u;
    setSpeakingIndex(index);
    window.speechSynthesis.speak(u);
  };

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

  const handleSuggestionClick = async (suggestion) => {
    setMessages([{ sender: "user", text: suggestion }]);
    setIsTyping(true);

    const aiResponse = await sendPromptToBackend(suggestion);
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: aiResponse }
    ]);
  };

  return (
    <main className="h-[calc(100vh-3rem)] flex flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto relative">
        {messages.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Hero Icon */}
                <motion.div
                  className="relative w-20 h-20 mx-auto mb-6"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl blur-lg opacity-40"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <Scale className="text-white w-10 h-10" strokeWidth={2.5} />
                  </div>
                </motion.div>

                {/* Hero Text */}
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                  Understanding Your
                  <span className="block mt-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                    Constitutional Rights
                  </span>
                </h2>
                <p className="text-slate-600 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
                  Get expert guidance on Indian Constitutional Law, fundamental rights,
                  and legal procedures powered by AI
                </p>

                {/* Suggestion Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                  { [
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
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="group relative p-3 text-left bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl hover:border-emerald-400/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                      <div className="relative flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-lg">{suggestion.icon}</span>
                        </div>
                        <span className="text-slate-700 font-medium leading-relaxed text-xs pt-0 group-hover:text-emerald-700 transition-colors">
                          {suggestion.text}
                        </span>
                      </div>
                    </motion.button>
                  )) }
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
                          {msg.sender === "user" ? (
                            msg.text
                          ) : (
                            <FormattedMessage text={msg.text} />
                          )}
                        </div>
                      </motion.div>
                      {/* Per-message read aloud control for bot replies */}
                      {msg.sender === "bot" && (
                        <div className="mt-2">
                          <button
                            onClick={() => speakMessage(i, msg.text)}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                              speakingIndex === i
                                ? "border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100"
                                : "border-gray-200 text-slate-600 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                            }`}
                            title={speakingIndex === i ? "Stop reading" : "Read aloud"}
                          >
                            {speakingIndex === i ? (
                              <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Read aloud</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
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
                                opacity: [0.4, 1, 0.4],
                              }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay,
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
      <div className="relative border-t border-emerald-100/50 bg-white/60 backdrop-blur-xl p-4">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-end gap-2 bg-white border-2 border-slate-300/60 rounded-2xl p-1.5 shadow-xl hover:border-emerald-500/60 focus-within:border-emerald-600 transition-all duration-300">
            <input
              type="text"
              placeholder="Ask about constitutional law..."
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none placeholder:text-slate-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            />
            {/* Single Mic button to capture voice and auto-send on stop */}
            <motion.button
              onClick={toggleListening}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-xl transition border ${
                listening
                  ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                  : "bg-white border-gray-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
              }`}
              title={listening ? "Stop recording" : "Start voice input"}
            >
              <Mic className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={handleSend}
              disabled={!input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-xl p-2.5 transition-all duration-300 shadow-lg shadow-emerald-500/30 disabled:shadow-none"
            >
              <Send size={20} strokeWidth={2.5} />
            </motion.button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-3 font-medium">
            Samvidhan.ai provides general legal information. Always consult a qualified lawyer for specific legal advice.
          </p>
        </div>
      </div>
    </main>
  );
}