import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Chart as ChartJS, registerables } from "chart.js";
import GridLayout from "react-grid-layout";
import Modal from "@mui/material/Modal";
import styles from "./dashboard.module.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DashboardChartStyles.css";
import { DashboardContextMenu } from "./DashboardContextMenu";
import { AddChartMenu } from "./AddChartMenu";
import ExportPopover from "./ExportPopover";
import { ChartData, TableData } from "../../types";
import { formatSurveyResults } from "../../shared/utils/survey";
import { renderChart } from "../../shared/components/Chart";

ChartJS.register(...registerables);

const Dashboard = ({
  results,
  handleDownload,
}: {
  results: any[];
  handleDownload: () => Promise<void>;
}) => {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [isModalContext, setIsModalContext] = useState(false);
  const [contextMenuDaschboard, setContextMenuDaschboard] = useState<{
    anchorEl: EventTarget & Element;
    chartId: string;
  } | null>(null);

  const [clipboard, setClipboard] = useState<ChartData | null>(null);
  const [clipboardTable, setClipboardTable] = useState<TableData | null>(null);

  const [pasteMenu, setPasteMenu] = useState(false);
  const chartRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const [diagramName, setDiagramName] = useState("");
  const [columnName, setColumnName] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentChartId, setCurrentChartId] = useState(null);
  const [uniqueValues, setUniqueValues] = useState([]);
  const [counts, setCounts] = useState([]);

  const [columns, setColumns] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");

  const addChart = (type: "bar" | "pie" | "doughnut" | "table") => {
    const formattedData = formatSurveyResults(results);

    if (type === "table") {
      const tableData: ChartData = {
        id: uuidv4(),
        type: "table",
        data: formattedData.map((item) => [
          item.question_text,
          ...item.answers,
          ...item.counts.map(String),
        ]), 
        name: diagramName || "Таблица результатов",
        xAxisTitle: "",
        yAxisTitle: "",
        title: "Таблица результатов",
      } as unknown as ChartData;

      setCharts((prevCharts) => [...prevCharts, tableData]);
    } else {
      formattedData.forEach((formattedResult) => {
        const newChart: ChartData = {
          id: uuidv4(),
          type,
          data: {
            labels: formattedResult.answers,
            datasets: [
              {
                label: formattedResult.question_text,
                data: formattedResult.counts,
                backgroundColor: formattedResult.backgroundColor,
              },
            ],
          },
          name: diagramName || "Без названия",
          xAxisTitle: columnName || "Ось X",
          yAxisTitle: "Количество",
          title: formattedResult.question_text || "",
        };

        setCharts((prevCharts) => [...prevCharts, newChart]);
      });
    }

    setAnchorEl(null);
  };

  const handleChartContextMenu = (e: React.MouseEvent, chartId: string) => {
    e.preventDefault();
    setContextMenuDaschboard({ anchorEl: e.currentTarget, chartId });
  };

  const handleCopyClick = (e: React.MouseEvent, chartId: string) => {
    e.stopPropagation();
    const chartToCopy = charts.find((chart) => chart.id === chartId);
    if (chartToCopy && chartToCopy.type === "table") {
      const tableToCopy = results;

      if (tableToCopy) {
        const tableData: any[] = [];

        tableToCopy.forEach((result) => {
          const answers = Array.isArray(result.answer)
            ? result.answer
            : [result.answer];

          answers.forEach((answer: string) => {
            const existing = tableData.find(
              (item) =>
                item.question_text === result.question_text &&
                item.answer === answer
            );

            if (existing) {
              existing.count++;
            } else {
              tableData.push({
                question_text: result.question_text,
                answer: answer,
                count: 1,
              });
            }
          });
        });

        setClipboardTable({
          id: uuidv4(),
          type: "table",
          name: diagramName,
          data: tableData,
        });

        toast.success("Таблица скопирована в буфер обмена");
        setPasteMenu(true);
      }
    } else {
      const canvas = chartRefs.current[chartId] as HTMLCanvasElement;

      if (canvas && chartToCopy) {
        setClipboard({
          id: uuidv4(),
          type: chartToCopy.type,
          name: diagramName,
          data: {
            labels: chartToCopy.data.labels,
            datasets: chartToCopy.data.datasets.map((dataset) => ({
              label: dataset.label,
              data: dataset.data,
              backgroundColor: dataset.backgroundColor,
            })),
          },
          xAxisTitle: chartToCopy.xAxisTitle,
          yAxisTitle: chartToCopy.yAxisTitle,
          title: chartToCopy.title,
        });
        toast.success("Диаграмма скопирована в буфер обмена");
        setPasteMenu(true);
      }
    }
    setIsModalContext(false);
  };

  const handleEditClick = (chartId: any) => {
    const chartToEdit = charts.find((chart) => chart.id === chartId);
    if (chartToEdit) {
      setColumnName("");
      setCurrentChartId(chartId);
      setIsEditModalOpen(true);
    }
    setIsModalContext(false);
  };

  const handlePaste = () => {
    if (clipboard) {
      setCharts((prevCharts) => [...prevCharts, clipboard]);
      toast.success("Диаграмма вставлена из буфера обмена");
    } else if (clipboardTable) {
      console.log("clipboardTable", Array.isArray(clipboardTable.data[0]));
      if (Array.isArray(clipboardTable.data)) {
        const tableChartData: ChartData = {
          id: clipboardTable.id,
          type: "table",
          name: clipboardTable.name,
          data: clipboardTable.data,
          xAxisTitle: "",
          yAxisTitle: "",
          title: "",
        } as unknown as ChartData;
        setCharts((prevCharts) => [...prevCharts, tableChartData]);

        toast.success("Таблица вставлена из буфера обмена");
      }
    } else {
      toast.warn("Нечего вставлять");
    }

    setPasteMenu(false);
  };

  const handleSaveChanges = () => {
    setCharts((prevCharts) =>
      prevCharts.map((chart) =>
        chart.id === currentChartId
          ? {
              ...chart,
              name: diagramName,
              xAxisTitle: columnName,
              yAxisTitle: "Количество",
              title: title,
              data: {
                ...chart.data,
                labels: uniqueValues,
                datasets: [
                  {
                    ...chart.data.datasets[0],
                    data: counts,
                  },
                ],
              },
            }
          : chart
      )
    );
    toast.success("Изменения сохранены");
    setIsEditModalOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorElExport, setAnchorElExort] = useState<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenAddChatMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenExportPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElExort(event.currentTarget);
  };
  const [customStyle, setCustomStyle] = useState<HTMLStyleElement | null>(null);

  const loadCSSFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (customStyle) {
        document.head.removeChild(customStyle);
      }

      const newStyle = document.createElement("style");
      newStyle.innerHTML = e.target?.result as string;
      document.head.appendChild(newStyle);
      setCustomStyle(newStyle);
      console.log("CSS файл успешно загружен и применен.");
      toast.success("CSS файл успешно загружен и применен");
    };

    reader.onerror = () => {
      console.error("Ошибка при чтении CSS файла");
      toast.warn("Ошибка при чтении CSS файла");
    };

    reader.readAsText(file);
  };
  console.log("results", results);

  console.log("charts", charts);
  return (
    <div className={styles.appContainer}>
      <div className={styles.fixedButtonContainer}>
        <button
          className={styles.addWidgetButton}
          onClick={(e) => handleOpenAddChatMenu(e)}>
          Добавить виджет
        </button>

        <button
          className={styles.addWidgetButton}
          onClick={(e) => handleOpenExportPopover(e)}>
          Экспортировать дашборд
        </button>
        <button
          className={styles.addWidgetButton}
          onClick={() => handleDownload()}>
          Скачать шаблон стилей
        </button>
        <div>
          <button
            className={styles.addWidgetButton}
            onClick={() => fileInputRef.current?.click()}>
            Загрузить CSS файл
          </button>
          <input
            type="file"
            accept=".css"
            ref={fileInputRef}
            onChange={loadCSSFile}
            style={{ display: "none" }}
          />
        </div>
        {pasteMenu && (
          <button className={styles.addWidgetButton} onClick={handlePaste}>
            Вставить диаграмму
          </button>
        )}
      </div>
      <GridLayout
        className="layout dashboard-container"
        cols={12}
        rowHeight={40}
        width={1200}>
        {charts.map((chart, index) => (
          <div
            key={chart.id}
            id={chart.id}
            className="chartCard dashboard"
            data-grid={{ x: 0, y: index * 2, w: 6, h: 7 }}
            onContextMenu={(e) => handleChartContextMenu(e, chart.id)}>
            <div className={`${styles.dragHandle} drag-icon`}>
              <DragIndicatorIcon />
            </div>
            <div className="ChartName">{diagramName}</div>
            <div className="chart-container">
              <div className="chart">
                {renderChart(chart, results, chartRefs)}
              </div>
            </div>
            <div
              className={`${styles.moreVertIcon} more-vert-icon`}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalContext(true);
                handleChartContextMenu(e, chart.id);
              }}>
              <MoreVertIcon />
            </div>
          </div>
        ))}
      </GridLayout>

      {contextMenuDaschboard && (
        <DashboardContextMenu
          anchorEl={contextMenuDaschboard?.anchorEl || null}
          open={isModalContext}
          onClose={() => setIsModalContext(false)}
          onCopy={handleCopyClick}
          onEdit={handleEditClick}
          chartId={contextMenuDaschboard?.chartId || ""}
        />
      )}

      <AddChartMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onAddChart={addChart}
      />

      <ExportPopover
        open={Boolean(anchorElExport)}
        anchorEl={anchorElExport}
        onClose={() => setAnchorElExort(null)}
        diagramName=""
      />

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className={styles.modalContentEdit}>
          <h2>Изменить график</h2>
          <label>Название диаграммы:</label>
          <input
            type="text"
            value={diagramName}
            onChange={(e) => setDiagramName(e.target.value)}
            placeholder="Введите название"
          />

          <label>Имя столбца:</label>
          <select
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}>
            <option value="">Выберите столбец</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
          <button
            className={styles.addWidgetButton}
            onClick={handleSaveChanges}>
            Сохранить изменения
          </button>
        </div>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Dashboard;
