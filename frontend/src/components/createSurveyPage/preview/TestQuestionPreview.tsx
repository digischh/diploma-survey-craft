import React from "react";
import styles from "./SurveyPreview.module.css";
import { Question } from "../../../types";

interface TestQuestionPreviewProps {
  question: Question;
  backgroundColor: string;
  buttonColor: string;
  textColor: string;
  selectedOptions: string[] | string;
  onOptionChange: (selected: string[] | string) => void;
  onTextChange?: (text: string) => void;
}

const TestQuestionPreview: React.FC<TestQuestionPreviewProps> = ({
  question,
  backgroundColor,
  buttonColor,
  textColor,
  selectedOptions,
  onOptionChange,
  onTextChange,
}) => {
  const handleOptionChange = (optionText: string) => {
    if (question.answer_type === "multiple") {
      if (Array.isArray(selectedOptions)) {
        if (selectedOptions.includes(optionText)) {
          onOptionChange(selectedOptions.filter((text) => text !== optionText));
        } else {
          onOptionChange([...selectedOptions, optionText]);
        }
      }
    } else if (question.answer_type === "single") {
      onOptionChange(optionText);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onTextChange) {
      onTextChange(e.target.value);
    }
  };

  return (
    <>
      {question.options &&
        (question.answer_type === "multiple" ||
          question.answer_type === "single") && (
          <div className={styles.optionsContainer}>
            <div>Выберите ответ:</div>
            <div style={{ marginLeft: "10px" }}>
              {question.options.map((option) => (
                <div key={option.id} className={styles.customCheckboxContainer}>
                  {question.answer_type === "multiple" ? (
                    <div
                      className={styles.customCheckbox}
                      style={
                        {
                          "--bg-color": backgroundColor,
                          "--border-color": buttonColor,
                          "--border-check-color": textColor,
                        } as React.CSSProperties
                      }>
                      <input
                        type="checkbox"
                        checked={
                          Array.isArray(selectedOptions) &&
                          selectedOptions.includes(option.text)
                        }
                        onChange={() => handleOptionChange(option.text)}
                      />
                      <span className={styles.checkmark}></span>
                    </div>
                  ) : (
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
                        name={`question-${question.id}`}
                        checked={selectedOptions === option.text}
                        onChange={() => handleOptionChange(option.text)}
                      />
                      <span className={styles.radiomark}></span>
                    </div>
                  )}
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      {question.answer_type === "text" && (
        <div>
          <input
            className={styles.textInput}
            type="text"
            value={selectedOptions || ""}
            onChange={handleTextChange}
          />
        </div>
      )}
    </>
  );
};

export default TestQuestionPreview;
