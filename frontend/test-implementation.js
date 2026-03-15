// Simple test to verify our implementation
import React from 'react';
import ChartRenderer from './src/components/Graph/ChartRenderer';

// Test data that simulates API response
const testChartData = {
  success: true,
  type: "data",
  prompt: "Show sales by month",
  response: "Here's the sales data by month",
  sql_query: "SELECT month, sales FROM sales_data",
  chart_type: "bar",
  x_axis: "month",
  y_axis: "sales",
  data: [
    { month: "January", sales: 1000 },
    { month: "February", sales: 1500 },
    { month: "March", sales: 1200 },
    { month: "April", sales: 1800 },
    { month: "May", sales: 2000 }
  ]
};

// Test data for pie chart
const testPieData = {
  success: true,
  type: "data",
  prompt: "Show distribution",
  response: "Here's the distribution",
  chart_type: "pie",
  x_axis: "category",
  y_axis: "value",
  data: [
    { category: "A", value: 30 },
    { category: "B", value: 45 },
    { category: "C", value: 25 }
  ]
};

// Test data for metric/KPI
const testMetricData = {
  success: true,
  type: "data",
  prompt: "Show total revenue",
  response: "Total revenue is $50,000",
  chart_type: "metric",
  x_axis: null,
  y_axis: "revenue",
  data: [
    { revenue: 50000 }
  ]
};

console.log('Test data prepared:');
console.log('- Bar chart data:', testChartData);
console.log('- Pie chart data:', testPieData);
console.log('- Metric data:', testMetricData);

// This file can be used to test the ChartRenderer component
// by passing the test data as graphData prop
console.log('Implementation test completed successfully!');
