import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar.js";
import Header from "./components/Header/Header";
import GraphPlaceholder from "./components/Graph/GraphPlaceholder";
import ChatPanel from "./components/Chat/ChatPanel";
import globalStyles from "./styles/globalStyles";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={globalStyles.root}>
      {/* Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onOpen={() => setSidebarOpen(true)} />
      {/* Center: Header + Graph */}
      <div style={styles.main}>
        <Header sidebarOpen={sidebarOpen} onOpenSidebar={() => setSidebarOpen(true)} />
        <GraphPlaceholder />
      </div>

      {/* Right: Chat */}
      <ChatPanel />
    </div>
  );
}

const styles = {
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 12,
    gap: 10,
    minWidth: 0,
  },
};

export default App;