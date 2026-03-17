import React from "react";
import "./ChatMessage.css";
import { useTheme } from "../../context/ThemeContext";
import ReactMarkdown from "react-markdown";

function ChatMessage({ message }) {

  const { isDark } = useTheme();
  const isUser = message.role === "user";

  const openFile = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div
      className={`chat-message-row ${isUser ? "user" : "bot"} ${isDark ? "dark" : "light"}`}
    >

      <div className={`chat-bubble ${isUser ? "user" : "bot"}`}>

        {message.loading ? (
          <div className="typing-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <>
            {/* FILES ABOVE MESSAGE */}
            {message.files && message.files.length > 0 && (
              <div style={{ marginBottom: "6px" }}>
                {message.files.map((fileItem, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: "11px",
                      marginBottom: "4px",
                      cursor: "pointer",
                      textDecoration: "underline",
                      opacity: 0.9
                    }}
                    onClick={() => openFile(fileItem.url)}
                  >
                    📄 {fileItem.file.name}
                  </div>
                ))}
              </div>
            )}

            {/* MESSAGE TEXT */}
            <ReactMarkdown>{message.text}</ReactMarkdown>

          </>
        )}

      </div>

    </div>
  );
}

export default ChatMessage;