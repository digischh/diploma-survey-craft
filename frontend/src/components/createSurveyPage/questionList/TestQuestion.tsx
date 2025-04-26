import React from "react";
import styles from "./QuestionList.module.css";
import { Question } from "../../../types";
import { MdDeleteOutline } from "react-icons/md";

interface TestQuestionProps {
  question: Question;
  handleEditQuestion: (id: string, field: string, value: any) => void;
  handleOptionChange: (
    questionId: string,
    index: number,
    newText: string
  ) => void;
  handleAddOption: (questionId: string) => void;
  handleRemoveOption: (questionId: string, index: number) => void;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const TestQuestion: React.FC<TestQuestionProps> = ({
  question,
  handleEditQuestion,
  handleOptionChange,
  handleAddOption,
  handleRemoveOption,
  setQuestions,
}) => (
  <>
    <div className={styles.choiceOptions}>
      <div className={styles.customCheckboxContainer}>
        <div>Обязательный:</div>
        <div className={styles.customCheckbox}>
          <input
            type="checkbox"
            checked={question.is_required || false}
            onChange={(e) =>
              handleEditQuestion(question.id, "is_required", e.target.checked)
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
            handleEditQuestion(question.id, "answer_type", e.target.value)
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
                  checked={question.correctAnswers?.includes(index) || false}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((q) => {
                        if (q.id === question.id) {
                          const isChecked = e.target.checked;
                          const updatedAnswers = isChecked
                            ? [...(q.correctAnswers || []), index]
                            : q.correctAnswers?.filter((i) => i !== index);
                          return { ...q, correctAnswers: updatedAnswers };
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
);

export default TestQuestion;
