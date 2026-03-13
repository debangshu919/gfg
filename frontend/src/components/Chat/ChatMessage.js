import React from "react";
import "./ChatMessage.css";
import { useTheme } from "../../context/ThemeContext";

function ChatMessage({ message }) {

  const { isDark } = useTheme();
  const isUser = message.role === "user";

  return (
    <div className={`chat-message-row ${isUser ? "user" : "bot"} ${isDark ? "dark" : "light"}`}>

      <div className={`chat-bubble ${isUser ? "user" : "bot"}`}>

        {message.loading ? (
          <div className="typing-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          message.text
        )}

      </div>

    </div>
  );
}

export default ChatMessage;