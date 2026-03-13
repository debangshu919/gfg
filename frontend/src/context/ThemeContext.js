import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const v = localStorage.getItem("isDark");
      return v ? JSON.parse(v) : true;
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("isDark", JSON.stringify(isDark));
    } catch (e) {
      // ignore
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((s) => !s);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default ThemeContext;
