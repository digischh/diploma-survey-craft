import { ChartData } from "../../../types";

export const getChartData = (
  chart: ChartData,
  barColors: string[],
  barBorderColors: string[],
  barBorderWidth: number
) => {
  const isChart =
    chart.type !== "table" &&
    chart.type !== "kano" &&
    chart.type !== "kanoBar" &&
    chart.type !== "moscow";

  if (!isChart) {
    return {
      labels: [],
      datasets: [],
    };
  }

  const graphData = chart.data as {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };

  return {
    labels: graphData.labels,
    datasets: [
      {
        label: graphData.datasets[0].label,
        data: graphData.datasets[0].data,
        backgroundColor: barColors,
        borderColor: barBorderColors,
        borderWidth: barBorderWidth,
      },
    ],
  };
};
