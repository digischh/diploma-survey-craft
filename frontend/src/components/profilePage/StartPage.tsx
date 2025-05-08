import { Tabs } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { StartForm, TabsWrapper } from "./StartPage.styles";
import { FC } from "react";

export const StartPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname.includes("registrate")
    ? "registrate"
    : "autorizate";

  const handleTabChange = (key: string) => {
    if (key === "autorizate") {
      navigate("/signin/autorizate");
    } else if (key === "registrate") {
      navigate("/signin/registrate");
    }
  };

  return (
    <StartForm>
      <TabsWrapper>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          centered
          items={[
            {
              key: "autorizate",
              label: "Вход",
            },
            {
              key: "registrate",
              label: "Регистрация",
            },
          ]}
        />
      </TabsWrapper>
      <Outlet />
    </StartForm>
  );
};
