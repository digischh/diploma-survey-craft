import React from "react";
import styles from "./QuestionList.module.css";
import { MdContentCopy, MdDeleteOutline } from "react-icons/md";
import { Question } from "../../../types";
import TestQuestion from "./TestQuestion";
import FeedbackQuestion from "./FeedbackQuestion";
import { TQuestionListProps } from "../../../types/componentsTypes";
const { v4: uuidv4 } = require("uuid");

export const QuestionList: React.FC<TQuestionListProps> = ({
  questions,
  setQuestions,
  handleAddQuestion,
  handleDeleteQuestion,
  handleCopyQuestion,
}) => {
  const handleOptionChange = (
    questionId: string,
    index: number,
    newText: string
  ) => {
    setQuestions((prev: Question[]) =>
      prev.map((q: Question) => {
        if (q.id !== questionId) return q;

        const updatedOptions = q.options?.map((opt, i) =>
          i === index ? { ...opt, text: newText } : opt
        );

        return { ...q, options: updatedOptions };
      })
    );
  };

  const handleAddOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: [
            ...(q.options || []),
            { id: uuidv4(), text: "Новый вариант", is_correct: false },
          ],
        };
      })
    );
  };

  const handleRemoveOption = (questionId: string, index: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId && q.options
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q
      )
    );
  };

  const handleEditQuestion = (id: string, field: string, value: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === id ? { ...question, [field]: value } : question
      )
    );
  };

  return (
    <div className={styles.questions}>
      <button onClick={handleAddQuestion} className="primary-button">
        Добавить вопрос
      </button>
      {questions.map((question) => (
        <div key={question.id} className={styles.questionBlock}>
          <div>
            <div className={styles.title}>
              {question.question_type === "feedback" ? "Функция" : "Вопрос"}
            </div>
            <input
              type="text"
              style={{ width: "500px", resize: "both", overflow: "auto" }}
              value={question.question_text}
              onChange={(e) =>
                handleEditQuestion(question.id, "question_text", e.target.value)
              }
            />
          </div>

          {question.question_type === "test" && (
            <TestQuestion
              question={question}
              handleEditQuestion={handleEditQuestion}
              handleOptionChange={handleOptionChange}
              handleAddOption={handleAddOption}
              handleRemoveOption={handleRemoveOption}
              setQuestions={setQuestions}
            />
          )}

          {question.question_type === "feedback" && (
            <FeedbackQuestion question={question} setQuestions={setQuestions} />
          )}

          <div className={styles.icons}>
            <button
              onClick={() => handleCopyQuestion(question.id)}
              className={styles.recentButton}>
              <MdContentCopy />
            </button>
            <button
              onClick={() => handleDeleteQuestion(question.id)}
              className={styles.recentButton}>
              <MdDeleteOutline />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
