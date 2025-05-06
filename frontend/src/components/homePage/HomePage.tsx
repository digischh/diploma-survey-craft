import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import { FiEdit } from "react-icons/fi";
import { MdContentCopy, MdDeleteOutline } from "react-icons/md";
import HeaderBar from "../headerBar/HeaderBar";
import { surveyActions } from "../../actions/surveyActions";
import {
  handleEditSurvey,
  handlePreviewSurvey,
  handleViewResults,
} from "../../actions/surveyNavigation";

interface Survey {
  survey_id: string;
  survey_title: string;
  survey_type: string;
  survey_description: string;
  survey_settings: any;
}

const surveyTypes = [
  {
    id: 1,
    name: "Викторина/тест",
    description: "Создание викторин с правильными ответами.",
    type: "test",
    image: "/images/test.png",
  },
  {
    id: 2,
    name: "NPS-опрос",
    description: "Измерение уровня удовлетворенности клиентов.",
    type: "nps",
    image: "/images/nps.png",
  },
  {
    id: 3,
    name: "Опрос обратной связи",
    description: "Сбор обратной связи от пользователей.",
    type: "feedback",
    image: "/images/feedback.png",
  },
  {
    id: 4,
    name: "Произвольный опрос",
    description: "Создание опросов с произвольными вопросами.",
    type: "other",
    image: "/images/other.png",
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userID") || "";
  const [recentSurveys, setRecentSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const loadSurveys = async () => {
      if (userId) {
        try {
          const surveys = await surveyActions.fetchSurveys(userId);
          setRecentSurveys(surveys);
        } catch (error) {
        }
      }
    };
    loadSurveys();
  }, [userId]);

  const handleCreateSurvey = async (type: string) => {
    await surveyActions.createSurvey(userId, type, navigate);
  };

  const handleCopySurvey = async (id: string) => {
    await surveyActions.copySurvey(id);

    const surveys = await surveyActions.fetchSurveys(userId);
    setRecentSurveys(surveys);
  };

  const handleDeleteSurvey = async (id: string) => {
    await surveyActions.deleteSurvey(id);

    const surveys = await surveyActions.fetchSurveys(userId);
    setRecentSurveys(surveys);
  };

  return (
    <>
      <HeaderBar />
      <div className={styles.container}>
        {/* Секция "Создать опрос" */}
        <div className={styles.createSurveySection}>
          <div className={styles.createSurveySectionTitle}>Создать опрос</div>
          <div className={styles.createSurveyButtons}>
            {surveyTypes.map((type) => (
              <div
                key={type.id}
                className={styles.surveyType}
                onClick={() => handleCreateSurvey(type.type)}>
                <div
                  className={styles.surveyTypeContent}
                  style={{ backgroundImage: `url(${type.image})` }}
                />
                <div className={styles.surveyTypeName} title={type.description}>
                  {type.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Секция "Недавние опросы" */}
        <div>
          <div className={styles.recentTitle}>Недавние опросы</div>
          {recentSurveys.length > 0 ? (
            <div className={styles.recentList}>
              {recentSurveys.map((survey) => (
                <div className={styles.recentSurveys} key={survey.survey_id}>
                  <div className={styles.recentSurveysName}>
                    {survey.survey_title}
                  </div>
                  <button
                    className={styles.recentButton}
                    onClick={() =>
                      handleEditSurvey(survey.survey_id, navigate)
                    }>
                    <FiEdit />
                  </button>
                  <button
                    className={styles.recentButton}
                    onClick={() => handleCopySurvey(survey.survey_id)}>
                    <MdContentCopy />
                  </button>
                  <button
                    className={styles.recentButton}
                    onClick={() => handleDeleteSurvey(survey.survey_id)}>
                    <MdDeleteOutline />
                  </button>
                  <button
                    className="primary-button"
                    onClick={() =>
                      handlePreviewSurvey(survey.survey_id, navigate)
                    }>
                    Предпросмотр
                  </button>
                  <button
                    className={styles.recentButton}
                    onClick={() =>
                      handleViewResults(survey.survey_id, navigate)
                    }>
                    Результаты
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.recentTitle}>Нет недавних опросов.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
