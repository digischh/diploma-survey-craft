import React from "react";
import styles from "./QuestionList.module.css";
import { Question } from "../../../types";

interface FeedbackQuestionProps {
  question: Question;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const FeedbackQuestion: React.FC<FeedbackQuestionProps> = ({
  question,
  setQuestions,
}) => (
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
);

export default FeedbackQuestion;
