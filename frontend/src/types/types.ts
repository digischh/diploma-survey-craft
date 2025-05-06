export interface Question {
  id: string;
  question_text: string;
  question_type: string;
  is_required?: boolean;
  options?: Array<{
    is_correct: any;
    id: string;
    text: string;
  }>;
  correctAnswers?: number[];
  answer_type?: "single" | "multiple" | "text";
  feature_description?: string;
  isNew?: boolean;
}

export interface AnswerOption {
  id?: string;
  text: string;
  is_correct?: boolean;
}

export interface AnswerFeedback {
  id: number;
  title: string;
  priority: number;
}

export type QuestionFeedback = {
  id: number;
  title: string;
  answers: AnswerFeedback[];
};

// export interface ChartData {
//   id: string;
//   type: "bar" | "pie" | "table" | "doughnut";
//   data: {
//     labels: string[];
//     datasets: {
//       label: string;
//       data: number[];
//       backgroundColor: string[];
//     }[];
//   };
//   name: string;
//   xAxisTitle: string;
//   yAxisTitle: string;
//   title: string;
// }

export type TableData = {
  id: string;
  type: "table";
  name: string;
  data: string[][];
};

export interface ChartData {
  id: string;
  type: "bar" | "pie" | "table" | "doughnut";
  name: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  xAxisTitle: string;
  yAxisTitle: string;
  title: string;
}

export type ClipboardData =
  | ChartData
  | { id: string; type: "table"; name: string; data: TableData };

export type Survey = {
  id: string;
  user_id: string;
  title?: string;
  description?: string;
  type: string;
  settings?: SurveySettings;
  created_at?: string;
  updated_at?: string;
};

interface SurveySettings {
  questionsPerPage?: number;
  fontSize?: number;
  textColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  titleFontSize?: number;
  descriptionFontSize?: number;
  titleBackgroundColor?: string;
  descriptionBackgroundColor?: string;
  logo?: string;
  backgroundImage?: string;
}
