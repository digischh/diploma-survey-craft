import React, { useState } from "react";
import { QuestionFeedback, AnswerFeedback } from "../../../types";
import styles from "./FeedbackQuestionPreview.module.css";

type FeedbackQuestionPreviewProps = {
  featureTitle: string;
  backgroundColor: string;
  buttonColor: string;
  textColor: string;
  featureDescription: string | undefined;
  selectedAnswers: { positive?: number; negative?: number };
  onAnswerChange: (questionId: number, answer: AnswerFeedback) => void;
};

const questions: QuestionFeedback[] = [
  {
    id: 0,
    title: "Как вы отнесётесь к тому, что эта функция будет добавлена?",
    answers: [
      { id: 0, title: "Мне это понравится", priority: 4 },
      { id: 1, title: "Это ожидаемо", priority: 2 },
      { id: 2, title: "Мне все равно", priority: 0 },
      { id: 3, title: "Мне это не нужно, но мешать не будет", priority: -1 },
      { id: 4, title: "Мне это не нужно и будет мешать", priority: -2 },
    ],
  },
  {
    id: 1,
    title: "Как вы отнесётесь к тому, что эта функция НЕ будет добавлена?",
    answers: [
      { id: 0, title: "Мне это понравится", priority: -2 },
      { id: 1, title: "Это ожидаемо", priority: -1 },
      { id: 2, title: "Мне все равно", priority: 0 },
      { id: 3, title: "Мне это не нужно, но мешать не будет", priority: 2 },
      { id: 4, title: "Мне это не нужно и будет мешать", priority: 4 },
    ],
  },
];

const FeedbackQuestionPreview: React.FC<FeedbackQuestionPreviewProps> = ({
  featureTitle,
  featureDescription,
  backgroundColor,
  buttonColor,
  textColor,
  selectedAnswers,
  onAnswerChange,
}) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionOpen(!isDescriptionOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.featureTitle}>{featureTitle}</div>
        <button
          className={`${styles.toggleDescriptionButton} ${
            isDescriptionOpen ? styles.open : ""
          }`}
          style={
            {
              "--border-color": buttonColor,
            } as React.CSSProperties
          }
          onClick={toggleDescription}
          title="Описание функции">
          {isDescriptionOpen ? "▲" : "▼"}
        </button>
      </div>

      <div
        className={`${styles.featureDescription} ${
          isDescriptionOpen ? styles.open : ""
        }`}>
        {featureDescription}
      </div>

      {questions.map((question) => (
        <div key={question.id} className={styles.questionBlock}>
          <div className={styles.questionTitle}>{question.title}</div>
          <div className={styles.answers}>
            {question.answers.map((answer) => {
              const isChecked =
                (question.id === 0 &&
                  selectedAnswers.positive === answer.priority) ||
                (question.id === 1 &&
                  selectedAnswers.negative === answer.priority);

              return (
                <div key={answer.id} className={styles.answerContanier}>
                  <div
                    className={styles.customRadio}
                    style={
                      {
                        "--bg-color": backgroundColor,
                        "--border-color": buttonColor,
                        "--border-check-color": textColor,
                      } as React.CSSProperties
                    }>
                    <input
                      type="radio"
                      name={`question-${question.id} `}
                      checked={isChecked}
                      onChange={() => onAnswerChange(question.id, answer)}
                    />
                    <span className={styles.radiomark}></span>
                  </div>
                  <div className={styles.answerLabel}> {answer.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackQuestionPreview;
