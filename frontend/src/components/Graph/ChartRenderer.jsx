import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import SQLDisplay from "./SQLDisplay";
import InsightsDisplay from "./InsightsDisplay";
import "./GraphPlaceholder.css";

const PALETTE = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316"];

const fmt = (v) => {
  const n = Number(v);
  if (isNaN(n)) return v;
  if (n >= 1e9) return `${(n/1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n/1e3).toFixed(0)}K`;
  return n % 1 === 0 ? n.toLocaleString() : n.toFixed(2);
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const ChartTooltip = ({ tooltip, isDark }) => {
  if (!tooltip?.visible) return null;

  return (
    <div
      className={`chart-tooltip ${isDark ? "dark" : "light"}`}
      style={{ left: tooltip.x, top: tooltip.y }}
      role="status"
      aria-live="polite"
    >
      <div className="chart-tooltip-title">{tooltip.title}</div>
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-k">value</span>
        <span className="chart-tooltip-v">{tooltip.value}</span>
      </div>
      {typeof tooltip.percent === "number" && (
        <div className="chart-tooltip-row">
          <span className="chart-tooltip-k">percent</span>
          <span className="chart-tooltip-v">{(tooltip.percent * 100).toFixed(2)}%</span>
        </div>
      )}
    </div>
  );
};

const AxisLabels = ({ W, H, PAD, pw, ph, xLabel, yLabel, isDark }) => (
  <>
    <text x={PAD.left + pw / 2} y={H - 4}
      textAnchor="middle"
      fill={isDark ? "#555" : "#999"} fontSize="11" fontWeight="600"
      fontFamily="'JetBrains Mono', monospace" letterSpacing="0.08em">
      {xLabel}
    </text>
    <text x={12} y={PAD.top + ph / 2}
      textAnchor="middle" dominantBaseline="middle"
      fill={isDark ? "#555" : "#999"} fontSize="11" fontWeight="600"
      fontFamily="'JetBrains Mono', monospace" letterSpacing="0.08em"
      transform={`rotate(-90 12,${PAD.top + ph / 2})`}>
      {yLabel}
    </text>
  </>
);

const BarChart = ({ data, x_axis, y_axis, isDark, onHover, onLeave }) => {
  const W = 800, H = 420;
  const PAD = { top: 30, right: 30, bottom: 100, left: 80 };
  const pw = W - PAD.left - PAD.right;
  const ph = H - PAD.top - PAD.bottom;
  const vals = data.map(d => Number(d[y_axis]) || 0);
  const max = Math.max(...vals) || 1;
  const step = pw / data.length;
  const barW = Math.min(52, step * 0.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="cr-bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={PALETTE[0]} stopOpacity="1" />
          <stop offset="100%" stopColor={PALETTE[0]} stopOpacity="0.35" />
        </linearGradient>
        <filter id="cr-glow">
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
        const val = Number(d[y_axis]) || 0;
        const bh = (val / max) * ph;
        const bx = PAD.left + i * step + (step - barW) / 2;
        const by = PAD.top + ph - bh;
        return (
          <g key={i} className="bar-group">
            <rect x={PAD.left + i * step} y={PAD.top} width={step} height={ph}
              fill="transparent" className="bar-hover-bg"
              onMouseMove={(e) => onHover?.(e, {
                title: String(d[x_axis] ?? ""),
                value: fmt(val)
              })}
              onMouseLeave={() => onLeave?.()} />
            <motion.rect x={bx} width={barW} rx={4}
              fill="url(#cr-bar-grad)" filter="url(#cr-glow)"
              initial={{ height: 0, y: PAD.top + ph }}
              animate={{ height: bh, y: by }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: [0.34, 1.2, 0.64, 1] }} />
            <text
              x={PAD.left + i * step + step / 2} y={PAD.top + ph + 16}
              textAnchor="middle"
              fill={isDark ? "#444" : "#bbb"} fontSize="11"
              fontFamily="'JetBrains Mono', monospace"
              transform={`rotate(-40 ${PAD.left + i * step + step / 2},${PAD.top + ph + 16})`}>
              {String(d[x_axis] ?? "").length > 10 ? String(d[x_axis]).slice(0,10) + "…" : d[x_axis]}
            </text>
          </g>
        );
      })}

      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top + ph} x2={PAD.left + pw} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
      <AxisLabels W={W} H={H} PAD={PAD} pw={pw} ph={ph}
        xLabel={x_axis} yLabel={y_axis} isDark={isDark} />
    </svg>
  );
};

