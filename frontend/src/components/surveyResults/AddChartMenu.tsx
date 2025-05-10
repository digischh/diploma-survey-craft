import React from "react";
import { Popover } from "@mui/material";
import styles from "./dashboard.module.css";

interface AddChartMenuProps {
  type: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onAddChart: (
    type: "bar" | "pie" | "doughnut" | "table" | "kano" | "kanoBar" | "moscow"
  ) => void;
}

export const AddChartMenu: React.FC<AddChartMenuProps> = ({
  type,
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
        {type === "feedback" && (
          <>
            <button
              className={styles.menuButton}
              onClick={() => onAddChart("kano")}>
              Таблица по модели Kaнo
            </button>
            <button
              className={styles.menuButton}
              onClick={() => onAddChart("moscow")}>
              Таблица по модели MoSCoW
            </button>
            <button
              className={styles.menuButton}
              onClick={() => onAddChart("kanoBar")}>
              Диаграмма по модели Kaнo
            </button>
          </>
        )}
      </div>
    </Popover>
  );
};
