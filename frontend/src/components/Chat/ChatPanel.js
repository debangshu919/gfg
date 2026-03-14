import React, { useState, useRef, useEffect } from "react";
import "./ChatPanel.css";
import ChatMessage from "./ChatMessage";
import { useTheme } from "../../context/ThemeContext";
import dummyResponses from "../../data/dummyResponses";

const initialMessages = [
  { id: 1, role: "assistant", loading: true }
];

function ChatPanel({ onFirstMessage }) {

  const { isDark } = useTheme();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  /* auto scroll */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* initial greeting animation */
  useEffect(() => {

    const greeting =
      "Hello! I'm your data assistant. Ask me anything about the graph.";

    const words = greeting.split(" ");
    let index = 0;

    setTimeout(() => {

      const interval = setInterval(() => {

        index++;

        setMessages(prev =>
          prev.map(m =>
            m.id === 1
              ? {
                  ...m,
                  loading: false,
                  text: words.slice(0, index).join(" ")
                }
              : m
          )
        );

        if (index >= words.length) clearInterval(interval);

      }, 60);

    }, 900);

  }, []);

  /* send message */
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

    /* loading animation */
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

        if (index >= words.length) clearInterval(interval);

      }, 60);

    }, 900);

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  /* file upload */
  const handleUpload = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const fileMsg = {
      id: Date.now(),
      role: "user",
      text: `📎 ${file.name}`
    };

    setMessages(prev => [...prev, fileMsg]);

    const loadingId = Date.now() + 1;

    setMessages(prev => [
      ...prev,
      { id: loadingId, role: "assistant", loading: true }
    ]);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingId
            ? {
                ...m,
                loading: false,
                text: `File "${file.name}" uploaded successfully.`
              }
            : m
        )
      );
    }, 900);

    e.target.value = "";
  };

  const theme = isDark ? "dark" : "light";

  return (
    <aside className={`chat-panel ${theme}`}>

      <div className="chat-header">Chat</div>

      <div className="chat-messages">

        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        <div ref={chatEndRef} />

      </div>

      <div className="chat-input-row">

        {/* Upload button */}
        <label className="chat-plus-btn" title="Upload file">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>

          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </label>

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