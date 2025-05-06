import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import App from "./App";
import TablesList from "./components/tablesList/TablesList";
import Registration from "./components/profilePage/Registration";
import Login from "./components/profilePage/Login";
import StartPage from "./components/profilePage/StartPage";
import PrivateRoute from "./PrivateRoute";
import HomePage from "./components/homePage/HomePage";
import SurveyCreatorPage from "./components/createSurveyPage/createSurveyPage";
import SurveyPreviewWrapper from "./components/createSurveyPage/preview/SurveyPreviewWrapper";
import SurveyResults from "./components/surveyResults/SurveyResults";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "survey/:surveyId",
        element: <SurveyCreatorPage />,
      },
      {
        path: "surveyPreview/:surveyId",
        element: <SurveyPreviewWrapper />,
      },
      {
        path: "/surveyResults/:surveyId",
        element: <SurveyResults />,
      },
    ],
  },
  {
    path: "/signin",
    element: <StartPage />,
    children: [
      {
        path: "",
        element: <Navigate to="autorizate" replace />,
      },
      {
        path: "autorizate",
        element: <Login />,
      },
      {
        path: "registrate",
        element: <Registration />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
