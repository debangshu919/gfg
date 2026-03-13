import React from "react";
import "./GraphPlaceholder.css";
import { useTheme } from "../../context/ThemeContext";
import { darkTheme, lightTheme } from "../../context/themes";

const BARS   = [40, 65, 50, 80, 60, 90, 70, 55, 75, 85, 45, 95];
const LINE   = [30, 50, 45, 70, 55, 80, 65, 60, 72, 78, 50, 88];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const GRID   = [100, 75, 50, 25, 0];

function GraphPlaceholder() {
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  return (
    <div className={`graph-panel ${isDark ? "dark" : "light"}`}>
      <svg width="100%" height="100%" viewBox="0 0 480 260" preserveAspectRatio="xMidYMid meet">

        {/* Grid lines */}
        {GRID.map((_, i) => (
          <line key={i} x1="40" y1={20 + i * 50} x2="460" y2={20 + i * 50}
            stroke={t.gridLine} strokeWidth="1" />
        ))}

        {/* Y labels */}
        {GRID.map((val, i) => (
          <text key={i} x="32" y={24 + i * 50}
            fill={t.labelColor} fontSize="9" textAnchor="end">{val}</text>
        ))}

        {/* Bars */}
        {BARS.map((h, i) => {
          const barH = (h / 100) * 200;
          return (
            <rect key={i} x={52 + i * 35} y={220 - barH}
              width="18" height={barH}
              fill={t.barFill} rx="2" opacity="0.9" />
          );
        })}

        {/* Line */}
        <polyline
          points={LINE.map((v, i) => `${61 + i * 35},${220 - (v / 100) * 200}`).join(" ")}
          fill="none" stroke={t.accent} strokeWidth="2" strokeLinejoin="round"
        />

        {/* Dots */}
        {LINE.map((v, i) => (
          <circle key={i}
            cx={61 + i * 35} cy={220 - (v / 100) * 200}
            r="3" fill={t.accent} stroke={t.bgSurface} strokeWidth="1.5"
          />
        ))}

        {/* X labels */}
        {MONTHS.map((m, i) => (
          <text key={i} x={61 + i * 35} y={238}
            fill={t.labelColor} fontSize="8" textAnchor="middle">{m}</text>
        ))}

        {/* Title */}
        <text x="240" y="256" fill={t.labelColor} fontSize="10" textAnchor="middle">
          Monthly Performance Overview
        </text>
      </svg>
    </div>
  );
}

export default GraphPlaceholder;
