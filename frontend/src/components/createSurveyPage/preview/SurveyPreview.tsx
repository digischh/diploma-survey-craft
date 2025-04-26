import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./SurveyPreview.module.css";
import { Question } from "../../../types/types";

interface SurveyPreviewProps {
  surveyTitle: string;
  surveyDescription: string;
  questions: Question[];
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

const SurveyPreview: React.FC<SurveyPreviewProps> = ({
  surveyTitle,
  surveyDescription,
  questions,
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
    Array(questions.length).fill(5)
  );

  const handleRatingChange = (index: number, value: number) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = value;
    setRatings(updatedRatings);
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
      {questions.map((question, idx) => (
        <div key={idx} className={styles.questionBlock}>
          <div className={styles.questionNumber}>Вопрос {idx + 1}:</div>
          <div className={styles.questionText}>{question.question_text}</div>

          {question.options &&
            (question.answer_type === "multiple" ||
              question.answer_type === "single") && (
              <div className={styles.optionsContainer}>
                <div>Выберите ответ:</div>
                <div style={{ marginLeft: "10px" }}>
                  {question.options.map((option) => (
                    <div className={styles.customCheckboxContainer}>
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
                          <input type="checkbox" />
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
          {question.answer_type === "text" && <input></input>}
          {question.question_type === "nps" && (
            <div className={styles.npsContainer}>
              <div>Оцените по шкале от 1 до 10:</div>
              <div className={styles.rangeContainer}>
                <Slider
                  min={1}
                  max={10}
                  value={ratings[idx]}
                  onChange={(value: any) => handleRatingChange(idx, value)}
                  marks={{
                    1: "1",
                    2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6",
                    7: "7",
                    8: "8",
                    9: "9",
                    10: "10",
                  }}
                  step={1}
                  trackStyle={{ backgroundColor: buttonColor }}
                  handleStyle={{
                    borderColor: buttonColor,
                    backgroundColor: buttonColor,
                  }}
                  railStyle={{ backgroundColor: "#ccc" }}
                />
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default SurveyPreview;
