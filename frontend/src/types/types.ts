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
