import "antd/dist/reset.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import { Registration } from "./components/profilePage/components";
import { StartPage } from "./components/profilePage";
import PrivateRoute from "./PrivateRoute";
import { HomePage } from "./components/homePage";
import SurveyCreatorPage from "./components/createSurveyPage/createSurveyPage";
import SurveyPreviewWrapper from "./components/createSurveyPage/preview/SurveyPreviewWrapper";
import SurveyResults from "./components/surveyResults/SurveyResults";
import EmbedSurvey from "./components/embedSurvey/EmbedSurvey";
import { Login } from "./components/profilePage/components";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/embed/:surveyId",
    element: <EmbedSurvey />,
  },
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
