import React from "react";
import { Popover } from "@mui/material";
import styles from "./dashboard.module.css";

interface AddChartMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onAddChart: (type: "bar" | "pie" | "doughnut" | "table") => void;
}

export const AddChartMenu: React.FC<AddChartMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onAddChart,
}) => {
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
        <button className={styles.menuButton} onClick={() => onAddChart("bar")}>
          Столбчатая диаграмма
        </button>
        <button className={styles.menuButton} onClick={() => onAddChart("pie")}>
          Круговая диаграмма
        </button>
        <button
          className={styles.menuButton}
          onClick={() => onAddChart("doughnut")}>
          Кольцевая диаграмма
        </button>
        <button
          className={styles.menuButton}
          onClick={() => onAddChart("table")}>
          Таблица
        </button>
      </div>
    </Popover>
  );
};
