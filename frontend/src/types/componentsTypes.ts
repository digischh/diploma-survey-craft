import { Question } from "./types";

export type TSurveySettingsProps = {
  surveyTitle: string;
  setSurveyTitle: (value: string) => void;
  titleFontSize: number;
  setTitleFontSize: (value: number) => void;
  titleBackgroundColor: string;
  setTitleBackgroundColor: (value: string) => void;

  surveyDescription: string;
  setSurveyDescription: (value: string) => void;
  descriptionFontSize: number;
  setDescriptionFontSize: (value: number) => void;
  descriptionBackgroundColor: string;
  setDescriptionBackgroundColor: (value: string) => void;

  questionsPerPage: number;
  setQuestionsPerPage: (value: number) => void;
};

export type TSurveyCustomizationProps = {
  fontSize: number;
  setFontSize: (value: number) => void;
  textColor: string;
  setTextColor: (value: string) => void;
  backgroundColor: string;
  setBackgroundColor: (value: string) => void;
  buttonColor: string;
  setButtonColor: (value: string) => void;

  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoRemove: () => void;
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBackgroundRemove: () => void;
};

export type TQuestionListProps = {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  handleAddQuestion: () => void;
  handleDeleteQuestion: (id: string) => void;
  handleCopyQuestion: (id: string) => void;
  //   handleEditQuestion: (id: string, updatedData: Partial<Question>) => void;
};
