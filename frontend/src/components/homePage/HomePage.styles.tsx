import { Card, Typography, Flex } from "antd";
import styled from "styled-components";

export const SectionWrapper = styled(Flex)`
  padding: 40px 24px;
  background-color: var(--accent);
`;

export const StyledCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px 12px rgba(219, 215, 215, 0.4);
  }

  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
  }
`;

export const IconWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  background: ${(props) => props.color}10;
  color: ${(props) => props.color};
`;

export const STitle = styled(Typography.Text)`
  font-size: 30px;
  text-align: center;
  margin: auto 40px;
  font-weight: 600;
  color: #ffffff;
`;

export const SurveyTitle = styled(Typography.Text)`
  font-size: 18px;
  text-align: center;
  margin-bottom: 8;
  font-weight: 600;
  color: #2d3436;
`;

export const SurveyDescription = styled(Typography.Text)`
  text-align: center;
  flex: 1;
  color: #636e72;
`;

export const SurveyNameWrapper = styled.div`
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
