import React, { useState, useRef, useEffect } from "react";
import "./ChatPanel.css";
import ChatMessage from "./ChatMessage";
import { useTheme } from "../../context/ThemeContext";
import dummyResponses from "../../data/dummyResponses";

const initialMessages = [
  { id: 1, role: "assistant", text: "Hello! I'm your data assistant. Ask me anything about the graph." },
];

function ChatPanel() {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), role: "user", text };
    const botText = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
    const botMsg  = { id: Date.now() + 1, role: "assistant", text: botText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 600);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") sendMessage(); };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const userMsg = { id: Date.now(), role: "user", text: `📎 ${file.name}` };
    const botMsg  = { id: Date.now() + 1, role: "assistant", text: `File "${file.name}" received! I'll analyze it shortly.` };
    setMessages((prev) => [...prev, userMsg]);
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 600);
    e.target.value = "";
  };

  const theme = isDark ? "dark" : "light";

  return (
    <aside className={`chat-panel ${theme}`}>

      {/* Header */}
      <div className="chat-header">Chat</div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Row */}
      <div className="chat-input-row">

        {/* Upload */}
        <label className="chat-plus-btn" title="Upload a file">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <input type="file" style={{ display: "none" }} onChange={handleUpload} />
        </label>

        {/* Text input */}
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Send */}
        <button className="chat-send-btn" onClick={sendMessage} title="Send">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>

      </div>
    </aside>
  );
}

export default ChatPanel;
