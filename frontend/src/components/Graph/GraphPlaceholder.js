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
  const [chartType, setChartType] = useState("scatter");

  useEffect(() => {
    if (!graphData || !graphData.file) return;

    const file = graphData.file;
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length === 0) return;

      const headerLine = lines[0];
      const headers = headerLine.split(",");

      const rows = lines.slice(1).map((line) => {
        const values = line.split(",");
        const row = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx];
        });
        return row;
      });

      setData(rows);
      setColumns(headers);

      if (headers.length >= 2) {
        setXCol(headers[0]);
        setYCol(headers[1]);
      }
    };

    reader.readAsText(file);
  }, [graphData]);

  const getChart = () => {

    if (!xCol) return [];

    const xData = data.map((d) => d[xCol]);
    const yData = data.map((d) => d[yCol]);

    if (chartType === "bar") {
      return [{ type: "bar", x: xData, y: yData }];
    }

    if (chartType === "line") {
      return [{ type: "scatter", mode: "lines", x: xData, y: yData }];
    }

    if (chartType === "scatter") {
      return [{ type: "scatter", mode: "markers", x: xData, y: yData }];
    }

    if (chartType === "pie") {
      return [{ type: "pie", labels: xData, values: yData }];
    }

    if (chartType === "histogram") {
      return [{ type: "histogram", x: xData }];
    }

    return [];

  };

  return (
    <div className={`graph-panel ${isDark ? "dark" : "light"}`}>

      {!data.length && (
        <div style={{ opacity: 0.6 }}>
          Upload CSV or ask agent to generate a chart
        </div>
      )}

      {data.length > 0 && (
        <>
          <div style={{ marginBottom: 10 }}>

            <label>X Column </label>
            <select onChange={(e) => setXCol(e.target.value)} value={xCol}>
              {columns.map((col) => (
                <option key={col}>{col}</option>
              ))}
            </select>

            <label style={{ marginLeft: 10 }}>Y Column </label>
            <select onChange={(e) => setYCol(e.target.value)} value={yCol}>
              {columns.map((col) => (
                <option key={col}>{col}</option>
              ))}
            </select>

            <label style={{ marginLeft: 10 }}>Chart </label>
            <select onChange={(e) => setChartType(e.target.value)}>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="scatter">Scatter</option>
              <option value="pie">Pie</option>
              <option value="histogram">Histogram</option>
            </select>

          </div>

          <Plot
            data={getChart()}
            layout={{
              autosize: true,
              title: "Dynamic Chart",
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent"
            }}
            style={{ width: "100%", height: "100%" }}
          />

        </>
      )}

    </div>
  );
}

export default GraphPlaceholder;