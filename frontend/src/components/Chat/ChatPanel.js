import React, { useState, useRef, useEffect } from "react";
import "./ChatPanel.css";
import ChatMessage from "./ChatMessage";
import { useTheme } from "../../context/ThemeContext";

const initialMessages = [{ id: 1, role: "assistant", loading: true }];

function parseGraphRequest(text) {
  const vsMatch   = text.match(/(\w[\w\s]*?)\s+vs\s+([\w\s]+?)(?=\s*(?:and\s+)?type|\s*$)/i);
  const typeMatch = text.match(/type\s*[=:]\s*(\w+)/i);
  if (!vsMatch || !typeMatch) return null;
  return {
    yCol:      vsMatch[1].trim(),
    xCol:      vsMatch[2].trim(),
    chartType: typeMatch[1].toLowerCase(),
  };
}

function ChatPanel({ onFirstMessage, onGraphRequest }) {
  const { isDark } = useTheme();

  const [messages,      setMessages]      = useState(initialMessages);
  const [input,         setInput]         = useState("");
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [storedCSV,     setStoredCSV]     = useState(null);

  const chatEndRef       = useRef(null);
  const inputRef         = useRef(null);
  const fileInputRef     = useRef(null);
  const menuRef          = useRef(null);
  const firstMessageSent = useRef(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleGlobalTyping = (e) => {
      const tag = document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1) {
        inputRef.current?.focus();
        setInput(prev => prev + e.key);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleGlobalTyping);
    return () => window.removeEventListener("keydown", handleGlobalTyping);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const greeting = "Hello! I'm your data assistant. Upload a CSV, then ask me to plot something like: revenue vs month and type = bar";
    const words = greeting.split(" ");
    let index = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        index++;
        setMessages(prev =>
          prev.map(m => m.id === 1 ? { ...m, loading: false, text: words.slice(0, index).join(" ") } : m)
        );
        if (index >= words.length) clearInterval(interval);
      }, 60);
    }, 900);
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text && selectedFiles.length === 0) return;

    if (!firstMessageSent.current) {
      firstMessageSent.current = true;
      onFirstMessage?.();
    }

    const filesToSend = [...selectedFiles];
    const userMsg = { id: Date.now(), role: "user", text, files: filesToSend };
    setMessages(prev => [...prev, userMsg]);

    if (filesToSend.length > 0) setStoredCSV(filesToSend[0].file);
    setSelectedFiles([]);
    setInput("");

    const graphReq = parseGraphRequest(text);
    const csvFile  = filesToSend.length > 0 ? filesToSend[0].file : storedCSV;

    if (graphReq && csvFile && onGraphRequest) {
      onGraphRequest({ file: csvFile, ...graphReq });
    }

    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, role: "assistant", loading: true }]);

    try {
      const res  = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data     = await res.json();
      const response = data.response || "No response";
      const words    = response.split(" ");
      let index = 0;
      setTimeout(() => {
        const interval = setInterval(() => {
          index++;
          setMessages(prev =>
            prev.map(m =>
              m.id === loadingId
                ? { ...m, loading: false, text: words.slice(0, index).join(" ") }
                : m
            )
          );
          if (index >= words.length) clearInterval(interval);
        }, 50);
      }, 800);
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingId
            ? { ...m, loading: false, text: `⚠️ Error: ${err.message}` }
            : m
        )
      );
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") sendMessage(); };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const validFiles = [];
    files.forEach(file => {
      const isCSV = file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");
      if (!isCSV) {
        setMessages(prev => [
          ...prev,
          { id: Date.now(), role: "assistant", text: "⚠️ Invalid file. Please upload a CSV file only." },
        ]);
        return;
      }
      validFiles.push({ file, url: URL.createObjectURL(file) });
    });
    if (validFiles.length > 0) setSelectedFiles(prev => [...prev, ...validFiles]);
    e.target.value = "";
  };

  const openCSVUpload = () => { setMenuOpen(false); fileInputRef.current?.click(); };
  const theme = isDark ? "dark" : "light";

  return (
    <aside className={`chat-panel ${theme}`}>
      <div className="chat-header">Chat</div>

      <div className="chat-messages">
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={chatEndRef} />
      </div>

      {storedCSV && selectedFiles.length === 0 && (
        <div style={{ padding: "4px 12px", fontSize: "11px", color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
          <span>📄 {storedCSV.name}</span>
          <button
            onClick={() => setStoredCSV(null)}
            style={{ border: "none", background: "none", cursor: "pointer", color: "#888", fontSize: 11 }}
          >✕</button>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div style={{ padding: "6px 12px" }}>
          {selectedFiles.map((item, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
              <span style={{ textDecoration: "underline" }}>📄 {item.file.name}</span>
              <button
                onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#888" }}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="chat-input-row">
        <div ref={menuRef} style={{ position: "relative" }}>
          <button className="chat-plus-btn" onClick={() => setMenuOpen(prev => !prev)}>+</button>
          {menuOpen && (
            <div style={{ position: "absolute", bottom: "40px", left: "0", background: "#1e1e1e", border: "1px solid #333", borderRadius: "6px", padding: "6px 0", width: "160px" }}>
              <button
                onClick={openCSVUpload}
                style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "8px 12px", background: "none", border: "none", color: "#ccc", cursor: "pointer" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Upload CSV
              </button>
            </div>
          )}
        </div>

        <input ref={fileInputRef} type="file" accept=".csv" multiple style={{ display: "none" }} onChange={handleUpload} />
        <input
          ref={inputRef}
          className="chat-input"
          placeholder="e.g. revenue vs month and type = bar"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="chat-send-btn" onClick={sendMessage}>Send</button>
      </div>
    </aside>
  );
}

export default ChatPanel;