const LineChart = ({ data, x_axis, y_axis, isDark, onHover, onLeave }) => {
  const W = 800, H = 420;
  const PAD = { top: 30, right: 30, bottom: 100, left: 80 };
  const pw = W - PAD.left - PAD.right;
  const ph = H - PAD.top - PAD.bottom;
  const vals = data.map(d => Number(d[y_axis]) || 0);
  const max = Math.max(...vals) || 1;
  const min = Math.min(...vals);
  const range = (max - min) || 1;

  const pts = data.map((d, i) => [
    PAD.left + (i / (data.length - 1 || 1)) * pw,
    PAD.top + (1 - (Number(d[y_axis]) - min) / range) * ph
  ]);

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const areaPath = linePath + ` L${pts[pts.length-1][0]},${PAD.top+ph} L${PAD.left},${PAD.top+ph} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="cr-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={PALETTE[0]} stopOpacity="0.2" />
          <stop offset="100%" stopColor={PALETTE[0]} stopOpacity="0" />
        </linearGradient>
        <filter id="cr-line-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
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

      <motion.path d={areaPath} fill="url(#cr-area)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }} />
      <motion.path d={linePath} fill="none"
        stroke={PALETTE[0]} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        filter="url(#cr-line-glow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, ease: "easeInOut" }} />

      {pts.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={4}
          fill={PALETTE[0]} stroke={isDark ? "#111" : "#fff"} strokeWidth="2"
          className="dot"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 1.2 + i * 0.03 }}
          style={{ cursor: "pointer" }}
          onMouseMove={(e) => onHover?.(e, {
            title: String(data[i]?.[x_axis] ?? ""),
            value: fmt(Number(data[i]?.[y_axis]) || 0)
          })}
          onMouseLeave={() => onLeave?.()} />
      ))}

      {data.map((d, i) => (
        <text key={i}
          x={PAD.left + (i / (data.length - 1 || 1)) * pw}
          y={PAD.top + ph + 16}
          textAnchor="middle"
          fill={isDark ? "#444" : "#bbb"} fontSize="11"
          fontFamily="'JetBrains Mono', monospace"
          transform={`rotate(-40 ${PAD.left + (i / (data.length - 1 || 1)) * pw},${PAD.top + ph + 16})`}>
          {String(d[x_axis] ?? "").length > 10 ? String(d[x_axis]).slice(0,10) + "…" : d[x_axis]}
        </text>
      ))}

      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top + ph} x2={PAD.left + pw} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
      <AxisLabels W={W} H={H} PAD={PAD} pw={pw} ph={ph}
        xLabel={x_axis} yLabel={y_axis} isDark={isDark} />
    </svg>
  );
};

const PieChart = ({ data, x_axis, y_axis, isDark, onHover, onLeave }) => {
  const [hovered, setHovered] = useState(null);
  const W = 480, H = 400, cx = 190, cy = H / 2, r = 130;
  const vals = data.map(d => Number(d[y_axis]) || 0);
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
      label: String(d[x_axis] ?? "").replace(/^\s*\d+[\).\-:]*\s*/, ""),
      pct
    };
  });

  return (
    <div className="pie-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
        {slices.map((s, i) => (
          <motion.path key={i} d={s.path} fill={s.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: hovered === null || hovered === i ? 1 : 0.3 }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
            style={{ transformOrigin: `${cx}px ${cy}px`, cursor: "pointer" }}
            onMouseMove={(e) => onHover?.(e, {
              title: s.label,
              value: fmt(vals[i]),
              percent: s.pct
            })}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => {
              setHovered(null);
              onLeave?.();
            }} />
        ))}
        {slices.map((s, i) => s.pct > 0.05 && (
          <motion.text key={i} x={s.lx} y={s.ly}
            textAnchor="middle" dominantBaseline="middle"
            fill="#fff" fontSize="12" fontWeight="bold"
            fontFamily="'JetBrains Mono', monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + i * 0.07 }}>
            {`${(s.pct * 100).toFixed(0)}%`}
          </motion.text>
        ))}
        <text x={cx} y={H - 6} textAnchor="middle"
          fill={isDark ? "#555" : "#999"} fontSize="11" fontWeight="600"
          fontFamily="'JetBrains Mono', monospace" letterSpacing="0.08em">
          {x_axis} · {y_axis}
        </text>
      </svg>
      <div className="pie-legend">
        {slices.map((s, i) => (
          <motion.div key={i} className="legend-item"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            style={{ opacity: hovered === null || hovered === i ? 1 : 0.3 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>
            <span className="legend-dot"  style={{ background: s.color }} />
            <span className="legend-label">{s.label}</span>
            <span className="legend-pct">{(s.pct * 100).toFixed(1)}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ScatterChart = ({ data, x_axis, y_axis, isDark, onHover, onLeave }) => {
  const W = 800, H = 420;
  const PAD = { top: 30, right: 30, bottom: 80, left: 80 };
  const pw = W - PAD.left - PAD.right;
  const ph = H - PAD.top - PAD.bottom;
  const xVals = data.map(d => Number(d[x_axis]) || 0);
  const yVals = data.map(d => Number(d[y_axis]) || 0);
  const xMin = Math.min(...xVals), xMax = Math.max(...xVals) || 1;
  const yMin = Math.min(...yVals), yMax = Math.max(...yVals) || 1;
  const px = v => PAD.left + ((v - xMin) / (xMax - xMin || 1)) * pw;
  const py = v => PAD.top  + (1 - (v - yMin) / (yMax - yMin || 1)) * ph;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="cr-dot-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <line x1={PAD.left} y1={PAD.top + ph * i / 4} x2={PAD.left + pw} y2={PAD.top + ph * i / 4}
            stroke={isDark ? "#1e1e1e" : "#f0f0f0"} strokeWidth="1" />
          <line x1={PAD.left + pw * i / 4} y1={PAD.top} x2={PAD.left + pw * i / 4} y2={PAD.top + ph}
            stroke={isDark ? "#1e1e1e" : "#f0f0f0"} strokeWidth="1" />
          <text x={PAD.left - 8} y={PAD.top + ph * i / 4}
            textAnchor="end" dominantBaseline="middle"
            fill={isDark ? "#444" : "#bbb"} fontSize="10"
            fontFamily="'JetBrains Mono', monospace">
            {fmt(yMax - ((yMax - yMin) * i) / 4)}
          </text>
          <text x={PAD.left + pw * i / 4} y={PAD.top + ph + 14}
            textAnchor="middle"
            fill={isDark ? "#444" : "#bbb"} fontSize="10"
            fontFamily="'JetBrains Mono', monospace">
            {fmt(xMin + ((xMax - xMin) * i) / 4)}
          </text>
        </g>
      ))}

      {data.map((d, i) => (
        <motion.circle key={i}
          cx={px(xVals[i])} cy={py(yVals[i])} r={7}
          fill={PALETTE[i % PALETTE.length]} fillOpacity={0.8}
          filter="url(#cr-dot-glow)" className="dot"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.03, duration: 0.4, ease: "backOut" }}
          style={{ transformOrigin: `${px(xVals[i])}px ${py(yVals[i])}px`, cursor: "pointer" }}
          onMouseMove={(e) => onHover?.(e, {
            title: String(d?.[x_axis] ?? fmt(xVals[i])),
            value: fmt(Number(d?.[y_axis]) || 0)
          })}
          onMouseLeave={() => onLeave?.()} />
      ))}

      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top + ph} x2={PAD.left + pw} y2={PAD.top + ph}
        stroke={isDark ? "#2a2a2a" : "#e0e0e0"} strokeWidth="1" />
      <AxisLabels W={W} H={H} PAD={PAD} pw={pw} ph={ph}
        xLabel={x_axis} yLabel={y_axis} isDark={isDark} />
    </svg>
  );
};

const HistogramChart = ({ data, x_axis, isDark, bins = 10, onHover, onLeave }) => {
  const W = 800, H = 420;
  const PAD = { top: 30, right: 30, bottom: 100, left: 80 };
  const pw = W - PAD.left - PAD.right;
  const ph = H - PAD.top - PAD.bottom;
  const vals = data.map(d => Number(d[x_axis])).filter(v => !isNaN(v));
  if (!vals.length) return null;

  const min = Math.min(...vals), max = Math.max(...vals);
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
        <linearGradient id="cr-hist-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={PALETTE[2]} stopOpacity="1" />
          <stop offset="100%" stopColor={PALETTE[2]} stopOpacity="0.35" />
        </linearGradient>
        <filter id="cr-hist-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {Array.from({ length: 6 }).map((_, i) => {
        const y = PAD.top + ph * (i / 5);
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={PAD.left + pw} y2={y}
              stroke={isDark ? "#1e1e1e" : "#f0f0f0"} strokeWidth="1" />
            <text x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle"
              fill={isDark ? "#444" : "#bbb"} fontSize="11"
              fontFamily="'JetBrains Mono', monospace">
              {Math.round(maxCount * (1 - i / 5))}
            </text>
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
              fill="transparent" className="bar-hover-bg"
              onMouseMove={(e) => onHover?.(e, {
                title: `${fmt(b.x0)} - ${fmt(b.x1)}`,
                value: String(b.count)
              })}
              onMouseLeave={() => onLeave?.()} />
            <motion.rect x={bx + 1} width={barW - 2} rx={3}
              fill="url(#cr-hist-grad)" filter="url(#cr-hist-glow)"
              initial={{ height: 0, y: PAD.top + ph }}
              animate={{ height: bh, y: by }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: [0.34, 1.2, 0.64, 1] }} />
            {b.count > 0 && (
              <motion.text x={bx + barW / 2} y={by - 6}
                textAnchor="middle"
                fill={isDark ? "#555" : "#aaa"} fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.04 }}>
                {b.count}
              </motion.text>
            )}
            <text x={bx + barW / 2} y={PAD.top + ph + 16}
              textAnchor="middle"
              fill={isDark ? "#444" : "#bbb"} fontSize="10"
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
      <AxisLabels W={W} H={H} PAD={PAD} pw={pw} ph={ph}
        xLabel={x_axis} yLabel="frequency" isDark={isDark} />
    </svg>
  );
};

const MetricCard = ({ data, y_axis, isDark }) => {
  const first = data[0];
  const value = first ? (first[y_axis] ?? Object.values(first)[0]) : "N/A";
  return (
    <div className="metric-wrap">
      <motion.div className={`metric-card ${isDark ? "dark" : "light"}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}>
        <motion.div className="metric-icon"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </motion.div>
        <motion.div className="metric-value"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </motion.div>
        <div className="metric-label">{y_axis || "Metric"}</div>
      </motion.div>
    </div>
  );
};

