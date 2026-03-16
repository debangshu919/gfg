import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./GraphPlaceholder.css";
import { useTheme } from "../../context/ThemeContext";

const PALETTE = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316"];

const fmt = (v) => {
  const n = Number(v);
  if (isNaN(n)) return v;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n % 1 === 0 ? n.toLocaleString() : n.toFixed(2);
};

/* ─── BAR CHART ─────────────────────────────────────────── */
const BarChart = ({ data, xKey, yKey, isDark }) => {
  const W = 800, H = 400;
  const PAD = { top: 30, right: 30, bottom: 80, left: 70 };
  const pw = W - PAD.left - PAD.right;
  const ph = H - PAD.top - PAD.bottom;

  const vals = data.map(d => Number(d[yKey]) || 0);
  const max = Math.max(...vals) || 1;
  const step = pw / data.length;
  const barW = Math.min(52, step * 0.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETTE[0]} stopOpacity="1" />
          <stop offset="100%" stopColor={PALETTE[0]} stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {Array.from({ length: 6 }).map((_, i) => {
        const y = PAD.top + ph * (i / 5);
        const val = max * (1 - i / 5);
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={PAD.left + pw} y2={y}
              stroke={isDark ? "#1e1e1e" : "#f0f0f0"} strokeWidth="1" />
            <text x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle"
              fill={isDark ? "#444" : "#bbb"} fontSize="11"
              fontFamily="'JetBrains Mono', monospace">{fmt(val)}</text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const val = Number(d[yKey]) || 0;
        const bh = (val / max) * ph;
        const bx = PAD.left + i * step + (step - barW) / 2;
        const by = PAD.top + ph - bh;
        return (
          <g key={i} className="bar-group">
            <rect x={PAD.left + i * step} y={PAD.top} width={step} height={ph}
              fill="transparent" className="bar-hover-bg" />
            <motion.rect x={bx} width={barW} rx={4}
              fill="url(#bar-grad)" filter="url(#glow)"
              initial={{ height: 0, y: PAD.top + ph }}
              animate={{ height: bh, y: by }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: [0.34, 1.2, 0.64, 1] }} />
            <text
              x={PAD.left + i * step + step / 2}
              y={PAD.top + ph + 16}
              textAnchor="middle"
              fill={isDark ? "#444" : "#bbb"}
              fontSize="11"
              fontFamily="'JetBrains Mono', monospace"
              transform={`rotate(-40 ${PAD.left + i * step + step / 2},${PAD.top + ph + 16})`}>
              {String(d[xKey]).length > 10 ? String(d[xKey]).slice(0, 10) + "…" : d[xKey]}
            </text>
          </g>
        );
      })}

      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top + ph} x2={PAD.left + pw} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
    </svg>
  );
};

