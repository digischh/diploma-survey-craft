const express = require("express");
const router = express.Router();

module.exports = (surveyController) => {
  router.post("/surveys", (req, res) => {
    surveyController.createSurvey(req, res);
  });

  router.put("/surveys/:id", (req, res) => {
    surveyController.editSurvey(req, res);
  });

  router.get("/surveys/:id", (req, res) =>
    surveyController.getSurveysByUserId(req, res)
  );

  router.get("/survey/:id", (req, res) => surveyController.getSurvey(req, res));

  router.post("/surveys/:surveyId/question", (req, res) => {
    surveyController.createQuestion(req, res);
  });

  router.put("/surveys/question/:questionId", (req, res) => {
    surveyController.editQuestion(req, res);
  });

  router.get("/surveys/:surveyId/questions", (req, res) =>
    surveyController.getQuestionsBySurveyId(req, res)
  );

  router.delete("/survey/:surveyId", (req, res) => {
    surveyController.deleteSurvey(req, res);
  });

  router.post("/survey/:surveyId/duplicate", (req, res) => {
    surveyController.duplicateSurvey(req, res);
  });

  router.delete("/questions/:questionId", (req, res) => {
    surveyController.deleteQuestion(req, res);
  });

  router.post("/questions/:questionId/copy", (req, res) => {
    surveyController.copyQuestion(req, res);
  });

  router.post("/answers", (req, res) => {
    surveyController.saveSurveyAnswers(req, res);
  });

  return router;
};
