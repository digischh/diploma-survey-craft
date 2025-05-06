import { NavigateFunction } from "react-router-dom";

export const handleEditSurvey = (id: string, navigate: NavigateFunction) => {
  navigate(`/survey/${id}`);
};

export const handlePreviewSurvey = (id: string, navigate: NavigateFunction) => {
  navigate(`/surveyPreview/${id}`);
};

export const handleViewResults = (id: string, navigate: NavigateFunction) => {
  navigate(`/surveyResults/${id}`);
};