const EmptyState = () => (
  <motion.div className="empty-state"
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}>
    <motion.div className="empty-icon"
      animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4"  y="28" width="8"  height="16" rx="2" fill={PALETTE[0]} opacity="0.3" />
        <rect x="16" y="18" width="8"  height="26" rx="2" fill={PALETTE[0]} opacity="0.5" />
        <rect x="28" y="8"  width="8"  height="36" rx="2" fill={PALETTE[0]} opacity="0.7" />
        <rect x="40" y="20" width="8"  height="24" rx="2" fill={PALETTE[0]} opacity="0.9" />
      </svg>
    </motion.div>
    <p className="empty-text">Upload a CSV or ask the agent to generate a chart</p>
  </motion.div>
);

const resolveChart = (type, data, x_axis, y_axis, isDark) => {
  const props = { data, x_axis, y_axis, isDark };
  switch (type) {
    case "bar":
    case "column":
    case "area":      return <BarChart       {...props} />;
    case "line":      return <LineChart      {...props} />;
    case "scatter":   return <ScatterChart   {...props} />;
    case "pie":       return <PieChart       {...props} />;
    case "histogram": return <HistogramChart data={data} x_axis={x_axis} isDark={isDark} bins={10} />;
    case "metric":    return <MetricCard     data={data} y_axis={y_axis} isDark={isDark} />;
    default:          return <BarChart       {...props} />;
  }
};

