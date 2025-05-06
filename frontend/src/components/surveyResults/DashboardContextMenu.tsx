import { FC } from "react";
import { Popover } from "@mui/material";
import styles from "./dashboard.module.css";
import { Document, ImageRun, Packer, Paragraph } from "docx";
import saveAs from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PptxGenJS from "pptxgenjs";

interface DashboardContextMenuProps {
  anchorEl: EventTarget & Element;
  open: boolean;
  onClose: () => void;
  onCopy: (e: React.MouseEvent, chartId: string) => void;
  onEdit: (chartId: string) => void;
  chartId: string;
}

export const DashboardContextMenu: FC<DashboardContextMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onCopy,
  onEdit,
  chartId,
}) => {
  const IconHide = async (chartElement: any) => {
    const dragIcon = chartElement.querySelector(".drag-icon");
    const moreVertIcon = chartElement.querySelector(".more-vert-icon");
    if (dragIcon) dragIcon.style.display = "none";
    if (moreVertIcon) moreVertIcon.style.display = "none";
  };

  const IconShow = async (chartElement: any) => {
    const dragIcon = chartElement.querySelector(".drag-icon");
    const moreVertIcon = chartElement.querySelector(".more-vert-icon");
    if (dragIcon) dragIcon.style.display = "";
    if (moreVertIcon) moreVertIcon.style.display = "";
  };

  const exportChartsToDOCX = async (chartId: any) => {
    onClose();
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
      IconHide(chartElement);
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");

      const image = new ImageRun({
        data: imgData,
        transformation: {
          width: 500,
          height: (canvas.height * 500) / canvas.width,
        },
        type: "png",
      });

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [image],
              }),
            ],
          },
        ],
      });
      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, `export.docx`);
      IconShow(chartElement);
    }
  };

  const exportChartsToPDF = async (chartId: any) => {
    onClose();
    const doc = new jsPDF();
    const chartElement = document.getElementById(chartId);

    if (chartElement) {
      IconHide(chartElement);
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(
        imgData,
        "PNG",
        10,
        10,
        180,
        (canvas.height * 180) / canvas.width + 20
      );
      doc.save(`export.pdf`);
      IconShow(chartElement);
    }
  };

  const exportChartsToPPTX = async (chartId: any) => {
    onClose();
    const chartElement = document.getElementById(chartId);

    if (chartElement) {
      IconHide(chartElement);
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");
      const pptx = new PptxGenJS();
      const slide = pptx.addSlide();
      slide.addImage({
        data: imgData,
        x: 0.5,
        y: 0.5,
        w: 7,
        h: (canvas.height * 7) / canvas.width,
      });
      pptx.writeFile({ fileName: `export.pptx` });
      IconShow(chartElement);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}>
      <div className={styles.widgetMenu}>
        <button
          className={styles.menuButton}
          onClick={(e) => onCopy(e, chartId)}>
          Копировать
        </button>
        <button className={styles.menuButton} onClick={() => onEdit(chartId)}>
          Изменить
        </button>
        <button
          className={styles.menuButton}
          onClick={() => exportChartsToDOCX(chartId)}>
          Экспортировать в DOCX
        </button>
        <button
          className={styles.menuButton}
          onClick={() => exportChartsToPDF(chartId)}>
          Экспортировать в PDF
        </button>
        <button
          className={styles.menuButton}
          onClick={() => exportChartsToPPTX(chartId)}>
          Экспортировать в PPTX
        </button>
      </div>
    </Popover>
  );
};
