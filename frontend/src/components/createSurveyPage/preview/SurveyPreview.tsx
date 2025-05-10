import React, { useState } from "react";
import styles from "./SurveyPreview.module.css";
import { AnswerFeedback, Question } from "../../../types/types";
import TestQuestionPreview from "./TestQuestionPreview";
import NpsQuestionPreview from "./NpsQuestionPreview";
import FeedbackQuestionPreview from "./FeedbackQuestionPreview";
import { toast } from "react-toastify";

interface SurveyPreviewProps {
  surveyId: string | undefined;
  surveyTitle: string;
  surveyDescription: string;
  questionsPreview: Question[];
  currentPage: number;
  totalPages: number;
  textColor: string;
  backgroundColor: string;
  backgroundImage: string;
  logo: string;
  fontSize: number;
  titleFontSize: number;
  descriptionFontSize: number;
  titleBackgroundColor: string;
  descriptionBackgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

export const SurveyPreview: React.FC<SurveyPreviewProps> = ({
  surveyId,
  surveyTitle,
  surveyDescription,
  questionsPreview,
  currentPage,
  totalPages,
  textColor,
  backgroundColor,
  backgroundImage,
  logo,
  fontSize,
  titleFontSize,
  descriptionFontSize,
  titleBackgroundColor,
  descriptionBackgroundColor,
  buttonColor,
  buttonTextColor,
  handleNextPage,
  handlePrevPage,
}) => {
  const [ratings, setRatings] = useState<number[]>(
    Array(questionsPreview.length).fill(5)
  );
  const [feedbackAnswers, setFeedbackAnswers] = useState<{
    [index: number]: { positive?: number; negative?: number };
  }>({});

  const handleRatingChange = (index: number, value: number) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = value;
    setRatings(updatedRatings);
  };

  const handleFeedbackAnswerChange = (
    idx: number,
    questionId: number,
    answer: AnswerFeedback
  ) => {
    setFeedbackAnswers((prev) => {
      const newAnswers = { ...prev };
      if (!newAnswers[idx]) newAnswers[idx] = {};
      if (questionId === 0) newAnswers[idx].positive = answer.priority;
      else newAnswers[idx].negative = answer.priority;
      return newAnswers;
    });
  };

  const [testAnswers, setTestAnswers] = useState<{
    [index: number]: string[] | string;
  }>({});

  const handleTestAnswerChange = (idx: number, selected: string[] | string) => {
    setTestAnswers((prev) => ({
      ...prev,
      [idx]: selected,
    }));
  };

  const handleSubmit = async () => {
    try {
      const preparedAnswers = questionsPreview
        .map((q, idx) => {
          if (q.question_type === "nps") {
            return {
              surveyId: surveyId,
              questionId: q.id,
              questionType: "nps",
              answer: ratings[idx],
            };
          } else if (q.question_type === "feedback") {
            return {
              surveyId: surveyId,
              questionId: q.id,
              questionType: "feedback",
              answer: feedbackAnswers[idx] || "",
            };
          } else if (q.question_type === "test") {
            return {
              surveyId: surveyId,
              questionId: q.id,
              questionType: "test",
              answer: testAnswers[idx] || [],
            };
          }
        })
        .filter(Boolean);
      console.log("preparedAnswers", preparedAnswers);

      const response = await fetch("http://localhost:8080/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preparedAnswers }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке ответов");
      }
      toast.success("Ответ успешно сохранен!");
    } catch (error) {
      console.error("Ошибка отправки:", error);
      toast.error("Ошибка отправки!");
    } finally {
    }
  };

  return (
    <div
      className={styles.preview}
      style={{
        fontSize: `${fontSize}px`,
        color: textColor,
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
      }}>
      <div
        className={styles.titleContainer}
        style={{
          fontSize: titleFontSize,
          backgroundColor: titleBackgroundColor,
        }}>
        <img src={logo} alt="" className={styles.logo} width={40} height={40} />
        <div>{surveyTitle}</div>
      </div>
      <div
        className={styles.descriptionContainer}
        style={{
          fontSize: descriptionFontSize,
          backgroundColor: descriptionBackgroundColor,
        }}>
        {surveyDescription}
      </div>

      {questionsPreview.map((question, idx) => (
        <div key={idx} className={styles.questionBlock}>
          {question.question_type === "nps" && (
            <>
              <div className={styles.questionNumber}>Вопрос {idx + 1}:</div>
              <div className={styles.questionText}>
                {question.question_text}
              </div>
              <NpsQuestionPreview
                rating={ratings[idx]}
                onRatingChange={(value) => handleRatingChange(idx, value)}
                buttonColor={buttonColor}
                textColor={textColor}
              />
            </>
          )}
          {question.question_type === "test" && (
            <>
              <div className={styles.questionNumber}>Вопрос {idx + 1}:</div>
              <div className={styles.questionText}>
                {question.question_text}
              </div>
              <TestQuestionPreview
                question={question}
                backgroundColor={backgroundColor}
                buttonColor={buttonColor}
                textColor={textColor}
                selectedOptions={
                  question.answer_type === "text"
                    ? testAnswers[idx] || ""
                    : testAnswers[idx] || []
                }
                onOptionChange={(selected) =>
                  handleTestAnswerChange(idx, selected)
                }
                onTextChange={(text) => handleTestAnswerChange(idx, text)}
              />
            </>
          )}
          {question.question_type === "feedback" && (
            <>
              <div className={styles.questionNumber}>Функция {idx + 1}:</div>
              <FeedbackQuestionPreview
                key={idx}
                backgroundColor={backgroundColor}
                buttonColor={buttonColor}
                textColor={textColor}
                featureTitle={question.question_text}
                featureDescription={question.feature_description}
                selectedAnswers={feedbackAnswers[idx] || {}}
                onAnswerChange={(qId, ans) =>
                  handleFeedbackAnswerChange(idx, qId, ans)
                }
              />
            </>
          )}
        </div>
      ))}

      <div className={styles.buttons}>
        {currentPage > 1 && (
          <button
            onClick={handlePrevPage}
            style={{ backgroundColor: buttonColor, color: buttonTextColor }}
            className={styles.button}>
            Назад
          </button>
        )}
        {currentPage < totalPages && (
          <button
            onClick={handleNextPage}
            style={{ backgroundColor: buttonColor, color: buttonTextColor }}
            className={styles.button}>
            Далее
          </button>
        )}
        {currentPage === totalPages && (
          <button
            onClick={handleSubmit}
            style={{ backgroundColor: buttonColor, color: buttonTextColor }}
            className={styles.button}>
            Отправить
          </button>
        )}
      </div>
    </div>
  );
};
