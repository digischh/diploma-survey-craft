import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Flex } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader, LoginContainer, SLink, STitle } from "../StartPage.styles";
import { loginUser } from "../../../api/auth";

export const Login: FC = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const onFinish = async (values: any) => {
    const { email, password } = values;
    try {
      const res = await loginUser(email, password);
      sessionStorage.setItem("userID", `${res.id}`);
      setIsRedirecting(true);
      setTimeout(() => navigate("/home"), 1500);
    } catch (error: any) {
      console.error("Ошибка входа:", error);
      toast.error("Ошибка входа. Проверьте данные и попробуйте снова.");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <LoginContainer>
        {isRedirecting && <Loader>Перенаправление...</Loader>}
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}>
          <STitle>Почта</STitle>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Введите почту" },
              { type: "email", message: "Неверный формат почты" },
            ]}>
            <Input placeholder="Введите почту" />
          </Form.Item>
          <STitle>Пароль</STitle>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}>
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="primary-button"
            loading={isRedirecting}
            block>
            Вход
          </Button>
        </Form>
        <Flex style={{ marginTop: "10px" }}>
          <STitle>Нет аккаунта?</STitle>
          <SLink href="/signin/registrate">Зарегистрироваться</SLink>
        </Flex>
      </LoginContainer>
    </>
  );
};
