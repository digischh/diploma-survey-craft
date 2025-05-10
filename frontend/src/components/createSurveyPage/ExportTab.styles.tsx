import styled from "styled-components";
import { Input } from "antd";

const { TextArea } = Input;

export const StyledInput = styled(Input)`
  border-color: rgb(255, 24, 128);
  border-radius: 8px;
  font-size: 16px;
  padding: 8px;

  &:focus {
    border-color: rgb(255, 64, 77);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

export const StyledTextArea = styled(TextArea)`
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  padding: 8px;

  &:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;
