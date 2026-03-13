import React from "react";
 import sidebarStyles from "./SidebarStyles";

const chatHistory = [
  { id: 1, title: "Graph Analysis Q3" },
  { id: 2, title: "Monthly Revenue Trends" },
  { id: 3, title: "User Retention Data" },
  { id: 4, title: "Sales Funnel Report" },
  { id: 5, title: "Dashboard Overview" },
  {id : 6, title: "Customer Feedback Analysis" },
  {id : 7, title: "Product Performance Metrics" },
];

function Sidebar({ isOpen, onClose, onOpen }) {
  return (
    <aside style={{ ...sidebarStyles.sidebar, width: isOpen ? 240 : 60 }}>

      {/* Hamburger */}
      <button style={sidebarStyles.hamburger} onClick={isOpen ? onClose : onOpen} title="Toggle menu">
        <span style={sidebarStyles.hamburgerLine} />
        <span style={sidebarStyles.hamburgerLine} />
        <span style={sidebarStyles.hamburgerLine} />
      </button>

      {/* New Chat Button */}
      {isOpen ? (
        <button style={sidebarStyles.newChatBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      ) : (
        <button style={sidebarStyles.newChatIconBtn} title="New Chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* History */}
      {isOpen && (
        <div style={sidebarStyles.historySection}>
          <div style={sidebarStyles.historyLabel}>Recent</div>
          {chatHistory.map((chat) => (
            <button key={chat.id} style={sidebarStyles.historyItem}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span style={sidebarStyles.historyText}>{chat.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Profile */}
      <button style={sidebarStyles.profileBtn} title="Profile">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        {isOpen && <span style={sidebarStyles.profileLabel}>Profile</span>}
      </button>

    </aside>
  );
}

export default Sidebar;