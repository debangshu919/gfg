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

  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [isMobile,     setIsMobile]     = useState(window.innerWidth <= 492);
  const [graphVisible, setGraphVisible] = useState(false);
  const [graphData,    setGraphData]    = useState(null);

  const [sessions, setSessions] = useState([
    { id: 1, title: "New Chat", messages: [], graphData: null }
  ]);
  const [activeChatId, setActiveChatId] = useState(1);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 492);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpen  = () => isMobile ? setMobileOpen(true)  : setSidebarOpen(true);
  const handleClose = () => isMobile ? setMobileOpen(false) : setSidebarOpen(false);

  const handleNewChat = () => {
    const newId = Date.now();
    setSessions(prev => [
      { id: newId, title: "New Chat", messages: [], graphData: null },
      ...prev
    ]);
    setActiveChatId(newId);
    setGraphVisible(false);
    setGraphData(null);
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    const session = sessions.find(s => s.id === id);
    const restored = session?.graphData || null;
    setGraphData(restored);
    setGraphVisible(!!restored);
  };

  const handleUpdateTitle = (id, title) => {
    setSessions(prev =>
      prev.map(s => s.id === id ? { ...s, title } : s)
    );
  };

  const handleSaveMessages = (id, messages) => {
    setSessions(prev =>
      prev.map(s => s.id === id ? { ...s, messages } : s)
    );
  };

  // ChatPanel always sends { apiResponse: data } — never a raw file
  // so we just check apiResponse exists, no type gating
  const handleGraphRequest = (payload) => {
    if (payload?.apiResponse) {
      setGraphData(payload);
      setGraphVisible(true);
      setSessions(prev =>
        prev.map(s => s.id === activeChatId ? { ...s, graphData: payload } : s)
      );
    }
  };

  return (
    <div className={`app-root ${isDark ? "dark" : "light"}`}>

      <div
        className={`sidebar-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className={`sidebar-wrap ${mobileOpen ? "sidebar-open" : ""}`}>
        <Sidebar
          isOpen={isMobile ? mobileOpen : sidebarOpen}
          onOpen={handleOpen}
          onClose={handleClose}
          sessions={sessions}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
        />
      </div>

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
                key={activeChatId}
                activeChatId={activeChatId}
                initialMessages={sessions.find(s => s.id === activeChatId)?.messages || []}
                onGraphRequest={handleGraphRequest}
                onUpdateTitle={handleUpdateTitle}
                onSaveMessages={handleSaveMessages}
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
        <Route path="/"          element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />}   />
        <Route path="*"          element={<Navigate to="/" replace />} />
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