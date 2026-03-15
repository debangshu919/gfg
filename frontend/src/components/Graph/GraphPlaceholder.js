import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "./GraphPlaceholder.css";
import { useTheme } from "../../context/ThemeContext";

const PALETTES = {
  dark:  ["#818CF8", "#34D399", "#F472B6", "#FBBF24", "#60A5FA", "#A78BFA"],
  light: ["#4F46E5", "#059669", "#DB2777", "#D97706", "#2563EB", "#7C3AED"],
};

function buildTrace(chartType, xData, yData, color) {
  const base = { x: xData, y: yData, name: "" };
  switch (chartType) {
    case "bar":
      return { ...base, type: "bar", marker: { color, opacity: 0.88, line: { color: "transparent" } } };
    case "line":
      return { ...base, type: "scatter", mode: "lines+markers", line: { color, width: 2.5, shape: "spline" }, marker: { color, size: 5, opacity: 0.9 } };
    case "scatter":
      return { ...base, type: "scatter", mode: "markers", marker: { color, size: 8, opacity: 0.75, line: { color: "white", width: 0.5 } } };
    case "pie":
      return { type: "pie", labels: xData, values: yData, hole: 0.38, marker: { colors: PALETTES.dark }, textfont: { size: 11 }, hoverinfo: "label+percent+value" };
    case "histogram":
      return { type: "histogram", x: xData, marker: { color, opacity: 0.85 }, autobinx: true };
    default:
      return { ...base, type: "scatter", mode: "markers", marker: { color } };
  }
}

function buildLayout(xCol, yCol, chartType, isDark) {
  const fg   = isDark ? "#CBD5E1" : "#334155";
  const fg2  = isDark ? "#94A3B8" : "#64748B";
  const grid = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const zero = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";

  const base = {
    autosize: true,
    paper_bgcolor: "transparent",
    plot_bgcolor:  "transparent",
    font: { family: "Inter, system-ui, sans-serif", color: fg2, size: 12 },
    margin: { t: 52, r: 28, b: 60, l: 64 },
    title: {
      text: `<b>${yCol}</b> vs ${xCol}`,
      x: 0.04,
      font: { size: 15, color: fg, family: "Inter, system-ui, sans-serif" },
    },
    hoverlabel: {
      bgcolor:     isDark ? "#1E293B" : "#F8FAFC",
      bordercolor: isDark ? "#475569" : "#CBD5E1",
      font: { color: fg, size: 12 },
    },
    showlegend: false,
  };

  if (chartType === "pie") return base;

  return {
    ...base,
    xaxis: {
      title:     { text: xCol, standoff: 8, font: { size: 12, color: fg2 } },
      gridcolor: grid,
      zerolinecolor: zero,
      tickfont:  { color: fg2 },
      linecolor: grid,
    },
    yaxis: {
      title:     { text: yCol, standoff: 8, font: { size: 12, color: fg2 } },
      gridcolor: grid,
      zerolinecolor: zero,
      tickfont:  { color: fg2 },
      linecolor: grid,
    },
  };
}

function GraphPlaceholder({ graphConfig }) {
  const { isDark } = useTheme();

  const [rows,    setRows]    = useState([]);
  const [columns, setColumns] = useState([]);
  const [xCol,    setXCol]    = useState("");
  const [yCol,    setYCol]    = useState("");
  const [type,    setType]    = useState("scatter");

  useEffect(() => {
    if (!graphConfig?.file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length === 0) return;

      const headers = lines[0].split(",").map(h => h.trim());
      const data = lines.slice(1).map(line => {
        const vals = line.split(",");
        const row  = {};
        headers.forEach((h, i) => { row[h] = vals[i]?.trim() ?? ""; });
        return row;
      });

      setColumns(headers);
      setRows(data);

      const match = (hint) =>
        headers.find(h => h.toLowerCase() === hint?.toLowerCase()) ??
        headers.find(h => h.toLowerCase().includes(hint?.toLowerCase() ?? "")) ??
        hint;

      setXCol(graphConfig.xCol ? match(graphConfig.xCol) : headers[0]);
      setYCol(graphConfig.yCol ? match(graphConfig.yCol) : headers[1] ?? headers[0]);
      setType(graphConfig.chartType ?? "scatter");
    };
    reader.readAsText(graphConfig.file);
  }, [graphConfig]);

  const COLOR = PALETTES[isDark ? "dark" : "light"][0];
  const chartTrace = rows.length ? buildTrace(type, rows.map(r => r[xCol]), rows.map(r => r[yCol]), COLOR) : null;
  const layout     = rows.length ? buildLayout(xCol, yCol, type, isDark) : null;
  const theme      = isDark ? "dark" : "light";

  return (
    <div className={`graph-panel ${theme}`}>

      {!rows.length && (
        <div className="graph-empty">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="6"  y="26" width="8"  height="16" rx="2" fill="currentColor" opacity=".2"/>
            <rect x="20" y="18" width="8"  height="24" rx="2" fill="currentColor" opacity=".35"/>
            <rect x="34" y="10" width="8"  height="32" rx="2" fill="currentColor" opacity=".55"/>
            <line x1="6" y1="44" x2="42" y2="44" stroke="currentColor" strokeWidth="2" opacity=".3" strokeLinecap="round"/>
          </svg>
          <p>Upload a CSV, then ask:<br/><code>revenue vs month and type = bar</code></p>
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="graph-controls">
            <label>
              X
              <select value={xCol} onChange={e => setXCol(e.target.value)}>
                {columns.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              Y
              <select value={yCol} onChange={e => setYCol(e.target.value)}>
                {columns.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              Type
              <select value={type} onChange={e => setType(e.target.value)}>
                {["bar", "line", "scatter", "pie", "histogram"].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </label>
          </div>

          <Plot
            data={[chartTrace]}
            layout={layout}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: "100%", height: "calc(100% - 52px)", minHeight: 300 }}
            useResizeHandler
          />
        </>
      )}
    </div>
  );
}

export default GraphPlaceholder;