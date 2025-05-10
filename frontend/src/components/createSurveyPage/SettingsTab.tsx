import React from "react";
import { Divider } from "@mui/material";
import styles from "./createSurveyPage.module.css";
import { Question } from "../../types";
import { SurveySettings } from "./settings";
import { SurveyCustomization } from "./customization";
import { QuestionList } from "./questionList";
import { SurveyPreview } from "./preview";

export type TSettingsTabProps = {
  surveyTitle: string;
  setSurveyTitle: (title: string) => void;
  titleFontSize: number;
  setTitleFontSize: (size: number) => void;
  titleBackgroundColor: string;
  setTitleBackgroundColor: (color: string) => void;

  surveyDescription: string;
  setSurveyDescription: (desc: string) => void;
  descriptionFontSize: number;
  setDescriptionFontSize: (size: number) => void;
  descriptionBackgroundColor: string;
  setDescriptionBackgroundColor: (color: string) => void;

  questionsPerPage: number;
  setQuestionsPerPage: (count: number) => void;

  fontSize: number;
  setFontSize: (size: number) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  buttonColor: string;
  setButtonColor: (color: string) => void;

  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoRemove: () => void;
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBackgroundRemove: () => void;

  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  handleAddQuestion: () => void;
  handleDeleteQuestion: (id: string) => void;
  handleCopyQuestion: (id: string) => void;
  handleEditQuestion: (id: string, updatedData: Partial<Question>) => void;

  surveyId: string;
  questionsPreview: Question[];
  currentPage: number;
  totalPages: number;
  backgroundImage: string;
  logo: string;
  handleNextPage: () => void;
  handlePrevPage: () => void;
};

export const SettingsTab: React.FC<TSettingsTabProps> = ({
  surveyTitle,
  setSurveyTitle,
  titleFontSize,
  setTitleFontSize,
  titleBackgroundColor,
  setTitleBackgroundColor,
  surveyDescription,
  setSurveyDescription,
  descriptionFontSize,
  setDescriptionFontSize,
  descriptionBackgroundColor,
  setDescriptionBackgroundColor,
  questionsPerPage,
  setQuestionsPerPage,
  fontSize,
  setFontSize,
  textColor,
  setTextColor,
  backgroundColor,
  setBackgroundColor,
  buttonColor,
  setButtonColor,
  handleLogoUpload,
  handleLogoRemove,
  handleBackgroundUpload,
  handleBackgroundRemove,
  questions,
  setQuestions,
  handleAddQuestion,
  handleDeleteQuestion,
  handleCopyQuestion,
  handleEditQuestion,
  surveyId,
  questionsPreview,
  currentPage,
  totalPages,
  backgroundImage,
  logo,
  handleNextPage,
  handlePrevPage,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.leftSide}>
          <SurveySettings
            surveyTitle={surveyTitle}
            setSurveyTitle={setSurveyTitle}
            titleFontSize={titleFontSize}
            setTitleFontSize={setTitleFontSize}
            titleBackgroundColor={titleBackgroundColor}
            setTitleBackgroundColor={setTitleBackgroundColor}
            surveyDescription={surveyDescription}
            setSurveyDescription={setSurveyDescription}
            descriptionFontSize={descriptionFontSize}
            setDescriptionFontSize={setDescriptionFontSize}
            descriptionBackgroundColor={descriptionBackgroundColor}
            setDescriptionBackgroundColor={setDescriptionBackgroundColor}
            questionsPerPage={questionsPerPage}
            setQuestionsPerPage={setQuestionsPerPage}
          />
          <Divider />
          <SurveyCustomization
            fontSize={fontSize}
            setFontSize={setFontSize}
            textColor={textColor}
            setTextColor={setTextColor}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            buttonColor={buttonColor}
            setButtonColor={setButtonColor}
            handleLogoUpload={handleLogoUpload}
            handleLogoRemove={handleLogoRemove}
            handleBackgroundUpload={handleBackgroundUpload}
            handleBackgroundRemove={handleBackgroundRemove}
          />
          <Divider />
          <QuestionList
            questions={questions}
            setQuestions={setQuestions}
            handleAddQuestion={handleAddQuestion}
            handleDeleteQuestion={handleDeleteQuestion}
            handleCopyQuestion={handleCopyQuestion}
          />
        </div>
        <div className={styles.rightSide}>
          <SurveyPreview
            surveyId={surveyId}
            surveyTitle={surveyTitle}
            surveyDescription={surveyDescription}
            questionsPreview={questionsPreview}
            currentPage={currentPage}
            totalPages={totalPages}
            textColor={textColor}
            backgroundColor={backgroundColor}
            backgroundImage={backgroundImage}
            logo={logo}
            fontSize={fontSize}
            titleFontSize={titleFontSize}
            descriptionFontSize={descriptionFontSize}
            titleBackgroundColor={titleBackgroundColor}
            descriptionBackgroundColor={descriptionBackgroundColor}
            buttonColor={buttonColor}
            buttonTextColor={textColor}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
          />
        </div>
      </div>
    </div>
  );
};
