import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import {
  MdAssessment,
  MdContentCopy,
  MdDeleteOutline,
  MdPreview,
} from "react-icons/md";
import { HeaderBar } from "../headerBar";
import { surveyActions } from "../../actions/surveyActions";
import {
  handleEditSurvey,
  handlePreviewSurvey,
  handleViewResults,
} from "../../actions/surveyNavigation";
import { Survey } from "../../types";
import { Button, Col, Empty, Flex } from "antd";
import {
  RocketOutlined,
  StarOutlined,
  LikeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  IconWrapper,
  SectionWrapper,
  STitle,
  StyledCard,
  SurveyDescription,
  SurveyNameWrapper,
  SurveyTitle,
} from "./HomePage.styles";
import Title from "antd/es/typography/Title";
import { Tooltip } from "../../shared";

const surveyTypes = [
  {
    id: 1,
    title: "Викторина/тест",
    description: "Создание викторины с правильными ответами",
    type: "test",

    icon: <StarOutlined />,
    color: "#FF6B6B",
  },
  {
    id: 2,
    title: "NPS-опрос",
    description: "Измерение уровня удовлетворенности клиентов",
    type: "nps",

    icon: <LikeOutlined />,
    color: "#4D96FF",
  },
  {
    id: 3,
    title: "Опрос обратной связи",
    description: "Сбор обратной связи от пользователей",
    type: "feedback",

    icon: <MessageOutlined />,
    color: "#6BCB77",
  },
  {
    id: 4,
    title: "Произвольный опрос",
    description: "Создание опросов с произвольными вопросами",
    type: "other",

    icon: <RocketOutlined />,
    color: "#A685E2",
  },
];

export const HomePage: FC = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userID") || "";
  const [recentSurveys, setRecentSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const loadSurveys = async () => {
      if (userId) {
        try {
          const surveys = await surveyActions.fetchSurveys(userId);
          setRecentSurveys(surveys);
        } catch (error) {}
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
      <SectionWrapper justify="space-between">
        <STitle>Создать опрос</STitle>
        {surveyTypes.map((survey) => (
          <Col lg={4} key={survey.id} style={{ marginRight: "20px" }}>
            <StyledCard
              hoverable
              onClick={() => handleCreateSurvey(survey.type)}>
              <IconWrapper color={survey.color}>{survey.icon}</IconWrapper>
              <SurveyTitle>{survey.title}</SurveyTitle>
              <SurveyDescription type="secondary">
                {survey.description}
              </SurveyDescription>
            </StyledCard>
          </Col>
        ))}
      </SectionWrapper>
      <Title level={3} style={{ padding: "40px 40px 20px" }}>
        Недавние опросы
      </Title>
      {recentSurveys.length > 0 ? (
        <Flex gap={10} style={{ flexDirection: "column" }}>
          {recentSurveys.map((survey) => (
            <Flex gap={10} style={{ padding: "0 40px" }} key={survey.id}>
              <SurveyNameWrapper>{survey.title}</SurveyNameWrapper>
              <Tooltip title="Редактировать">
                <Button
                  type="text"
                  size="large"
                  className="outlined-button"
                  icon={<FiEdit />}
                  onClick={() => handleEditSurvey(survey.id, navigate)}
                />
              </Tooltip>
              <Tooltip title="Копировать">
                <Button
                  type="text"
                  size="large"
                  className="outlined-button"
                  icon={<MdContentCopy />}
                  onClick={() => handleCopySurvey(survey.id)}
                />
              </Tooltip>
              <Tooltip title="Удалить">
                <Button
                  type="text"
                  size="large"
                  className="outlined-button"
                  danger
                  icon={<MdDeleteOutline />}
                  onClick={() => handleDeleteSurvey(survey.id)}
                />
              </Tooltip>
              <Button
                type="primary"
                className="primary-button"
                icon={<MdPreview />}
                size="large"
                onClick={() => handlePreviewSurvey(survey.id, navigate)}>
                Предпросмотр
              </Button>
              <Button
                type="text"
                icon={<MdAssessment />}
                size="large"
                className="outlined-button"
                onClick={() => handleViewResults(survey.id, navigate)}>
                Результаты
              </Button>
            </Flex>
          ))}
        </Flex>
      ) : (
        <Empty description="Нет недавних опросов" />
      )}
    </>
  );
};
