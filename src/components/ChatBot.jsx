import React from "react";

function ChatBot() {
  return (
    <div
      style={{
        position: "fixed",
        top: 100,
        right: 40,
        width: 350,
        height: 400,
        background: "white",
        border: "3px solid red",
        zIndex: 9999,
        color: "black",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      }}
    >
      <h2>ChatBot Debug</h2>
      <p>If you see this box, the component is rendering!</p>
    </div>
  );
}

export default ChatBot;