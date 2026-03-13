import React from "react";
import chatStyles from "./chatStyles";

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div style={isUser ? chatStyles.msgUser : chatStyles.msgBot}>
      <div style={isUser ? chatStyles.bubbleUser : chatStyles.bubbleBot}>
        {message.text}
      </div>
    </div>
  );
}

export default ChatMessage;