import { ChartData } from "../../../types";
import { ChartOptions } from "chart.js";

export const getChartOptions = (chartType: any, chart: ChartData) => {
  const rootStyles = getComputedStyle(document.documentElement);

  const legendDisplay =
    rootStyles.getPropertyValue("--legend-display").trim() === "true";
  const legendPosition = rootStyles
    .getPropertyValue("--legend-position")
    .trim();
  const legendColor = rootStyles.getPropertyValue("--legend-color").trim();
  const legendFontSize = parseInt(
    rootStyles.getPropertyValue("--legend-font-size"),
    10
  );

  const axisColor = rootStyles.getPropertyValue("--axis-color").trim();
  const axisTickColor = rootStyles.getPropertyValue("--axis-tick-color").trim();
  const axisFontSize = parseInt(
    rootStyles.getPropertyValue("--axis-font-size"),
    10
  );
  const axisTitleFontSize = parseInt(
    rootStyles.getPropertyValue("--axis-title-font-size"),
    10
  );

  if (chartType === "bar") {
    return {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: chart.title,

          font: {
            size: 20,
          },
          padding: {
            top: 10,
            bottom: 10,
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: chart.xAxisTitle,
            color: axisColor,
            font: {
              size: axisTitleFontSize,
            },
          },
          ticks: {
            color: axisTickColor,
            font: {
              size: axisFontSize,
            },
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: chart.yAxisTitle,
            color: axisColor,
            font: {
              size: axisTitleFontSize,
            },
          },
          ticks: {
            font: {
              size: axisFontSize,
            },
          },
          beginAtZero: true,
        },
      },
    } as ChartOptions<"bar">;
  } else if (chartType === "pie" || chartType === "doughnut") {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: legendDisplay,
          position: legendPosition as "top" | "bottom" | "left" | "right",
          labels: {
            color: legendColor,
            font: {
              size: legendFontSize,
            },
          },
        },
      },
    } as ChartOptions<"pie">;
  }

  return {};
};
