import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import ChartRenderer from "./components/Graph/ChartRenderer";
import ChatPanel from "./components/Chat/ChatPanel";
import LandingPage from "./components/landing/LandingPage";

function Dashboard() {
  const { isDark } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 492);

  const [graphVisible, setGraphVisible] = useState(false);

  /* GRAPH DATA STATE */
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 492);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpen = () =>
    isMobile ? setMobileOpen(true) : setSidebarOpen(true);

  const handleClose = () =>
    isMobile ? setMobileOpen(false) : setSidebarOpen(false);

  /* receive CSV from chat */
  const handleGraphRequest = (payload) => {
    setGraphData(payload);
    setGraphVisible(true);
  };

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
          isOpen={isMobile ? mobileOpen : sidebarOpen}
          onOpen={handleOpen}
          onClose={handleClose}
        />
      </div>

      {/* Main Layout */}
      <div className="main-area">
        <div className="center-col">
          <Header
            sidebarOpen={isMobile ? mobileOpen : sidebarOpen}
            onOpenSidebar={handleOpen}
            graphVisible={graphVisible}
          />

          <div className={`content-area ${graphVisible ? "" : "no-graph"}`}>
            <div className={`graph-wrap ${graphVisible ? "" : "graph-hidden"}`}>
              <ChartRenderer graphData={graphData} />
            </div>

            <div className={`chat-wrap ${graphVisible ? "" : "chat-expanded"}`}>
              <ChatPanel
                onFirstMessage={() => setGraphVisible(true)}
                onGraphRequest={handleGraphRequest}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  
  // Set global body class for dark mode on body based on context
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;