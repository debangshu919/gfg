import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import "./GraphPlaceholder.css";

const CHART_COLORS = [
  "#2563eb", "#60a5fa", "#3b82f6", "#1d4ed8", "#1e40af"
];

// Custom Bar Chart Component
const CustomBarChart = ({ data, x_axis, y_axis, isDark }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => Number(d[y_axis]) || 0));
  const chartHeight = 350;
  const chartWidth = Math.max(800, data.length * 120); // Dynamic width based on data
  const padding = 60;
  const barWidth = Math.min(60, (chartWidth - 2 * padding) / data.length * 0.6); // Dynamic bar width
  const barSpacing = (chartWidth - 2 * padding) / data.length;
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4 overflow-x-auto">
      <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line
            key={i}
            x1={padding}
            y1={padding + (chartHeight - 2 * padding) * i / 5}
            x2={chartWidth - padding}
            y2={padding + (chartHeight - 2 * padding) * i / 5}
            stroke={isDark ? "#444" : "#e5e5e5"}
            strokeWidth="1"
          />
        ))}
        
        {/* Bars */}
        {data.map((d, i) => {
          const value = Number(d[y_axis]) || 0;
          const barHeight = (value / maxValue) * (chartHeight - 2 * padding);
          const x = padding + (i * barSpacing) + (barSpacing / 2);
          const y = chartHeight - padding - barHeight;
          
          return (
            <g key={i}>
              <rect
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={CHART_COLORS[i % CHART_COLORS.length]}
                rx="4"
                className="transition-all duration-300 hover:opacity-80"
              />
              <text
                x={x}
                y={chartHeight - padding + 35}
                textAnchor="middle"
                fill={isDark ? "#ccc" : "#666"}
                fontSize="11"
                transform={`rotate(-45 ${x},${chartHeight - padding + 35})`}
              >
                {d[x_axis]}
              </text>
              <text
                x={x}
                y={y - 8}
                textAnchor="middle"
                fill={isDark ? "#ccc" : "#666"}
                fontSize="9"
                fontWeight="bold"
              >
                {value >= 1000000 
                  ? `${(value / 1000000).toFixed(1)}M`
                  : value >= 1000 
                    ? `${(value / 1000).toFixed(0)}K`
                    : value.toLocaleString()
                }
              </text>
            </g>
          );
        })}
        
        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const yValue = (maxValue / 5) * (5 - i);
          const yPos = padding + (chartHeight - 2 * padding) * i / 5;
          return (
            <text
              key={`y-label-${i}`}
              x={padding - 10}
              y={yPos}
              textAnchor="end"
              dominantBaseline="middle"
              fill={isDark ? "#ccc" : "#666"}
              fontSize="10"
            >
              {yValue >= 1000000 
                ? `${(yValue / 1000000).toFixed(1)}M`
                : yValue >= 1000 
                  ? `${(yValue / 1000).toFixed(0)}K`
                  : yValue.toLocaleString(undefined, { maximumFractionDigits: 0 })
              }
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Custom Line Chart Component
const CustomLineChart = ({ data, x_axis, y_axis, isDark }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => Number(d[y_axis]) || 0));
  const minValue = Math.min(...data.map(d => Number(d[y_axis]) || 0));
  const chartHeight = 350;
  const chartWidth = Math.max(800, data.length * 120);
  const padding = 60;
  const pointSpacing = (chartWidth - 2 * padding) / (data.length - 1);
  
  const points = data.map((d, i) => {
    const value = Number(d[y_axis]) || 0;
    const x = padding + (i * pointSpacing);
    const y = padding + ((maxValue - value) / (maxValue - minValue)) * (chartHeight - 2 * padding);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4 overflow-x-auto">
      <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line
            key={i}
            x1={padding}
            y1={padding + (chartHeight - 2 * padding) * i / 5}
            x2={chartWidth - padding}
            y2={padding + (chartHeight - 2 * padding) * i / 5}
            stroke={isDark ? "#444" : "#e5e5e5"}
            strokeWidth="1"
          />
        ))}
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={CHART_COLORS[0]}
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const value = Number(d[y_axis]) || 0;
          const x = padding + (i * pointSpacing);
          const y = padding + ((maxValue - value) / (maxValue - minValue)) * (chartHeight - 2 * padding);
          
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill={CHART_COLORS[0]}
                className="transition-all duration-300 hover:r-6"
              />
              <text
                x={x}
                y={chartHeight - padding + 35}
                textAnchor="middle"
                fill={isDark ? "#ccc" : "#666"}
                fontSize="11"
                transform={`rotate(-45 ${x},${chartHeight - padding + 35})`}
              >
                {d[x_axis]}
              </text>
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fill={isDark ? "#ccc" : "#666"}
                fontSize="9"
                fontWeight="bold"
              >
                {value >= 1000000 
                  ? `${(value / 1000000).toFixed(1)}M`
                  : value >= 1000 
                    ? `${(value / 1000).toFixed(0)}K`
                    : value.toLocaleString()
                }
              </text>
            </g>
          );
        })}
        
        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const yValue = minValue + ((maxValue - minValue) / 5) * (5 - i);
          const yPos = padding + (chartHeight - 2 * padding) * i / 5;
          return (
            <text
              key={`y-label-${i}`}
              x={padding - 10}
              y={yPos}
              textAnchor="end"
              dominantBaseline="middle"
              fill={isDark ? "#ccc" : "#666"}
              fontSize="10"
            >
              {yValue >= 1000000 
                ? `${(yValue / 1000000).toFixed(1)}M`
                : yValue >= 1000 
                  ? `${(yValue / 1000).toFixed(0)}K`
                  : yValue.toLocaleString(undefined, { maximumFractionDigits: 0 })
              }
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Custom Pie Chart Component
const CustomPieChart = ({ data, x_axis, y_axis, isDark }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  
  if (!data || data.length === 0) return null;
  
  const chartWidth = 400;
  const chartHeight = 400;
  const centerX = chartWidth / 2;
  const centerY = chartHeight / 2;
  const radius = 120;
  const labelRadius = radius * 0.75;
  
  const total = data.reduce((sum, d) => sum + (Number(d[y_axis]) || 0), 0);
  let currentAngle = -Math.PI / 2;
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {data.map((d, i) => {
          const value = Number(d[y_axis]) || 0;
          const percentage = value / total;
          const angle = percentage * Math.PI * 2;
          const endAngle = currentAngle + angle;
          
          const x1 = centerX + Math.cos(currentAngle) * radius;
          const y1 = centerY + Math.sin(currentAngle) * radius;
          const x2 = centerX + Math.cos(endAngle) * radius;
          const y2 = centerY + Math.sin(endAngle) * radius;
          
          const largeArc = angle > Math.PI ? 1 : 0;
          
          const path = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          const labelAngle = currentAngle + angle / 2;
          const labelX = centerX + Math.cos(labelAngle) * labelRadius;
          const labelY = centerY + Math.sin(labelAngle) * labelRadius;
          
          // Calculate tooltip position
          const tooltipRadius = radius + 30;
          const tooltipX = centerX + Math.cos(labelAngle) * tooltipRadius;
          const tooltipY = centerY + Math.sin(labelAngle) * tooltipRadius;
          
          const isHovered = hoveredSlice === i;
          const expandedRadius = isHovered ? radius + 10 : radius;
          
          // Recalculate path with expanded radius for hover effect
          const expandedX1 = centerX + Math.cos(currentAngle) * expandedRadius;
          const expandedY1 = centerY + Math.sin(currentAngle) * expandedRadius;
          const expandedX2 = centerX + Math.cos(endAngle) * expandedRadius;
          const expandedY2 = centerY + Math.sin(endAngle) * expandedRadius;
          
          const expandedPath = [
            `M ${centerX} ${centerY}`,
            `L ${expandedX1} ${expandedY1}`,
            `A ${expandedRadius} ${expandedRadius} 0 ${largeArc} 1 ${expandedX2} ${expandedY2}`,
            'Z'
          ].join(' ');
          
          currentAngle = endAngle;
          
          return (
            <g key={i}>
              <path
                d={expandedPath}
                fill={CHART_COLORS[i % CHART_COLORS.length]}
                className="transition-all duration-300 cursor-pointer"
                style={{ 
                  opacity: isHovered ? 0.8 : 1,
                  filter: isHovered ? 'brightness(1.1)' : 'none'
                }}
                onMouseEnter={() => setHoveredSlice(i)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
              
              {/* Percentage label on slice */}
              {percentage > 0.05 && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {`${(percentage * 100).toFixed(0)}%`}
                </text>
              )}
              
              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={tooltipX - 60}
                    y={tooltipY - 25}
                    width="120"
                    height="50"
                    fill={isDark ? "#1e1e1e" : "#fff"}
                    stroke={isDark ? "#444" : "#ccc"}
                    strokeWidth="1"
                    rx="6"
                  />
                  <text
                    x={tooltipX}
                    y={tooltipY - 8}
                    textAnchor="middle"
                    fill={isDark ? "#ccc" : "#666"}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {d[x_axis]}
                  </text>
                  <text
                    x={tooltipX}
                    y={tooltipY + 8}
                    textAnchor="middle"
                    fill={isDark ? "#ccc" : "#666"}
                    fontSize="10"
                  >
                    {value >= 1000000 
                      ? `${(value / 1000000).toFixed(1)}M`
                      : value >= 1000 
                        ? `${(value / 1000).toFixed(0)}K`
                        : value.toLocaleString()
                    }
                  </text>
                  <text
                    x={tooltipX}
                    y={tooltipY + 20}
                    textAnchor="middle"
                    fill={isDark ? "#ccc" : "#666"}
                    fontSize="9"
                  >
                    {`${(percentage * 100).toFixed(1)}%`}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        
        {/* Legend */}
        <g transform={`translate(0, ${chartHeight - 30})`}>
          {data.map((d, i) => {
            const legendX = (i * (chartWidth / data.length)) + (chartWidth / data.length / 2);
            const value = Number(d[y_axis]) || 0;
            const percentage = (value / total) * 100;
            
            return (
              <g key={`legend-${i}`}>
                <rect
                  x={legendX - 40}
                  y={0}
                  width="12"
                  height="12"
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                  rx="2"
                />
                <text
                  x={legendX - 25}
                  y={9}
                  fill={isDark ? "#ccc" : "#666"}
                  fontSize="10"
                  textAnchor="start"
                >
                  {d[x_axis].length > 15 
                    ? `${d[x_axis].substring(0, 12)}...`
                    : d[x_axis]
                  }
                </text>
                <text
                  x={legendX + 60}
                  y={9}
                  fill={isDark ? "#ccc" : "#666"}
                  fontSize="9"
                  textAnchor="start"
                  fontWeight="bold"
                >
                  {`${percentage.toFixed(1)}%`}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

function ChartRenderer({ graphData }) {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!graphData) return;
    
    // Handle CSV upload with API response
    if (graphData.apiResponse) {
      setChartData(graphData.apiResponse);
      return;
    }
    
    // Handle legacy CSV file uploads (remove this later)
    if (graphData.file) {
      // This will be replaced with /analyze endpoint
      setError("CSV uploads should use the /analyze endpoint");
      return;
    }
  }, [graphData]);

  const renderChart = () => {
    if (!chartData || !chartData.data) {
      return (
        <div className="flex items-center justify-center h-full opacity-60">
          <div className="text-center">
            <div className="text-lg mb-2">No data available</div>
            <div className="text-sm">Upload CSV or ask agent to generate a chart</div>
          </div>
        </div>
      );
    }

    const { data, chart_type, x_axis, y_axis } = chartData;
    
    // Debug logging
    console.log('ChartRenderer data:', { chart_type, x_axis, y_axis, dataLength: data?.length });
    
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full opacity-60">
          <div className="text-center">
            <div className="text-lg mb-2">Empty data</div>
            <div className="text-sm">The query returned no results</div>
          </div>
        </div>
      );
    }

    switch (chart_type || "bar") { // Default to "bar" if chart_type is null/undefined
      case "bar":
      case "column": // Some APIs might use "column" instead of "bar"
        return <CustomBarChart data={data} x_axis={x_axis} y_axis={y_axis} isDark={isDark} />;

      case "line":
        return <CustomLineChart data={data} x_axis={x_axis} y_axis={y_axis} isDark={isDark} />;

      case "area":
        // For area charts, we'll use a modified bar chart as fallback
        return <CustomBarChart data={data} x_axis={x_axis} y_axis={y_axis} isDark={isDark} />;

      case "pie":
        return <CustomPieChart data={data} x_axis={x_axis} y_axis={y_axis} isDark={isDark} />;

      case "scatter":
        // For scatter charts, we'll use a modified line chart as fallback
        return <CustomLineChart data={data} x_axis={x_axis} y_axis={y_axis} isDark={isDark} />;

      case "metric":
        // Display as KPI cards with improved UI
        const firstRow = data[0];
        const value = firstRow ? firstRow[y_axis] || Object.values(firstRow)[0] : "N/A";
        const label = y_axis || "Metric";
        
        return (
          <div className="flex items-center justify-center h-full p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Background gradient */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-10 blur-xl"
                style={{ backgroundColor: CHART_COLORS[0] }}
              />
              
              {/* Main card */}
              <div 
                className="relative p-8 rounded-2xl border shadow-2xl backdrop-blur-sm"
                style={{
                  background: isDark 
                    ? "linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(40,40,40,0.9) 100%)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(249,249,249,0.9) 100%)",
                  borderColor: isDark ? "#444" : "#e5e5e5",
                  borderWidth: "1px"
                }}
              >
                {/* Icon/Indicator */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: CHART_COLORS[0] }}
                  >
                    <svg 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="white" 
                      strokeWidth="2"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </motion.div>
                </div>
                
                {/* Value */}
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${CHART_COLORS[0]}, ${CHART_COLORS[1] || CHART_COLORS[0]})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </motion.div>
                  
                  {/* Label */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm font-medium opacity-70 uppercase tracking-wider"
                    style={{ color: isDark ? "#ccc" : "#666" }}
                  >
                    {label}
                  </motion.div>
                  
                  {/* Additional info */}
                  {firstRow && Object.keys(firstRow).length > 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="mt-4 pt-4 border-t text-xs opacity-50"
                      style={{ borderColor: isDark ? "#444" : "#e5e5e5" }}
                    >
                      {Object.entries(firstRow)
                        .filter(([key]) => key !== y_axis)
                        .slice(0, 2)
                        .map(([key, val]) => (
                          <div key={key} className="flex justify-between gap-4">
                            <span>{key}:</span>
                            <span>{typeof val === 'number' ? val.toLocaleString() : val}</span>
                          </div>
                        ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full opacity-60">
            <div className="text-center">
              <div className="text-lg mb-2">Unsupported chart type</div>
              <div className="text-sm">Chart type: {chart_type || "unknown"}</div>
            </div>
          </div>
        );
    }
  };

  if (error) {
    return (
      <div className={`graph-panel ${isDark ? "dark" : "light"}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-500">
            <div className="text-lg mb-2">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={chartData ? 'chart' : 'empty'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`graph-panel ${isDark ? "dark" : "light"}`}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          renderChart()
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default ChartRenderer;
