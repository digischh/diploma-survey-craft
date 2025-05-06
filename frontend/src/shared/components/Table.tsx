export const renderTable = (results: any[]) => {
  const summary: any[] = [];

  results.forEach((result) => {
    const answers = Array.isArray(result.answer)
      ? result.answer
      : [result.answer];

    answers.forEach((answer: string) => {
      const existing = summary.find(
        (item) =>
          item.question_text === result.question_text && item.answer === answer
      );

      if (existing) {
        existing.count++;
      } else {
        summary.push({
          question_text: result.question_text,
          answer: answer,
          count: 1,
        });
      }
    });
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Вопрос</th>
          <th>Вариант ответа</th>
          <th>Количество ответов</th>
        </tr>
      </thead>
      <tbody>
        {summary.map((item, index) => (
          <tr key={index}>
            <td>{item.question_text}</td>
            <td>{item.answer}</td>
            <td>{item.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default renderTable;
