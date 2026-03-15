import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "./GraphPlaceholder.css";
import { useTheme } from "../../context/ThemeContext";

function GraphPlaceholder({ graphData }) {

  const { isDark } = useTheme();

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {

    if (!graphData) return;

    /* BACKEND DATA MODE */
    if (graphData.rows) {

      const rows = graphData.rows;

      setData(rows);
      setColumns(Object.keys(rows[0]));
      setXCol(graphData.xCol);
      setYCol(graphData.yCol);
      setChartType(graphData.chartType || "bar");

      return;
    }

    /* CSV MODE */
    if (!graphData.file) return;

    const reader = new FileReader();

    reader.onload = (e) => {

      const text = e.target.result;

      const lines = text.split("\n").filter(l => l.trim() !== "");

      const headers = lines[0].split(",");

      const rows = lines.slice(1).map(line => {

        const values = line.split(",");
        const obj = {};

        headers.forEach((h, i) => {
          obj[h] = values[i];
        });

        return obj;

      });

      setColumns(headers);
      setData(rows);

      if (headers.length >= 2) {
        setXCol(headers[0]);
        setYCol(headers[1]);
      }

    };

    reader.readAsText(graphData.file);

  }, [graphData]);

  const xData = data.map(d => d[xCol]);
  const yData = data.map(d => d[yCol]);

  const primaryColor = isDark ? "#6366f1" : "#4f46e5";
  const secondaryColor = isDark ? "#22c55e" : "#16a34a";

  const getChart = () => {

    if (!xCol) return [];

    if (chartType === "bar") {
      return [{
        type: "bar",
        x: xData,
        y: yData,
        marker: {
          color: primaryColor,
          opacity: 0.9,
          line: { width: 0 }
        },
        hovertemplate: "<b>%{x}</b><br>Value: %{y}<extra></extra>"
      }];
    }

    if (chartType === "line") {
      return [{
        type: "scatter",
        mode: "lines+markers",
        x: xData,
        y: yData,
        line: {
          color: primaryColor,
          width: 3,
          shape: "spline"
        },
        marker: {
          size: 7,
          color: secondaryColor
        },
        hovertemplate: "<b>%{x}</b><br>%{y}<extra></extra>"
      }];
    }

    if (chartType === "scatter") {
      return [{
        type: "scatter",
        mode: "markers",
        x: xData,
        y: yData,
        marker: {
          size: 10,
          color: primaryColor,
          opacity: 0.8
        }
      }];
    }

    if (chartType === "pie") {
      return [{
        type: "pie",
        labels: xData,
        values: yData,
        hole: 0.45,
        marker: {
          colors: [
            "#6366f1",
            "#22c55e",
            "#f59e0b",
            "#ef4444",
            "#06b6d4",
            "#a855f7"
          ]
        }
      }];
    }

    if (chartType === "histogram") {
      return [{
        type: "histogram",
        x: yData,
        marker: { color: primaryColor }
      }];
    }

    return [];
  };

  const layout = {
    autosize: true,
    title: {
      text: `${yCol} vs ${xCol}`,
      font: { size: 16 }
    },
    margin: { t: 40, r: 20, l: 50, b: 40 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",

    xaxis: {
      gridcolor: isDark ? "#222" : "#ddd",
      zerolinecolor: "transparent"
    },

    yaxis: {
      gridcolor: isDark ? "#222" : "#ddd",
      zerolinecolor: "transparent"
    },

    font: {
      color: isDark ? "#ccc" : "#333"
    },

    hoverlabel: {
      bgcolor: isDark ? "#1f1f1f" : "#ffffff",
      font: { color: isDark ? "#fff" : "#000" }
    },

    transition: {
      duration: 400,
      easing: "cubic-in-out"
    }
  };

  return (
    <div className={`graph-panel ${isDark ? "dark" : "light"}`}>

      {!data.length && (
        <div style={{ opacity: 0.6 }}>
          Upload CSV or ask the agent to generate a chart
        </div>
      )}

      {data.length > 0 && (
        <Plot
          data={getChart()}
          layout={layout}
          config={{
            displayModeBar: false,
            responsive: true
          }}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler
        />
      )}

    </div>
  );
}

export default GraphPlaceholder;