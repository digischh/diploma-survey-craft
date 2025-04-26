import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import { FiEdit } from "react-icons/fi";
import { MdContentCopy, MdDeleteOutline } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

interface Survey {
  survey_id: number;
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
  const userId = sessionStorage.getItem("userID");
  const [recentSurveys, setRecentSurveys] = useState<Survey[]>([]);

  const handleCreateSurvey = async (type: string) => {
    try {
      const surveyId = uuidv4();
      const surveyData = {
        id: surveyId,
        user_id: userId,
        type,
      };

      const response = await fetch("http://localhost:8080/api/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка при создании опроса: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Опрос успешно создан:", data);
      navigate(`/survey/${surveyId}`);
    } catch (error) {
      console.error("Ошибка при создании опроса:", error);
    }
  };

  const fetchRecentSurveys = async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/surveys/${userId}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка при получении опросов: ${response.statusText}`);
      }

      const data = await response.json();
      setRecentSurveys(data);
    } catch (error) {
      console.error("Ошибка при загрузке опросов:", error);
    }
  };

  useEffect(() => {
    fetchRecentSurveys();
  }, [userId]);

  const handleEditSurvey = (id: number) => {
    navigate(`/survey/${id}`);
  };

  const handleCopySurvey = async (id: number) => {
    try {
      const newSurveyId = uuidv4();
      const response = await fetch(
        `http://localhost:8080/api/survey/${id}/duplicate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new_id: newSurveyId }),
        }
      );

      if (response.ok) {
        const newSurvey = await response.json();
        toast.success(
          `Опрос успешно скопирован! Новый опрос: ${newSurvey.title}`
        );
        fetchRecentSurveys();
      } else {
        toast.error("Не удалось скопировать опрос");
        console.error(`Ошибка при дублировании опроса.`);
      }
    } catch (error) {
      toast.error("Произошла ошибка при копировании");
      console.error("Ошибка при выполнении запроса на дублирование:", error);
    }
  };

  const handleDeleteSurvey = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/survey/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Опрос успешно удален");
        fetchRecentSurveys();
      } else {
        toast.error("Не удалось удалить опрос");
        console.error(`Ошибка при удалении опроса с ID ${id}`);
      }
    } catch (error) {
      toast.error("Произошла ошибка при удалении");
      console.error("Ошибка при выполнении запроса на удаление:", error);
    }
  };

  const handlePreviewSurvey = (id: number) => {
    console.log(`Предпросмотр опроса с ID: ${id}`);
    navigate(`/surveyPreview/${id}`);
  };

  const handleViewResults = (id: number) => {
    console.log(`Просмотр результатов опроса с ID: ${id}`);
  };

  return (
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
                  onClick={() => handleEditSurvey(survey.survey_id)}>
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
                  onClick={() => handlePreviewSurvey(survey.survey_id)}>
                  Предпросмотр
                </button>
                <button
                  className={styles.recentButton}
                  onClick={() => handleViewResults(survey.survey_id)}>
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
  );
};

export default HomePage;
