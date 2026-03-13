import React from "react";
import headerStyles from "./HeaderStyle.js";
const WINDOW_DOTS = ["#ff5f57", "#febc2e", "#28c840"];

function Header({ sidebarOpen, onOpenSidebar }) {
  return (
    <header style={headerStyles.header}>
      {!sidebarOpen && (
        <button style={headerStyles.hamburgerSmall} onClick={onOpenSidebar} title="Open menu">
          <span style={headerStyles.hamburgerLine} />
          <span style={headerStyles.hamburgerLine} />
          <span style={headerStyles.hamburgerLine} />
        </button>
      )}

      <span style={headerStyles.title}>Dashboard</span>

      <div style={headerStyles.dots}>
        {WINDOW_DOTS.map((color, i) => (
          <span key={i} style={{ ...headerStyles.dot, background: color }} />
        ))}
      </div>
    </header>
  );
}

export default Header;