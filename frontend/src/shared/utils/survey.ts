import { getRandomColor } from "./colors";

export const formatSurveyResults = (results: any[]) => {
  const groupedResults: { [key: string]: { answers: string[] } } = {};

  results.forEach((result) => {
    const questionText = result.question_text;
    const answers = Array.isArray(result.answer)
      ? result.answer
      : [result.answer];

    if (!groupedResults[questionText]) {
      groupedResults[questionText] = { answers: [] };
    }
    groupedResults[questionText].answers.push(...answers);
  });

  return Object.keys(groupedResults).map((questionText) => {
    const answerCounts: { [key: string]: number } = {};
    const answers = groupedResults[questionText].answers;

    answers.forEach((answer: string) => {
      answerCounts[answer] = (answerCounts[answer] || 0) + 1;
    });

    return {
      question_text: questionText,
      answers: Object.keys(answerCounts),
      counts: Object.values(answerCounts),
      backgroundColor: Object.keys(answerCounts).map((_, index) =>
        getRandomColor(index)
      ),
    };
  });
};
