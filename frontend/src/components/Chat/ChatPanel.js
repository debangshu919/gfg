import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import chatStyles from "./chatStyles";
import dummyResponses from "../../data/dummyResponses";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Hello! I'm your data assistant. Ask me anything about the graph.",
  },
];

function ChatPanel() {
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
    const botMsg = { id: Date.now() + 1, role: "assistant", text: botText };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userMsg = { id: Date.now(), role: "user", text: `📎 ${file.name}` };
    const botMsg = {
      id: Date.now() + 1,
      role: "assistant",
      text: `File "${file.name}" received! I'll analyze it shortly.`,
    };

    setMessages((prev) => [...prev, userMsg]);
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 600);
    e.target.value = "";
  };

  return (
    <aside style={chatStyles.chatPanel}>
      <div style={chatStyles.chatHeader}>Chat</div>

      <div style={chatStyles.chatMessages}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>
      {/* Input Row */}
<div style={chatStyles.chatInputRow}>
  <label style={chatStyles.plusBtn} title="Upload a file">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
    <input type="file" style={{ display: "none" }} onChange={handleUpload} />
  </label>

  <input
    style={chatStyles.chatInput}
    placeholder="Type a message..."
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKeyDown}
  />
  <button style={chatStyles.sendBtn} onClick={sendMessage} title="Send">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  </button>
</div>
    </aside>
  );
}

export default ChatPanel;