/* ─── LINE CHART ─────────────────────────────────────────── */
const LineChart = ({ data, xKey, yKey, isDark }) => {
  const W = 800, H = 400;
  const PAD = { top: 30, right: 30, bottom: 80, left: 70 };
  const pw = W - PAD.left - PAD.right;
  const ph = H - PAD.top - PAD.bottom;

  const vals = data.map(d => Number(d[yKey]) || 0);
  const max = Math.max(...vals) || 1;
  const min = Math.min(...vals);
  const range = (max - min) || 1;

  const pts = data.map((d, i) => [
    PAD.left + (i / (data.length - 1 || 1)) * pw,
    PAD.top + (1 - (Number(d[yKey]) - min) / range) * ph
  ]);

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const areaPath = linePath + ` L${pts[pts.length - 1][0]},${PAD.top + ph} L${PAD.left},${PAD.top + ph} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETTE[0]} stopOpacity="0.25" />
          <stop offset="100%" stopColor={PALETTE[0]} stopOpacity="0" />
        </linearGradient>
        <filter id="glow-line">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {Array.from({ length: 6 }).map((_, i) => {
        const y = PAD.top + ph * (i / 5);
        const val = max - (range * i) / 5;
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={PAD.left + pw} y2={y}
              stroke={isDark ? "#1e1e1e" : "#f0f0f0"} strokeWidth="1" />
            <text x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle"
              fill={isDark ? "#444" : "#bbb"} fontSize="11"
              fontFamily="'JetBrains Mono', monospace">{fmt(val)}</text>
          </g>
        );
      })}

      <motion.path d={areaPath} fill="url(#area-grad)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }} />
      <motion.path d={linePath} fill="none"
        stroke={PALETTE[0]} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        filter="url(#glow-line)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }} />

      {pts.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={4}
          fill={PALETTE[0]} stroke={isDark ? "#111" : "#fff"} strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.1 + i * 0.03, duration: 0.3 }}
          className="dot" />
      ))}

      {data.map((d, i) => (
        <text key={i}
          x={PAD.left + (i / (data.length - 1 || 1)) * pw}
          y={PAD.top + ph + 16}
          textAnchor="middle"
          fill={isDark ? "#444" : "#bbb"}
          fontSize="11"
          fontFamily="'JetBrains Mono', monospace"
          transform={`rotate(-40 ${PAD.left + (i / (data.length - 1 || 1)) * pw},${PAD.top + ph + 16})`}>
          {String(d[xKey]).length > 10 ? String(d[xKey]).slice(0, 10) + "…" : d[xKey]}
        </text>
      ))}

      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top + ph} x2={PAD.left + pw} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
    </svg>
  );
};

/* ─── PIE CHART ─────────────────────────────────────────── */
const PieChart = ({ data, xKey, yKey, isDark }) => {
  const [hovered, setHovered] = useState(null);
  const W = 500, H = 400, cx = 200, cy = H / 2, r = 140;

  const vals = data.map(d => Number(d[yKey]) || 0);
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  let angle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const pct = vals[i] / total;
    const sweep = pct * Math.PI * 2;
    const start = angle, end = angle + sweep;
    angle = end;
    const mid = start + sweep / 2;
    const x1 = cx + Math.cos(start) * r, y1 = cy + Math.sin(start) * r;
    const x2 = cx + Math.cos(end) * r,   y2 = cy + Math.sin(end) * r;
    return {
      path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2},${y2} Z`,
      lx: cx + Math.cos(mid) * (r * 0.65),
      ly: cy + Math.sin(mid) * (r * 0.65),
      color: PALETTE[i % PALETTE.length],
      label: d[xKey],
      pct
    };
  });

  return (
    <div className="pie-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
        {slices.map((s, i) => (
          <motion.path key={i} d={s.path} fill={s.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: hovered === null || hovered === i ? 1 : 0.35 }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: [0.34, 1.2, 0.64, 1] }}
            style={{ transformOrigin: `${cx}px ${cy}px`, cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)} />
        ))}
        {slices.map((s, i) => s.pct > 0.05 && (
          <motion.text key={i} x={s.lx} y={s.ly}
            textAnchor="middle" dominantBaseline="middle"
            fill="#fff" fontSize="12" fontWeight="bold"
            fontFamily="'JetBrains Mono', monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.07 }}>
            {`${(s.pct * 100).toFixed(0)}%`}
          </motion.text>
        ))}
      </svg>

      <div className="pie-legend">
        {slices.map((s, i) => (
          <motion.div key={i} className="legend-item"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            style={{ opacity: hovered === null || hovered === i ? 1 : 0.35 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>
            <span className="legend-dot" style={{ background: s.color }} />
            <span className="legend-label">{s.label}</span>
            <span className="legend-pct">{(s.pct * 100).toFixed(1)}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─── SCATTER CHART ──────────────────────────────────────── */
const ScatterChart = ({ data, xKey, yKey, isDark }) => {
  const W = 800, H = 400;
  const PAD = { top: 30, right: 30, bottom: 60, left: 70 };
  const pw = W - PAD.left - PAD.right;
  const ph = H - PAD.top - PAD.bottom;

  const xVals = data.map(d => Number(d[xKey]) || 0);
  const yVals = data.map(d => Number(d[yKey]) || 0);
  const xMin = Math.min(...xVals), xMax = Math.max(...xVals) || 1;
  const yMin = Math.min(...yVals), yMax = Math.max(...yVals) || 1;

  const px = v => PAD.left + ((v - xMin) / (xMax - xMin || 1)) * pw;
  const py = v => PAD.top + (1 - (v - yMin) / (yMax - yMin || 1)) * ph;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glow-dot">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {[0, 1, 2, 3, 4].map(i => {
        const y = PAD.top + ph * i / 4;
        const x = PAD.left + pw * i / 4;
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={PAD.left + pw} y2={y}
              stroke={isDark ? "#1e1e1e" : "#f0f0f0"} strokeWidth="1" />
            <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + ph}
              stroke={isDark ? "#1e1e1e" : "#f0f0f0"} strokeWidth="1" />
          </g>
        );
      })}

      {data.map((d, i) => (
        <motion.circle key={i}
          cx={px(xVals[i])} cy={py(yVals[i])} r={7}
          fill={PALETTE[i % PALETTE.length]}
          fillOpacity={0.8}
          filter="url(#glow-dot)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.03, duration: 0.4, ease: "backOut" }}
          style={{ transformOrigin: `${px(xVals[i])}px ${py(yVals[i])}px`, cursor: "pointer" }}
          className="dot" />
      ))}

      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top + ph} x2={PAD.left + pw} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
    </svg>
  );
};

