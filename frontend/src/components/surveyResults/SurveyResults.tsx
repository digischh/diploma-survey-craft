import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Dashboard";
import styles from "./surveyResults.module.css";
import { HeaderBar } from "../headerBar";
import { Survey } from "../../types";

const SurveyResults: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey>();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/survey/${surveyId}`
        );
        setSurvey(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке результатов:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/survey/${surveyId}/results`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке результатов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
    fetchResults();
  }, [surveyId]);

  const handleDownload = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/download/styles",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка при загрузке файла");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "DashboardChartStyles.css";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
    }
  };

  if (loading) {
    return <div>Загрузка результатов...</div>;
  }

  return (
    <>
      <HeaderBar showHomeIcon surveyTitle={survey?.title} />
      <div className={styles.header}>Результаты опроса</div>
      {survey && results.length > 0 ? (
        <Dashboard
          survey={survey}
          results={results}
          handleDownload={() => handleDownload()}
        />
      ) : (
        <div className={styles.header}>Результаты отсутсвуют</div>
      )}
    </>
  );
};

export default SurveyResults;
