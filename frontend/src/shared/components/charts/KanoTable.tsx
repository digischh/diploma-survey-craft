import { FC, useEffect, useState } from "react";
import { category, classifyChoices, summCat } from "../../utils/chart";
import { KanoAnswer } from "../../../types";
import { ColumnsType } from "antd/es/table";
import { Flex, Table } from "antd";

type TKanoTableProps = {
  results: any[];
};

export const KanoTable: FC<TKanoTableProps> = ({ results }) => {
  const [choices, setChoices] = useState<KanoAnswer[]>([]);
  const categoryMap = classifyChoices(choices);

  useEffect(() => {
    const convertedChoices = results.map((res: any) => ({
      title: res.question_text,
      positive: res.answer.positive,
      negative: res.answer.negative,
    }));

    setChoices(convertedChoices);
  }, [results]);

  const dataSource = choices.map((feature) => {
    const categories = categoryMap[feature.title] || [];
    const total = summCat(categories);

    const row: Record<string, any> = {
      key: feature.title,
      title: feature.title,
    };

    category.forEach((cat, index) => {
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
    ...category.map((cat) => ({
      title: cat,
      dataIndex: cat,
      key: cat,
      render: (value: string, record: any) => (
        <span
          style={{
            fontWeight: record[`highlight_${cat}`] ? "bold" : undefined,
            color: record[`highlight_${cat}`] ? "#1677ff" : undefined,
          }}>
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
    <Flex>
      <div style={{ fontSize: "16px" }}>Таблица по модели Кано</div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: "max-content" }}
        bordered
      />
    </Flex>
  );
};
