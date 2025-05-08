import { FC } from "react";
import { logoutUser } from "../../../api/auth";
import { LogoutButton } from "../StartPage.styles";

export const Logout: FC = () => {
  const logOut = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("userID");
      sessionStorage.removeItem("userID");
      window.location.href = "/signin/autorizate";
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return <LogoutButton onClick={logOut}>Выйти</LogoutButton>;
};
