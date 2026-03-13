import React, { useState, useRef, useEffect } from "react";
import "./ChatPanel.css";
import ChatMessage from "./ChatMessage";
import { useTheme } from "../../context/ThemeContext";
import dummyResponses from "../../data/dummyResponses";

const initialMessages = [
  { id: 1, role: "assistant", text: "Hello! I'm your data assistant. Ask me anything about the graph." },
];

function ChatPanel({ onFirstMessage }) {

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

    if (messages.length === 1 && onFirstMessage) {
      onFirstMessage();
    }

    const userMsg = {
      id: Date.now(),
      role: "user",
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const loadingId = Date.now() + 1;

    /* loading message */
    setMessages(prev => [
      ...prev,
      { id: loadingId, role: "assistant", loading: true }
    ]);

    const response =
      dummyResponses[Math.floor(Math.random() * dummyResponses.length)];

    const words = response.split(" ");

    let index = 0;

    setTimeout(() => {

      const interval = setInterval(() => {

        index++;

        setMessages(prev =>
          prev.map(m =>
            m.id === loadingId
              ? {
                  ...m,
                  loading: false,
                  text: words.slice(0, index).join(" ")
                }
              : m
          )
        );

        if (index >= words.length) {
          clearInterval(interval);
        }

      }, 60);

    }, 900); // loading delay
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const theme = isDark ? "dark" : "light";

  return (
    <aside className={`chat-panel ${theme}`}>

      <div className="chat-header">Chat</div>

      <div className="chat-messages">

        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg}/>
        ))}

        <div ref={chatEndRef} />

      </div>

      <div className="chat-input-row">

        <input
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button className="chat-send-btn" onClick={sendMessage}>
          Send
        </button>

      </div>

    </aside>
  );
}

export default ChatPanel;