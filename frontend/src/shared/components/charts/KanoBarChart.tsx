import { FC, useEffect, useState } from "react";
import "./KanoBarChart.css";
import { classifyChoices, summCat, category } from "../../utils/chart";
import { KanoAnswer } from "../../../types";

type TKanoTableProps = {
  data: any[];
};

export const KanoBarChart: FC<TKanoTableProps> = ({ data }) => {
  const [choices, setChoices] = useState<KanoAnswer[]>([]);
  const categoryMap = classifyChoices(choices);

  useEffect(() => {
    const convertedChoices = data.map((res: any) => ({
      title: res.question_text,
      positive: res.answer.positive,
      negative: res.answer.negative,
    }));

    setChoices(convertedChoices);
  }, [data]);
  console.log("categoryMap", categoryMap, choices);
  return (
    <div className="kano-bar-chart">
      <h3>Диаграмма по модели Кано</h3>
      {Object.entries(categoryMap).map(([title, counts]) => {
        const total = summCat(counts);
        return (
          <div key={title} className="kano-feature-row">
            <div className="kano-feature-title">{title}</div>
            <div className="kano-bar">
              {counts.map((count, index) => {
                const percentage = total > 0 ? (count * 100) / total : 0;
                return (
                  <div
                    key={category[index]}
                    className={`kano-bar-segment kano-color-${index}`}
                    style={{ width: `${percentage.toFixed(2)}%` }}>
                    {percentage > 0 ? `${percentage.toFixed(2)}%` : ""}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="kano-legend">
        {category.map((cat, index) => (
          <div key={cat} className="kano-legend-item">
            <div className={`kano-legend-color kano-color-${index}`}></div>
            <span>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
