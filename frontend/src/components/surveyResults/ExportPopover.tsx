import { FC } from "react";
import Popover from "@mui/material/Popover";
import styles from "./dashboard.module.css";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PptxGenJS from "pptxgenjs";

interface ExportPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  diagramName: string;
}

const ExportPopover: FC<ExportPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  diagramName,
}) => {
  const IconHideAll = async (chartContainer: any) => {
    const dragIcon = chartContainer.querySelectorAll(".drag-icon");
    const moreVertIcon = chartContainer.querySelectorAll(".more-vert-icon");
    dragIcon.forEach(
      (icon: { style: { display: string } }) => (icon.style.display = "none")
    );
    moreVertIcon.forEach(
      (icon: { style: { display: string } }) => (icon.style.display = "none")
    );
  };

  const IconShowAll = async (chartContainer: any) => {
    const dragIcon = chartContainer.querySelectorAll(".drag-icon");
    const moreVertIcon = chartContainer.querySelectorAll(".more-vert-icon");
    dragIcon.forEach(
      (icon: { style: { display: string } }) => (icon.style.display = "")
    );
    moreVertIcon.forEach(
      (icon: { style: { display: string } }) => (icon.style.display = "")
    );
  };

  const exportAllChartsToPDF = async () => {
    onClose();

    const doc = new jsPDF();
    const chartContainer = document.querySelector(".dashboard-container");

    if (chartContainer) {
      IconHideAll(chartContainer);
      const element = chartContainer as HTMLElement;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(
        imgData,
        "PNG",
        10,
        10,
        180,
        (canvas.height * 180) / canvas.width - 10
      );
      doc.save(`${diagramName}.pdf`);
      IconShowAll(chartContainer);
    }
  };

  const exportAllChartsToDOCX = async () => {
    onClose();

    const chartContainer = document.querySelector(".dashboard-container");
    if (chartContainer) {
      IconHideAll(chartContainer);
      const element = chartContainer as HTMLElement;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const image = new ImageRun({
        data: imgData,
        transformation: {
          width: 794,
          height: (canvas.height * 595) / canvas.width,
        },
        type: "png",
      });
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(`Диаграмма ${diagramName}`)],
              }),
              new Paragraph({
                children: [image],
              }),
            ],
          },
        ],
      });
      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, `${diagramName}.docx`);
      IconShowAll(chartContainer);
    }
  };

  const exportAllChatrsToPPTX = async () => {
    onClose();

    const chartContainer = document.querySelector(".dashboard-container");
    const pptx = new PptxGenJS();

    if (chartContainer) {
      IconHideAll(chartContainer);
      const element = chartContainer as HTMLElement;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const slide = pptx.addSlide();
      slide.addImage({
        data: imgData,
        x: 0.5,
        y: 0.5,
        w: 9,
        h: (canvas.height * 9) / canvas.width,
      });
      pptx.writeFile({ fileName: `Отчет.pptx` });
      IconShowAll(chartContainer);
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
      }}
      sx={{
        mt: 1,
      }}>
      <div className={styles.widgetMenu}>
        <button className={styles.menuButton} onClick={exportAllChartsToPDF}>
          Экспорт в PDF
        </button>
        <button className={styles.menuButton} onClick={exportAllChartsToDOCX}>
          Экспорт в DOCX
        </button>
        <button className={styles.menuButton} onClick={exportAllChatrsToPPTX}>
          Экспорт в PPTX
        </button>
      </div>
    </Popover>
  );
};

export default ExportPopover;
