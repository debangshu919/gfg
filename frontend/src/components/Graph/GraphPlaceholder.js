import React from "react";
import graphStyles from "./graphStyles";

const BARS = [40, 65, 50, 80, 60, 90, 70, 55, 75, 85, 45, 95];
const LINE = [30, 50, 45, 70, 55, 80, 65, 60, 72, 78, 50, 88];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const GRID_LABELS = [100, 75, 50, 25, 0];

function GraphPlaceholder() {
  return (
    <div style={graphStyles.panel}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 480 260"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {GRID_LABELS.map((_, i) => (
          <line
            key={i}
            x1="40" y1={20 + i * 50}
            x2="460" y2={20 + i * 50}
            stroke="#2a2a2a"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis labels */}
        {GRID_LABELS.map((val, i) => (
          <text
            key={i}
            x="32" y={24 + i * 50}
            fill="#555"
            fontSize="9"
            textAnchor="end"
          >
            {val}
          </text>
        ))}

        {/* Bars */}
        {BARS.map((h, i) => {
          const x = 52 + i * 35;
          const barH = (h / 100) * 200;
          return (
            <rect
              key={i}
              x={x} y={220 - barH}
              width="18" height={barH}
              fill="#1e3a5f"
              rx="2"
              opacity="0.85"
            />
          );
        })}

        {/* Line */}
        <polyline
          points={LINE.map((v, i) => `${61 + i * 35},${220 - (v / 100) * 200}`).join(" ")}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Line dots */}
        {LINE.map((v, i) => (
          <circle
            key={i}
            cx={61 + i * 35}
            cy={220 - (v / 100) * 200}
            r="3"
            fill="#3b82f6"
            stroke="#0a0a0a"
            strokeWidth="1.5"
          />
        ))}

        {/* X-axis labels */}
        {MONTHS.map((month, i) => (
          <text
            key={i}
            x={61 + i * 35} y={238}
            fill="#555"
            fontSize="8"
            textAnchor="middle"
          >
            {month}
          </text>
        ))}

        {/* Chart title */}
        <text x="240" y="256" fill="#444" fontSize="10" textAnchor="middle">
          Monthly Performance Overview
        </text>
      </svg>
    </div>
  );
}

export default GraphPlaceholder;