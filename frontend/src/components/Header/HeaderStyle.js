const headerStyles = {
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#111",
    border: "1px solid #222",
    borderRadius: 8,
    padding: "10px 16px",
    flexShrink: 0,
  },
  hamburgerSmall: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 8px",
  },
  hamburgerLine: {
    display: "block",
    width: 18,
    height: 1.5,
    background: "#888",
    borderRadius: 2,
  },
  title: {
    flex: 1,
    fontSize: 13,
    color: "#888",
    letterSpacing: "0.08em",
  },
  dots: {
    display: "flex",
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
};

export default headerStyles;