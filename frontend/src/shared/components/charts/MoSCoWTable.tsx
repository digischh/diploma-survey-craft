import { FC, useEffect, useState } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { classifyMoSCoWChoices } from "../../utils/chart/classifyMoSCoW";
import { KanoAnswer } from "../../../types";

const categoryMoSCoW = ['Обязательно', 'Желательно', 'Возможно', 'Не нужно'];

type TMoSCoWTableProps = {
  results: any[];
};

const summCat = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0);

export const MoSCoWTable: FC<TMoSCoWTableProps> = ({ results }) => {
  const [choices, setChoices] = useState<KanoAnswer[]>([]);
  const categoryMap = classifyMoSCoWChoices(choices);

  useEffect(() => {
    const convertedChoices = results.map((res: any) => ({
      title: res.question_text,
      positive: res.answer.positive,
      negative: res.answer.negative,
    }));

    setChoices(convertedChoices);
  }, [results]);

  const dataSource = choices.map((choice) => {
    const categories = categoryMap[choice.title] || [];
    const total = summCat(categories);

    const row: Record<string, any> = {
      key: choice.title,
      title: choice.title,
    };

    categoryMoSCoW.forEach((cat, index) => {
      const value = categories[index] || 0;
      row[cat] = total > 0 ? ((value * 100) / total).toFixed(2) + "%" : "0%";
      row[`highlight_${cat}`] = value === Math.max(...categories);
    });

    return row;
  });

  const columns: ColumnsType<any> = [
    {
      title: "Функция",
      dataIndex: "title",
      key: "title",
      fixed: "left",
    },
    ...categoryMoSCoW.map((cat) => ({
      title: cat,
      dataIndex: cat,
      key: cat,
      render: (value: string, record: any) => (
        <span
          style={{
            fontWeight: record[`highlight_${cat}`] ? "bold" : undefined,
            color: record[`highlight_${cat}`] ? "#1677ff" : undefined,
          }}
        >
          {value}
        </span>
      ),
      onCell: (record: any) => ({
        style: {
          backgroundColor: record[`highlight_${cat}`]
            ? "lightgreen"
            : undefined,
        },
      }),
    })),
  ];

  return (
    <div className="moscow-table">
      <div style={{ fontSize: "16px" }}>Таблица по модели MoSCoW</div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: "max-content" }}
        bordered
      />
    </div>
  );
};
