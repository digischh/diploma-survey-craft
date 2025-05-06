import { Button, Flex, Typography } from "antd";
import styled from "styled-components";

export const HeaderWrapper = styled(Flex)`
  padding: 6px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const IconButton = styled(Button)`
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &hover {
    background-color: #f5f5f5;
  }
`;

export const STitle = styled(Typography.Title)`
  margin: 0 !important;
  font-size: 18px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
`;
