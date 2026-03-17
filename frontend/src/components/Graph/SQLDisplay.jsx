import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import "./SQLDisplay.css";

const SQLDisplay = ({ sqlQuery, isDark }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('sql-expanded');
    if (saved === 'true') {
      setIsExpanded(true);
    }
  }, []);

  // Save preference when changed
  useEffect(() => {
    localStorage.setItem('sql-expanded', isExpanded);
  }, [isExpanded]);

  if (!sqlQuery) return null;

  // SQL syntax highlighting function (simplified - just return as-is)
  const highlightSQL = (sql) => {
    return sql;
  };

  // Generate simple explanation
  const generateExplanation = () => {
    const query = sqlQuery.toLowerCase();
    let explanation = "This query ";

    if (query.includes('select')) {
      explanation += "retrieves data ";
      
      if (query.includes('count(')) {
        explanation += "and counts records ";
      } else if (query.includes('sum(')) {
        explanation += "and calculates sums ";
      } else if (query.includes('avg(')) {
        explanation += "and calculates averages ";
      }
      
      if (query.includes('group by')) {
        explanation += "grouped by categories ";
      }
      
      if (query.includes('where')) {
        explanation += "with specific conditions ";
      }
      
      if (query.includes('order by')) {
        explanation += "sorted in a specific order ";
      }
    }

    if (query.includes('join')) {
      explanation += "by combining multiple tables ";
    }

    explanation += "from the database.";

    return explanation;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlQuery);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sql-display ${isDark ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="sql-header" onClick={toggleExpanded}>
        <div className="sql-header-left">
          <motion.div 
            className="sql-icon"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
          <span className="sql-title">SQL Query</span>
          <span className="sql-badge">Generated</span>
        </div>
        <div className="sql-header-right">
          <button
            className="sql-copy-btn"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
            title="Copy SQL"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              {copied ? (
                <path d="M11.5 4.5L5.5 10.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <>
                  <rect x="3" y="5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1"/>
                  <rect x="5" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1"/>
                </>
              )}
            </svg>
            <span className="copy-text">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="sql-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="sql-content-inner">
              {/* SQL Code */}
              <div className="sql-code-container">
                <pre className="sql-code">
                  {sqlQuery}
                </pre>
              </div>

              {/* Explanation Toggle */}
              <div className="sql-explanation-section">
                <button
                  className="sql-explanation-toggle"
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  <svg 
                    width="12" height="12" 
                    viewBox="0 0 12 12" 
                    fill="none"
                    style={{ 
                      transform: showExplanation ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>What does this query do?</span>
                </button>
                
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      className="sql-explanation"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="explanation-content">
                        {generateExplanation()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SQLDisplay;
