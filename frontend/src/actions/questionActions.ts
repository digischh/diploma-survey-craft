import axios from "axios";
import { toast } from "react-toastify";
import { Question } from "../types";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const questionActions = {
  async fetchQuestions(surveyId: string): Promise<Question[]> {
    try {
      const { data } = await apiClient.get(`/surveys/${surveyId}/questions`);
      return data.map(formatQuestion);
    } catch (error) {
      toast.error("Ошибка загрузки вопросов");
      throw error;
    }
  },

  async saveQuestions(surveyId: string, questions: Question[]): Promise<void> {
    try {
      const newQuestions = questions.filter((q) => q.isNew);
      const existingQuestions = questions.filter((q) => !q.isNew);

      if (newQuestions.length > 0) {
        await apiClient.post(`/surveys/${surveyId}/questions`, newQuestions);
      }

      await Promise.all(
        existingQuestions.map((q) => apiClient.put(`/questions/${q.id}`, q))
      );
    } catch (error) {
      toast.error("Ошибка сохранения вопросов");
      throw error;
    }
  },

  async deleteQuestion(questionId: string): Promise<void> {
    try {
      await apiClient.delete(`/questions/${questionId}`);
    } catch (error) {
      toast.error("Ошибка удаления вопроса");
      throw error;
    }
  },
};

function formatQuestion(question: any): Question {
  return {
    ...question,
    options: question.options?.map(formatOption) || [],
  };
}

function formatOption(option: any) {
  return {
    ...option,
    text:
      typeof option.text === "string" && option.text.startsWith("{")
        ? JSON.parse(option.text).text
        : option.text,
  };
}
