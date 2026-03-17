import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const downloadReport = async ({ question, aiResponse, chartRef }) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const margin = 15;
  let y = 20;

  // Header
  pdf.setFillColor(10, 10, 10);
  pdf.rect(0, 0, pageWidth, 30, "F");
  pdf.setTextColor(59, 130, 246);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("AI Analysis Report", margin, 18);
  pdf.setTextColor(150, 150, 150);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 18, { align: "right" });

  y = 42;

  // Question
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("QUESTION", margin, y);
  y += 6;
  pdf.setDrawColor(30, 58, 92);
  pdf.setFillColor(15, 15, 15);
  pdf.roundedRect(margin, y, pageWidth - margin * 2, 14, 3, 3, "FD");
  pdf.setTextColor(168, 212, 255);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text(question || "N/A", margin + 4, y + 9);
  y += 22;

  // AI Response
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("AI ANALYSIS", margin, y);
  y += 6;
  pdf.setTextColor(200, 200, 200);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const responseLines = pdf.splitTextToSize(
    aiResponse || "No analysis available.",
    pageWidth - margin * 2
  );
  pdf.text(responseLines, margin, y);
  y += responseLines.length * 5 + 10;

  // Chart
  if (chartRef?.current) {
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("VISUALIZATION", margin, y);
    y += 6;
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: "#0f0f0f",
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
  }

  // Footer
  pdf.setDrawColor(40, 40, 40);
  pdf.line(margin, 285, pageWidth - margin, 285);
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(8);
  pdf.text("AI Analysis Report — Confidential", margin, 290);
  pdf.text("Page 1", pageWidth - margin, 290, { align: "right" });

  pdf.save(`AI-report-${Date.now()}.pdf`);
};