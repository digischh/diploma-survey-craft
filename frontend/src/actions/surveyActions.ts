import { toast } from "react-toastify";
import { surveyApi } from "../api/surveyApi";
import { Survey } from "../types";

export const surveyActions = {
  async createSurvey(
    userId: string,
    type: string,
    navigate: (path: string) => void
  ) {
    try {
      const data = await surveyApi.createSurvey(userId, type);
      navigate(`/survey/${data.id}`);
      return data;
    } catch (error) {
      toast.error("Ошибка при создании опроса");
      console.error("Create survey error:", error);
      throw error;
    }
  },

  async fetchSurvey(surveyId: string) {
    try {
      return await surveyApi.fetchSurvey(surveyId);
    } catch (error) {
      console.error("Fetch surveys error:", error);
      throw error;
    }
  },

  async fetchSurveys(userId: string) {
    try {
      return await surveyApi.fetchUserSurveys(userId);
    } catch (error) {
      console.error("Fetch surveys error:", error);
      throw error;
    }
  },

  async updateSurvey(surveyId: string, updateData: Partial<Survey>) {
    try {
      const response = await surveyApi.updateSurvey(surveyId, updateData);
      console.log("Survey updated successfully:", response);
      return response;
    } catch (error) {
      console.error("Update survey error:", error);
      throw error;
    }
  },

  async copySurvey(id: string) {
    try {
      const newSurvey = await surveyApi.duplicateSurvey(id);
      toast.success(`Опрос скопирован! Новый ID: ${newSurvey.id}`);
      return newSurvey;
    } catch (error) {
      toast.error("Ошибка при копировании опроса");
      console.error("Copy survey error:", error);
      throw error;
    }
  },

  async deleteSurvey(id: string) {
    try {
      await surveyApi.deleteSurvey(id);
      toast.success("Опрос удалён");
    } catch (error) {
      toast.error("Ошибка при удалении опроса");
      console.error("Delete survey error:", error);
      throw error;
    }
  },
};
