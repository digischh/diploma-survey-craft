import { FC, MutableRefObject } from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { ChartData } from "../../types";
import { Table } from "./charts/Table";
import { KanoTable } from "./charts/KanoTable";
import { getChartOptions, getBarColors, getChartData } from "../utils/chart";
import { MoSCoWTable } from "./charts/MoSCoWTable";
import { KanoBarChart } from "./charts/KanoBarChart";

type TRenderChartProps = {
  chart: ChartData;
  results: any[];
  chartRefs: MutableRefObject<{
    [key: string]: HTMLCanvasElement | null;
  }>;
};

export const RenderChart: FC<TRenderChartProps> = ({
  chart,
  results,
  chartRefs,
}) => {
  const { barColors, barBorderColors } = getBarColors();
  const barBorderWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--bar-border-width"
    ),
    10
  );

  const chartData = getChartData(
    chart,
    barColors,
    barBorderColors,
    barBorderWidth
  );
  const options = getChartOptions(chart.type, chart);

  const setRef = (ref: any) => {
    chartRefs.current[chart.id] = ref?.canvas ?? null;
  };

  const chartComponents: Record<string, JSX.Element | null> = {
    bar: (
      <Bar
        ref={setRef}
        data={chartData}
        options={options as ChartOptions<"bar">}
      />
    ),
    pie: (
      <Pie
        ref={setRef}
        data={chartData}
        options={options as ChartOptions<"pie">}
      />
    ),
    doughnut: (
      <Doughnut
        ref={setRef}
        data={chartData}
        options={options as ChartOptions<"doughnut">}
      />
    ),
    table: <Table results={results} />,
    kano: <KanoTable key={chart.id} results={chart.data as any} />,
    kanoBar: <KanoBarChart key={chart.id} data={chart.data as any} />,
    moscow: <MoSCoWTable key={chart.id} results={chart.data as any} />,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}>
      {chartComponents[chart.type] ?? null}
    </div>
  );
};
