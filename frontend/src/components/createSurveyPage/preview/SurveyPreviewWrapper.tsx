import { useParams } from "react-router-dom";
import SurveyPreview from "./SurveyPreview";
import { useEffect, useState } from "react";
import { Question } from "../../../types/types";

interface SurveyData {
  surveyTitle: string;
  surveyDescription: string;
  questions: Question[];
  currentPage: number;
  totalPages: number;
  textColor: string;
  backgroundColor: string;
  backgroundImage: string;
  logo: string;
  fontSize: number;
  titleFontSize: number;
  descriptionFontSize: number;
  titleBackgroundColor: string;
  descriptionBackgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

const SurveyPreviewWrapper = () => {
  const { surveyId } = useParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState<number>(3);
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  const [surveyDescription, setSurveyDescription] = useState<string>("");

  const [titleFontSize, setTitleFontSize] = useState<number>(24);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(18);
  const [fontSize, setFontSize] = useState<number>(16);

  const [textColor, setTextColor] = useState<string>("#000000");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [buttonColor, setButtonColor] = useState<string>("#f0f0f0");
  const [titleBackgroundColor, setTitleBackgroundColor] =
    useState<string>(backgroundColor);
  const [descriptionBackgroundColor, setDescriptionBackgroundColor] =
    useState<string>(backgroundColor);

  const [logo, setLogo] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/survey/${surveyId}`
        );
        if (!response.ok) throw new Error("Request failed");
        const surveyData = await response.json();
        console.log("Данные опроса:", surveyData);

        setSurveyTitle(surveyData.title || "Опрос");
        setSurveyDescription(surveyData.description || "");

        const settings = surveyData.settings || {};
        setQuestionsPerPage(settings.questionsPerPage || 3);
        setFontSize(settings.fontSize || 16);
        setTextColor(settings.textColor || "#000000");
        setBackgroundColor(settings.backgroundColor || "#ffffff");
        setButtonColor(settings.buttonColor || "#f0f0f0");
        setTitleFontSize(settings.titleFontSize || 24);
        setDescriptionFontSize(settings.descriptionFontSize || 18);
        setTitleBackgroundColor(
          settings.titleBackgroundColor || backgroundColor
        );
        setDescriptionBackgroundColor(
          settings.descriptionBackgroundColor || backgroundColor
        );
        setLogo(settings.logo || "");
        setBackgroundImage(settings.backgroundImage || "");
      } catch (err) {
        console.error(err);
      }
    };

    const fetchQuestions = async () => {
      if (!surveyId) return;
      try {
        const response = await fetch(
          `http://localhost:8080/api/surveys/${surveyId}/questions`
        );
        if (!response.ok) {
          throw new Error(`Ошибка при получении вопросов: ${response.status}`);
        }
        const data = await response.json();
        const formattedQuestions = data.map((q: any) => ({
          ...q,
          isNew: false,
          options: q.options
            ? q.options.map((opt: any) => ({
                ...opt,
                text:
                  typeof opt.text === "string"
                    ? opt.text.startsWith("{")
                      ? JSON.parse(opt.text).text
                      : opt.text
                    : opt.text,
              }))
            : [],
        }));

        setQuestions(formattedQuestions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    fetchQuestions();
  }, [surveyId]);

  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  if (!surveyTitle) return <div>Загрузка...</div>;

  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  return (
    <SurveyPreview
      surveyId={surveyId}
      surveyTitle={surveyTitle}
      surveyDescription={surveyDescription}
      questions={currentQuestions}
      currentPage={currentPage}
      totalPages={totalPages}
      textColor={textColor}
      backgroundColor={backgroundColor}
      backgroundImage={backgroundImage}
      logo={logo}
      fontSize={fontSize}
      titleFontSize={titleFontSize}
      descriptionFontSize={descriptionFontSize}
      titleBackgroundColor={titleBackgroundColor}
      descriptionBackgroundColor={descriptionBackgroundColor}
      buttonColor={buttonColor}
      buttonTextColor={textColor}
      handleNextPage={() =>
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
      }
      handlePrevPage={() =>
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
      }
    />
  );
};

export default SurveyPreviewWrapper;
