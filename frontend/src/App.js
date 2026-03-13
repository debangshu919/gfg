import React, { useState } from "react";
import "./App.css";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import GraphPlaceholder from "./components/Graph/GraphPlaceholder";
import ChatPanel from "./components/Chat/ChatPanel";

function AppInner() {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobileScreen = () =>
    window.innerWidth <= 492 ||
    (window.innerWidth <= 430 && window.innerHeight >= 800);

  const handleOpen  = () => isMobileScreen() ? setMobileOpen(true)  : setSidebarOpen(true);
  const handleClose = () => isMobileScreen() ? setMobileOpen(false) : setSidebarOpen(false);

  return (
    <div className={`app-root ${isDark ? "dark" : "light"}`}>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar-wrap ${mobileOpen ? "sidebar-open" : ""}`}>
        <Sidebar
          isOpen={isMobileScreen() ? true : sidebarOpen}
          onOpen={handleOpen}
          onClose={handleClose}
        />
      </div>

      {/* Main */}
      <div className="main-area">

        <div className="center-col">
          <Header sidebarOpen={sidebarOpen} onOpenSidebar={handleOpen} />
          <div className="graph-wrap">
            <GraphPlaceholder />
          </div>
        </div>

        <div className="chat-wrap">
          <ChatPanel />
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
