import React from "react";
import "./Header.css";
import { useTheme } from "../../context/ThemeContext";

const DOTS = ["#ff5f57", "#febc2e", "#28c840"];

function Header({ sidebarOpen, onOpenSidebar }) {
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? "dark" : "light";

  return (
    <header className={`header ${theme}`}>

      {/* Mobile Hamburger */}
      <button
        className="header-hamburger"
        onClick={onOpenSidebar}
        title="Open menu"
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className="header-hamburger-line" />
        ))}
      </button>

      {/* Title */}
      <span className="header-title">Dashboard</span>

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
          <span
            key={i}
            className="header-dot"
            style={{ background: color }}
          />
        ))}
      </div>

    </header>
  );
}

export default Header;