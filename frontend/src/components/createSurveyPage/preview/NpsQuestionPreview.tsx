import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./SurveyPreview.module.css";

interface NpsQuestionPreviewProps {
  rating: number;
  onRatingChange: (value: number) => void;
  buttonColor: string;
  textColor: string;
}

const NpsQuestionPreview: React.FC<NpsQuestionPreviewProps> = ({
  rating,
  onRatingChange,
  buttonColor,
  textColor,
}) => {
  const handleChange = (value: number | number[]) => {
    if (typeof value === "number") {
      onRatingChange(value);
    }
  };

  return (
    <div className={styles.npsContainer}>
      <div>Оцените по шкале от 1 до 10:</div>
      <div className={styles.rangeContainer}>
        <Slider
          min={1}
          max={10}
          value={rating}
          onChange={handleChange}
          marks={{
            1: {
              label: "1",
              style: { color: textColor },
            },
            2: {
              label: "2",
              style: { color: textColor },
            },
            3: {
              label: "3",
              style: { color: textColor },
            },
            4: {
              label: "4",
              style: { color: textColor },
            },
            5: {
              label: "5",
              style: { color: textColor },
            },
            6: {
              label: "6",
              style: { color: textColor },
            },
            7: {
              label: "7",
              style: { color: textColor },
            },
            8: {
              label: "8",
              style: { color: textColor },
            },
            9: {
              label: "9",
              style: { color: textColor },
            },
            10: {
              label: "10",
              style: { color: textColor },
            },
          }}
          step={1}
          trackStyle={{
            backgroundColor: buttonColor,
            height: 4,
            borderRadius: 4,
          }}
          handleStyle={{
            borderColor: buttonColor,
            backgroundColor: buttonColor,
            height: 18,
            width: 18,
            marginTop: -8,
            boxShadow: "none",
          }}
          railStyle={{
            backgroundColor: textColor,
            height: 4,
            borderRadius: 4,
          }}
          dotStyle={{
            borderColor: buttonColor,
            backgroundColor: buttonColor,
          }}
          activeDotStyle={{
            borderColor: buttonColor,
            backgroundColor: buttonColor,
          }}
        />
      </div>
    </div>
  );
};

export default NpsQuestionPreview;
