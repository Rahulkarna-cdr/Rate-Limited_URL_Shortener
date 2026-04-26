import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AnalyticsChart({ analyticsSeries }) {
  const chartCanvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartCanvasRef.current) return;

    const series = analyticsSeries.length
      ? analyticsSeries
      : [0, 0, 0, 0, 0, 0, 0];
    const context = chartCanvasRef.current.getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(context, {
      type: "bar",
      data: {
        labels: DAYS,
        datasets: [
          {
            label: "Clicks",
            data: series,
            backgroundColor: "rgba(29, 78, 216, 0.78)",
            borderColor: "rgba(29, 78, 216, 1)",
            borderWidth: 1,
            borderRadius: 8,
            maxBarThickness: 36,
            hoverBackgroundColor: "rgba(11, 58, 168, 0.9)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 450 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            borderColor: "#1e293b",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: "#475569",
              font: { size: 12, weight: "600" },
            },
            border: { color: "#cbd5e1" },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#64748b",
              precision: 0,
            },
            grid: { color: "#e2e8f0" },
            border: { color: "#cbd5e1" },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [analyticsSeries]);

  return (
    <div className="chart-card">
      <div className="chart-canvas-wrap">
        <canvas ref={chartCanvasRef} />
      </div>
    </div>
  );
}
