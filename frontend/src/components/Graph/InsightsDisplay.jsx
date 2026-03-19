import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SQLDisplay.css";

const InsightsDisplay = ({ insights, isDark }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("insight-expanded");
    if (saved === "true") setIsExpanded(true);
    if (saved === "false") setIsExpanded(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("insight-expanded", isExpanded);
  }, [isExpanded]);

  if (!insights) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(insights));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`sql-display ${isDark ? "dark" : "light"}`}>
      <div className="sql-header" onClick={() => setIsExpanded(v => !v)}>
        <div className="sql-header-left">
          <motion.div
            className="sql-icon"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <span className="sql-title">Insights</span>
          <span className="sql-badge">AI</span>
        </div>

        <div className="sql-header-right">
          <button
            className="sql-copy-btn"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
            title="Copy insights"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              {copied ? (
                <path d="M11.5 4.5L5.5 10.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <>
                  <rect x="3" y="5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
                  <rect x="5" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
                </>
              )}
            </svg>
            <span className="copy-text">{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="sql-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="sql-content-inner">
              <div className="insight-container">
                <div className="insight-text">{String(insights)}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InsightsDisplay;
