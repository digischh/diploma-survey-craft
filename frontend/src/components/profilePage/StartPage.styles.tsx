import { Flex } from "antd";
import styled from "styled-components";

export const StartForm = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--background);
  border-radius: 20px;
  padding: 20px;
`;

export const TabsWrapper = styled.div`
  margin: 10px 16px;
  .ant-tabs-tab {
    padding: 10px 16px;
    border-radius: 6px 6px 0 0;
    margin-right: 4px;
    transition: all 0.3s;
  }

  .ant-tabs-tab:hover {
    color: var(--accent);
    background-color: #f9f9f9;
  }

  .ant-tabs-tab-active,
  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #ffffff !important;
    background-color: var(--accent);
    font-weight: bold;
  }

  .ant-tabs-tab-active:hover,
  .ant-tabs-tab-active:hover .ant-tabs-tab-btn {
    background-color: var(--accent);
  }

  .ant-tabs-tab-btn {
    color: #000000;
    font-size: 18px;
  }

  .ant-tabs-ink-bar {
    background-color: var(--accent);
  }

  .ant-tabs-top > .ant-tabs-nav::before {
    border: 1px solid var(--accent);
    z-index: 3;
  }
`;

export const STitle = styled(Flex)`
  padding: 7px;
  font-size: 16px;
`;

export const SLink = styled.a`
  padding: 7px 0;
  font-size: 16px;
  color: var(--accent);

  &:hover {
    color: var(--accent);
    opacity: 0.8;
  }
`;

export const Loader = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5em;
  color: #333;
  background-color: rgba(255, 255, 255);
  padding: 1em 2em;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 5;
`;

export const LoginContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const LogoutButton = styled.button`
  color: #000;
  font-size: 15px;

  &:hover {
    opacity: 0.8;
  }
`;
