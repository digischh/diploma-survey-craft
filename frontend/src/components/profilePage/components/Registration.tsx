import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Flex } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader, LoginContainer, SLink, STitle } from "../StartPage.styles";
import { registerUser } from "../../../api/auth";

export const Registration: FC = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const onFinish = async (values: any) => {
    const { email, password } = values;

    try {
      const res = await registerUser(email, password);
      sessionStorage.setItem("userID", `${res.id}`);
      toast.success("Регистрация успешна!");
      setIsRedirecting(true);
      setTimeout(() => navigate("/home"), 1500);
    } catch (error: any) {
      console.error("Ошибка регистрации:", error);
      toast.error("Произошла ошибка при регистрации.");
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
          name="register"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          scrollToFirstError>
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
            rules={[
              { required: true, message: "Введите пароль" },
              { min: 4, message: "Минимальная длина пароля — 4 символа" },
            ]}
            hasFeedback>
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>

          <STitle>Повторите пароль</STitle>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Повторите пароль" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Пароли не совпадают"));
                },
              }),
            ]}>
            <Input.Password placeholder="Повторите пароль" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="primary-button"
            loading={isRedirecting}
            style={{ marginTop: "10px" }}
            block>
            Зарегистрироваться
          </Button>
        </Form>

        <Flex justify="center" style={{ marginTop: "10px" }}>
          <STitle>Уже есть аккаунт?</STitle>
          <SLink href="/signin">Войти</SLink>
        </Flex>
      </LoginContainer>
    </>
  );
};