function ChartRenderer({ graphData, chartRef }) {
  const { isDark } = useTheme();
  const [chartData, setChartData] = useState(null);
  const [chartKey,  setChartKey]  = useState(0);
  const chartAreaRef = useRef(null);

  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, title: "", value: "", percent: undefined });

  const updateTooltip = useCallback((e, payload) => {
    const el = chartAreaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const maxX = rect.width;
    const maxY = rect.height;

    const baseX = e.clientX - rect.left + 12;
    const baseY = e.clientY - rect.top + 12;

    setTooltip(prev => {
      const next = {
        ...prev,
        visible: true,
        title: payload?.title ?? prev.title,
        value: payload?.value ?? prev.value,
        percent: payload?.percent,
        x: clamp(baseX, 8, Math.max(8, maxX - 220)),
        y: clamp(baseY, 8, Math.max(8, maxY - 120))
      };
      return next;
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(t => (t.visible ? { ...t, visible: false } : t));
  }, []);

  const chartElement = useMemo(() => {
    if (!chartData?.data?.length) return null;
    const { data, chart_type, x_axis, y_axis } = chartData;
    const type = chart_type || "bar";
    const props = { data, x_axis, y_axis, isDark };
    switch (type) {
      case "pie":
        return <PieChart {...props} onHover={updateTooltip} onLeave={hideTooltip} />;
      case "bar":
      case "column":
      case "area":
        return <BarChart {...props} onHover={updateTooltip} onLeave={hideTooltip} />;
      case "line":
        return <LineChart {...props} onHover={updateTooltip} onLeave={hideTooltip} />;
      case "scatter":
        return <ScatterChart {...props} onHover={updateTooltip} onLeave={hideTooltip} />;
      case "histogram":
        return <HistogramChart data={data} x_axis={x_axis} isDark={isDark} bins={10} onHover={updateTooltip} onLeave={hideTooltip} />;
      case "metric":
        return <MetricCard data={data} y_axis={y_axis} isDark={isDark} />;
      default:
        return resolveChart(type, data, x_axis, y_axis, isDark);
    }
  }, [chartData, isDark, updateTooltip, hideTooltip]);

  useEffect(() => {
    if (!graphData?.apiResponse) return;
    setChartData(graphData.apiResponse);
    setChartKey(k => k + 1);
  }, [graphData]);

  if (!chartData?.data?.length) {
    return (
      <div ref={chartRef} className={`graph-panel ${isDark ? "dark" : "light"}`}>
        <EmptyState />
      </div>
    );
  }

  const { data, chart_type, x_axis, y_axis, sql_query, response, insights } = chartData;

  return (
    <div ref={chartRef} className={`graph-panel ${isDark ? "dark" : "light"}`}>
      <div className="chart-area" ref={chartAreaRef}>
        <AnimatePresence mode="wait">
          <motion.div key={chartKey} className="chart-motion-wrap"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}>
            {chartElement ?? resolveChart(chart_type || "bar", data, x_axis, y_axis, isDark)}
          </motion.div>
        </AnimatePresence>
        <ChartTooltip tooltip={tooltip} isDark={isDark} />
      </div>
      <InsightsDisplay insights={insights ?? response} isDark={isDark} />
      <SQLDisplay sqlQuery={sql_query} isDark={isDark} />
    </div>
  );
}

export default ChartRenderer;