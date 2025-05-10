import styled from "styled-components";

export const TabsWrapper = styled("div")`
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
  }

  .ant-tabs-ink-bar {
    background-color: var(--accent);
  }

  .ant-tabs-top > .ant-tabs-nav::before {
    border: 1px solid var(--accent);
    z-index: 3;
  }
`;
