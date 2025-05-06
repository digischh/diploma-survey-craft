import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface Survey {
  id: string;
  user_id: string;
  title?: string;
  description?: string;
  type: string;
  settings?: SurveySettings;
  created_at?: string;
  updated_at?: string;
}

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

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const surveyApi = {
  async createSurvey(userId: string, type: string) {
    const surveyId = uuidv4();
    const response = await apiClient.post("/surveys", {
      id: surveyId,
      user_id: userId,
      type,
    });
    return response.data;
  },

  async fetchSurvey(surveyId: string) {
    const { data } = await apiClient.get(`/survey/${surveyId}`);
    return data;
  },

  async fetchUserSurveys(userId: string) {
    const response = await apiClient.get(`/surveys/${userId}`);
    return response.data;
  },

  async updateSurvey(surveyId: string, surveyData: Partial<Survey>) {
    const { data } = await apiClient.put(`/surveys/${surveyId}`, surveyData);
    return data;
  },

  async duplicateSurvey(id: string) {
    const newSurveyId = uuidv4();
    const response = await apiClient.post(`/survey/${id}/duplicate`, {
      new_id: newSurveyId,
    });
    return response.data;
  },

  async deleteSurvey(id: string) {
    await apiClient.delete(`/survey/${id}`);
  },
};