/* ─── HISTOGRAM ──────────────────────────────────────────── */
const HistogramChart = ({ data, xKey, isDark, bins = 10 }) => {
  const W = 800, H = 400;
  const PAD = { top: 30, right: 30, bottom: 80, left: 70 };
  const pw = W - PAD.left - PAD.right;
  const ph = H - PAD.top - PAD.bottom;

  const vals = data.map(d => Number(d[xKey])).filter(v => !isNaN(v));
  if (!vals.length) return null;

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const binSize = (max - min) / bins || 1;

  const buckets = Array.from({ length: bins }, (_, i) => ({
    x0: min + i * binSize,
    x1: min + (i + 1) * binSize,
    count: 0
  }));

  vals.forEach(v => {
    const idx = Math.min(Math.floor((v - min) / binSize), bins - 1);
    buckets[idx].count++;
  });

  const maxCount = Math.max(...buckets.map(b => b.count)) || 1;
  const barW = pw / bins;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="hist-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PALETTE[2]} stopOpacity="1" />
          <stop offset="100%" stopColor={PALETTE[2]} stopOpacity="0.35" />
        </linearGradient>
        <filter id="hist-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {Array.from({ length: 6 }).map((_, i) => {
        const y = PAD.top + ph * (i / 5);
        const val = Math.round(maxCount * (1 - i / 5));
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={PAD.left + pw} y2={y}
              stroke={isDark ? "#1e1e1e" : "#f0f0f0"} strokeWidth="1" />
            <text x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle"
              fill={isDark ? "#444" : "#bbb"} fontSize="11"
              fontFamily="'JetBrains Mono', monospace">{val}</text>
          </g>
        );
      })}

      {buckets.map((b, i) => {
        const bh = (b.count / maxCount) * ph;
        const bx = PAD.left + i * barW;
        const by = PAD.top + ph - bh;
        return (
          <g key={i} className="bar-group">
            <rect x={bx} y={PAD.top} width={barW} height={ph}
              fill="transparent" className="bar-hover-bg" />
            <motion.rect
              x={bx + 1} width={barW - 2} rx={3}
              fill="url(#hist-grad)" filter="url(#hist-glow)"
              initial={{ height: 0, y: PAD.top + ph }}
              animate={{ height: bh, y: by }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: [0.34, 1.2, 0.64, 1] }} />
            {b.count > 0 && (
              <motion.text
                x={bx + barW / 2} y={by - 6}
                textAnchor="middle"
                fill={isDark ? "#555" : "#aaa"}
                fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.04 }}>
                {b.count}
              </motion.text>
            )}
            <text
              x={bx + barW / 2}
              y={PAD.top + ph + 16}
              textAnchor="middle"
              fill={isDark ? "#444" : "#bbb"}
              fontSize="10"
              fontFamily="'JetBrains Mono', monospace"
              transform={`rotate(-40 ${bx + barW / 2},${PAD.top + ph + 16})`}>
              {fmt(b.x0)}
            </text>
          </g>
        );
      })}

      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top + ph} x2={PAD.left + pw} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />

      <text x={14} y={PAD.top + ph / 2}
        textAnchor="middle" dominantBaseline="middle"
        fill={isDark ? "#333" : "#ccc"} fontSize="11"
        fontFamily="'JetBrains Mono', monospace"
        transform={`rotate(-90 14,${PAD.top + ph / 2})`}>
        frequency
      </text>
    </svg>
  );
};

