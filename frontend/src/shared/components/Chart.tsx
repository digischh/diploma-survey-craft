import React from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { getChartOptions } from "../utils/chartOptions";
import { ChartData } from "../../types";
import renderTable from "./Table";

export const renderChart = (
  chart: ChartData,
  results: any[],
  chartRefs: React.MutableRefObject<any>
) => {
  const rootStyles = getComputedStyle(document.documentElement);
  const chartWidth = "100%";
  const chartHeight = "100%";

  let options: ChartOptions<any> = {};

  if (chart.type === "bar") {
    options = getChartOptions("bar", chart);
  } else if (chart.type === "pie") {
    options = getChartOptions("pie", chart);
  } else if (chart.type === "doughnut") {
    options = getChartOptions("doughnut", chart);
  }

  const barColors: string[] = [];
  const barBorderColors: string[] = [];
  for (let i = 1; i <= 10; i++) {
    barColors.push(rootStyles.getPropertyValue(`--bar-color-${i}`).trim());
    barBorderColors.push(
      rootStyles.getPropertyValue(`--bar-border-color-${i}`).trim()
    );
  }

  const barBorderWidth = parseInt(
    rootStyles.getPropertyValue("--bar-border-width"),
    10
  );

  const chartData = {
    labels: chart.data.labels,
    datasets: [
      {
        label: chart.type !== "table" ? chart.data.datasets[0].label : "",
        data: chart.type !== "table" ? chart.data.datasets[0].data : "",
        backgroundColor: barColors,
        borderColor: barBorderColors,
        borderWidth: barBorderWidth,
      },
    ],
  };

  return (
    <div
      style={{
        width: chartWidth,
        height: chartHeight,
        display: "flex",
        justifyContent: "center",
        paddingBottom: "40px",
      }}>
      {(() => {
        switch (chart.type) {
          case "bar":
            return (
              <Bar
                ref={(ref) =>
                  (chartRefs.current[chart.id] = ref?.canvas ?? null)
                }
                data={chartData}
                options={options as ChartOptions<"bar">}
              />
            );
          case "pie":
            return (
              <Pie
                ref={(ref) =>
                  (chartRefs.current[chart.id] = ref?.canvas ?? null)
                }
                data={chartData}
                options={options as ChartOptions<"pie">}
              />
            );
          case "doughnut":
            return (
              <Doughnut
                ref={(ref) =>
                  (chartRefs.current[chart.id] = ref?.canvas ?? null)
                }
                data={chartData}
                options={options as ChartOptions<"doughnut">}
              />
            );
          case "table":
            return renderTable(results);
          default:
            return null;
        }
      })()}
    </div>
  );
};
