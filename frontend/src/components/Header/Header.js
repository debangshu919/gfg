import React from "react";
import "./Header.css";
import { useTheme } from "../../context/ThemeContext";

const DOTS = ["#ff5f57", "#febc2e", "#28c840"];

function Header({ sidebarOpen, onOpenSidebar, graphVisible, onDownload }) {
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? "dark" : "light";

  return (
    <header className={`header ${theme} ${!graphVisible ? "header-no-graph" : ""}`}>

      {/* Mobile Hamburger */}
      <button className="header-hamburger" onClick={onOpenSidebar} title="Open menu">
        {[0, 1, 2].map((i) => (
          <span key={i} className="header-hamburger-line" />
        ))}
      </button>

      {/* Title */}
      <span className="header-title">Dashboard</span>

      {/* Download Button — only shows when graph is visible */}
      {graphVisible && onDownload && (
        <button
          onClick={onDownload}
          title="Download Report"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "1px solid #1e3a5c",
            borderRadius: 8,
            color: "#3b82f6",
            fontSize: 12,
            padding: "5px 12px",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#1a3a5c"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Report
        </button>
      )}

      {/* Theme Toggle */}
      <button
        className="header-theme-toggle"
        onClick={toggleTheme}
        title={isDark ? "Switch to light" : "Switch to dark"}
      >
        <div className="theme-toggle-track">
          <div className="theme-toggle-knob" />
        </div>
        <span className="theme-toggle-emoji">
          {isDark ? "🌙" : "☀️"}
        </span>
      </button>

      {/* Window dots */}
      <div className="header-dots">
        {DOTS.map((color, i) => (
          <span key={i} className="header-dot" style={{ background: color }} />
        ))}
      </div>

    </header>
  );
}

export default Header;