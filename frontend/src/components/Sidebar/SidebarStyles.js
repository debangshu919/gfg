const sidebarStyles = {
  sidebar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "12px 0",
    borderRight: "1px solid #222",
    background: "#0d0d0d",
    transition: "width 0.25s ease",
    flexShrink: 0,
    overflow: "hidden",
    height: "100vh", // ensure full height
  },

  hamburger: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 16px",
    marginBottom: 8,
  },

  hamburgerLine: {
    display: "block",
    width: 18,
    height: 1.5,
    background: "#888",
    borderRadius: 2,
  },

  newChatBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#1a3a5c",
    border: "none",
    borderRadius: 8,
    color: "#a8d4ff",
    fontSize: 12,
    padding: "8px 14px",
    cursor: "pointer",
    margin: "0 10px 16px 10px",
    width: "calc(100% - 20px)",
    transition: "background 0.15s",
  },

  newChatIconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1a3a5c",
    border: "none",
    borderRadius: 8,
    color: "#a8d4ff",
    width: 36,
    height: 36,
    cursor: "pointer",
    margin: "0 auto 16px auto",
  },

  historySection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    overflowY: "auto",
    flex: 1,
    scrollbarWidth: "thin",
    scrollbarColor: "#222 transparent",
  },

  historyLabel: {
    fontSize: 10,
    color: "#444",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "4px 16px 8px 16px",
  },

  historyItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    color: "#666",
    fontSize: 12,
    padding: "7px 16px",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    borderRadius: 6,
    transition: "background 0.15s, color 0.15s",
  },

  historyText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 160,
  },

  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "1px solid #222",
    color: "#666",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",

    marginTop: "auto", // 🔥 forces bottom placement
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 4,

    width: "calc(100% - 20px)",
    transition: "border-color 0.15s",
  },

  profileLabel: {
    fontSize: 12,
    color: "#555",
  },
};

export default sidebarStyles;