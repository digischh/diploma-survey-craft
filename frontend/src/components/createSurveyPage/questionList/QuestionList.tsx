import React from "react";
import styles from "./QuestionList.module.css";
import { MdContentCopy, MdDeleteOutline } from "react-icons/md";
import { Question } from "../../../types/types";
const { v4: uuidv4 } = require("uuid");

interface QuestionListProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  handleAddQuestion: () => void;
  handleDeleteQuestion: (id: string) => void;
  handleCopyQuestion: (id: string) => void;
  handleEditQuestion: (id: string, updatedData: Question[]) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
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
            { text: "Новый вариант", is_correct: false },
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
            <>
              <div className={styles.choiceOptions}>
                <div className={styles.customCheckboxContainer}>
                  <div>Обязательный:</div>
                  <div className={styles.customCheckbox}>
                    <input
                      type="checkbox"
                      checked={question.is_required || false}
                      onChange={(e) =>
                        handleEditQuestion(
                          question.id,
                          "is_required",
                          e.target.checked
                        )
                      }
                    />
                    <span className={styles.checkmark}></span>
                  </div>
                </div>
                <div className={styles.customCheckboxContainer}>
                  <div>Тип ответа:</div>
                  <select
                    value={question.answer_type || "single"}
                    onChange={(e) =>
                      handleEditQuestion(
                        question.id,
                        "answer_type",
                        e.target.value
                      )
                    }>
                    <option value="single">Одиночный</option>
                    <option value="multiple">Множественный</option>
                    <option value="text">Текст</option>
                  </select>
                </div>
              </div>
              {question.answer_type !== "text" && (
                <div style={{ gap: "8px", display: "grid" }}>
                  <div className={styles.title}>Варианты ответа:</div>
                  {question.options?.map((option, index) => (
                    <div key={index} className={styles.customCheckboxContainer}>
                      {question.answer_type === "single" ? (
                        <div className={styles.customRadio}>
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswers?.[0] === index}
                            onChange={(e) =>
                              setQuestions((prev) =>
                                prev.map((q) =>
                                  q.id === question.id
                                    ? { ...q, correctAnswers: [index] }
                                    : q
                                )
                              )
                            }
                          />
                          <span className={styles.radiomark}></span>
                        </div>
                      ) : (
                        <div className={styles.customCheckbox}>
                          <input
                            type="checkbox"
                            checked={
                              question.correctAnswers?.includes(index) || false
                            }
                            onChange={(e) =>
                              setQuestions((prev) =>
                                prev.map((q) => {
                                  if (q.id === question.id) {
                                    const isChecked = e.target.checked;
                                    const updatedAnswers = isChecked
                                      ? [...(q.correctAnswers || []), index]
                                      : q.correctAnswers?.filter(
                                          (i) => i !== index
                                        );
                                    return {
                                      ...q,
                                      correctAnswers: updatedAnswers,
                                    };
                                  }
                                  return q;
                                })
                              )
                            }
                          />
                          <span className={styles.checkmark}></span>
                        </div>
                      )}
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(question.id, index, e.target.value)
                        }
                      />
                      <button
                        onClick={() => handleRemoveOption(question.id, index)}
                        className={styles.recentButton}>
                        <MdDeleteOutline />
                      </button>
                    </div>
                  ))}
                  <button
                    className="primary-button"
                    onClick={() => handleAddOption(question.id)}>
                    Добавить вариант
                  </button>
                </div>
              )}
            </>
          )}

          {question.question_type === "feedback" && (
            <div>
              <div className={styles.title}>Описание функции:</div>
              <input
                value={question.feature_description || ""}
                style={{ width: "500px", resize: "both", overflow: "auto" }}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((q) =>
                      q.id === question.id
                        ? { ...q, feature_description: e.target.value }
                        : q
                    )
                  )
                }
              />
            </div>
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

export default QuestionList;
