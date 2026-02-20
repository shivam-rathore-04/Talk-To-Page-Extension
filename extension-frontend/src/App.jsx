import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUp, Bot, Sparkles, RefreshCw } from 'lucide-react'; 
import { sendToBackend } from './app';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pageContext, setPageContext] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Generate a random ID for this specific "Open" session
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const extractPageContent = (isRefresh = false) => {
    if (isRefresh) setPageContext('');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extract_text" }, (response) => {
            if (chrome.runtime.lastError) {
                 addMessage("error", "Could not read page. Refresh the tab and try again.");
                 return; 
            }
            if (response?.text) {
                setPageContext(response.text);
                addMessage("system", isRefresh ? "Context updated!" : "Connected");
            } else {
                addMessage("error", "Page seems empty. Try refreshing.");
            }
        });
      }
    });
  };

  useEffect(() => { extractPageContent(); }, []);

  useEffect(() => {
    const handleTabUpdate = (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.active) {
        extractPageContent(true);
      }
    };
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    return () => chrome.tabs.onUpdated.removeListener(handleTabUpdate);
  }, []);

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  const handleSend = async () => {
    if (!input.trim() || !pageContext) return;
    const q = input;
    setInput('');
    addMessage("user", q);
    setLoading(true);

    try {
      const data = await sendToBackend(q, pageContext, sessionId);
      addMessage("ai", data.answer);
    } catch (e) {
      addMessage("error", "Error: Backend is not running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white text-gray-900 font-sans">
      
      {/* --- UPDATED HEADER --- */}
      <header className="bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
            {/* 1. Added Icon Image */}
            <img src="icon.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            
            {/* 2. Increased Font Size (text-xl) and Weight (font-bold) */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <h1 className="font-bold text-xl text-gray-800 tracking-tight leading-none">
                        Talk To Page
                    </h1>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-1">
            <button 
                onClick={() => extractPageContent(true)} 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-all"
                title="Refresh Context"
            >
                <RefreshCw size={18} />
            </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'ai' && (
                <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
                    <Bot size={16} className="text-gray-600"/>
                </div>
            )}
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
              m.role === 'user' ? 'bg-black text-white rounded-br-sm' : m.role === 'error' ? 'bg-red-50 text-red-600 w-full text-center py-2 border border-red-100 rounded-md' : m.role === 'system' ? 'bg-transparent text-gray-400 text-xs w-full text-center py-1 italic' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {m.role === 'ai' ? <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown></div> : m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-sm"><Bot size={16} className="text-gray-600"/></div>
             <div className="flex items-center gap-1 h-8"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span><span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white pb-4">
        <div className="relative flex items-center">
          <input className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 text-sm px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all rounded-full pr-12 border border-transparent" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask follow-up..." disabled={loading}/>
          <button onClick={handleSend} disabled={loading || !input.trim()} className={`absolute right-2 p-1.5 rounded-full transition-all duration-200 flex items-center justify-center ${loading || !input.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 shadow-md transform hover:scale-105'}`}><ArrowUp size={18} strokeWidth={2.5} /></button>
        </div>
      </div>
    </div>
  );
}
export default App;