import { FC } from "react";
import { Table as AntdTable } from "antd";

type TTableProps = {
  results: any[];
};

type SummaryItem = {
  key: string;
  question_text: string;
  value: string;
  count: number;
};

export const Table: FC<TTableProps> = ({ results }) => {
  const summary: SummaryItem[] = [];

  results.forEach((result) => {
    const answer = result.answer;
    let answers: { value: any }[] = [];

    if (Array.isArray(answer)) {
      answers = answer.map((item) => ({ value: item }));
    } else if (typeof answer === "object" && answer !== null) {
      answers = Object.entries(answer).map(([_, value]) => ({ value }));
    } else {
      answers = [{ value: answer }];
    }

    answers.forEach(({ value }) => {
      const existing = summary.find(
        (item) =>
          item.question_text === result.question_text &&
          String(item.value) === String(value)
      );

      if (existing) {
        existing.count++;
      } else {
        summary.push({
          key: `${result.question_text}_${value}`,
          question_text: result.question_text,
          value: String(value),
          count: 1,
        });
      }
    });
  });

  const columns = [
    {
      title: "Вопрос",
      dataIndex: "question_text",
      key: "question_text",
    },
    {
      title: "Значение",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Количество",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <AntdTable dataSource={summary} columns={columns} pagination={false} />
  );
};