/* ─── EMPTY STATE ────────────────────────────────────────── */
const EmptyState = ({ isDark }) => (
  <motion.div className="empty-state"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}>
    <motion.div className="empty-icon"
      animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4"  y="28" width="8" height="16" rx="2" fill={PALETTE[0]} opacity="0.3" />
        <rect x="16" y="18" width="8" height="26" rx="2" fill={PALETTE[0]} opacity="0.5" />
        <rect x="28" y="8"  width="8" height="36" rx="2" fill={PALETTE[0]} opacity="0.7" />
        <rect x="40" y="20" width="8" height="24" rx="2" fill={PALETTE[0]} opacity="0.9" />
      </svg>
    </motion.div>
    <p className="empty-text">Upload a CSV or ask the agent to generate a chart</p>
  </motion.div>
);

/* ─── CONTROLS ───────────────────────────────────────────── */
const Controls = ({ columns, xCol, yCol, chartType, setXCol, setYCol, setChartType, isDark }) => (
  <motion.div className="chart-controls"
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}>

    <div className="control-group">
      <label className="ctrl-label">X</label>
      <select className={`ctrl-select ${isDark ? "dark" : "light"}`}
        value={xCol} onChange={e => setXCol(e.target.value)}>
        {columns.map(c => <option key={c}>{c}</option>)}
      </select>
    </div>

    {chartType !== "histogram" && (
      <div className="control-group">
        <label className="ctrl-label">Y</label>
        <select className={`ctrl-select ${isDark ? "dark" : "light"}`}
          value={yCol} onChange={e => setYCol(e.target.value)}>
          {columns.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
    )}

    <div className="control-group">
      <label className="ctrl-label">TYPE</label>
      <select className={`ctrl-select ${isDark ? "dark" : "light"}`}
        value={chartType} onChange={e => setChartType(e.target.value)}>
        {["bar", "line", "scatter", "pie", "histogram"].map(t => (
          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
        ))}
      </select>
    </div>

  </motion.div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
function GraphPlaceholder({ graphData }) {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    if (!graphData || !graphData.file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (!lines.length) return;
      const headers = lines[0].split(",").map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const values = line.split(",");
        const row = {};
        headers.forEach((h, i) => { row[h] = values[i]?.trim(); });
        return row;
      });
      setData(rows);
      setColumns(headers);
      if (headers.length >= 2) { setXCol(headers[0]); setYCol(headers[1]); }
      setChartKey(k => k + 1);
    };
    reader.readAsText(graphData.file);
  }, [graphData]);

  useEffect(() => { setChartKey(k => k + 1); }, [chartType, xCol, yCol]);

  const renderChart = () => {
    const props = { data, xKey: xCol, yKey: yCol, isDark };
    switch (chartType) {
      case "bar":       return <BarChart       {...props} />;
      case "line":      return <LineChart      {...props} />;
      case "scatter":   return <ScatterChart   {...props} />;
      case "pie":       return <PieChart       {...props} />;
      case "histogram": return <HistogramChart data={data} xKey={xCol} isDark={isDark} bins={10} />;
      default:          return <BarChart       {...props} />;
    }
  };

  return (
    <div className={`graph-panel ${isDark ? "dark" : "light"}`}>
      {!data.length ? (
        <EmptyState isDark={isDark} />
      ) : (
        <>
          <Controls
            columns={columns} xCol={xCol} yCol={yCol} chartType={chartType}
            setXCol={setXCol} setYCol={setYCol} setChartType={setChartType}
            isDark={isDark} />
          <div className="chart-area">
            <AnimatePresence mode="wait">
              <motion.div key={chartKey} className="chart-motion-wrap"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}>
                {renderChart()}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}

export default GraphPlaceholder;