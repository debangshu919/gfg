import React, { useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [chartType, setChartType] = useState("bar");

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: function (results: any) {
        console.log(results.data); // check parsed data

        if (results.data && results.data.length > 0) {
          const firstRow = results.data[0];

          // Get column names
          const cols = Object.keys(firstRow);

          setData(results.data);
          setColumns(cols);
        }
      },
    });
  };

  const xData = data.map((row) => row[xCol]);
  const yData = data.map((row) => row[yCol]);

  let plotData: any = [];

  if (chartType === "bar") {
    plotData = [{ x: xData, y: yData, type: "bar" }];
  }

  if (chartType === "line") {
    plotData = [{ x: xData, y: yData, type: "scatter", mode: "lines" }];
  }

  if (chartType === "scatter") {
    plotData = [{ x: xData, y: yData, type: "scatter", mode: "markers" }];
  }

  if (chartType === "pie") {
    plotData = [{ labels: xData, values: yData, type: "pie" }];
  }

  if (chartType === "histogram") {
    plotData = [{ x: yData, type: "histogram" }];
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>CSV Chart Generator</h2>

      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {columns.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <label>X Axis </label>
          <select onChange={(e) => setXCol(e.target.value)}>
            <option>Select</option>
            {columns.map((col) => (
              <option key={col}>{col}</option>
            ))}
          </select>

          <label style={{ marginLeft: 20 }}>Y Axis </label>
          <select onChange={(e) => setYCol(e.target.value)}>
            <option>Select</option>
            {columns.map((col) => (
              <option key={col}>{col}</option>
            ))}
          </select>

          <label style={{ marginLeft: 20 }}>Chart Type </label>
          <select onChange={(e) => setChartType(e.target.value)}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="scatter">Scatter</option>
            <option value="histogram">Histogram</option>
          </select>
        </div>
      )}

      {data.length > 0 && (
        <Plot
          data={plotData}
          layout={{ width: 900, height: 500, title: "Chart" }}
        />
      )}
    </div>
  );
}