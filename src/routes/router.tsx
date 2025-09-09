import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { paths } from "./paths";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/CreatorPages/Home";
import Callback from '../pages/AuthPages/Callback';
import ErrorPage from "../pages/Error";
import SurveyEditorPage from '../pages/CreatorPages/SurveyEditorPage';
import SurveyResult from '../pages/CreatorPages/SurveyResult';
import SurveyPreviewPage from '../pages/SurveyPreviewPage';
import { AppState, useAuth0 } from "@auth0/auth0-react";
import LoadingPage from '../pages/LoadingPage';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Chỉ cho phép truy cập nếu đã đăng nhập
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: window.location.pathname + window.location.search,
        }
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || !isAuthenticated) return <LoadingPage />; // hoặc loading spinner
  
  return <>{children}</>;
};

interface Route {
  path: string;
  element: React.ReactNode;
}

const creatorPages: Route[] = [
  { path: "/", element: <Home /> },
  { path: paths.createSurvey, element: <SurveyEditorPage /> },
  { path: paths.surveyEditor, element: <SurveyEditorPage /> },
  { path: paths.surveyResult, element: <SurveyResult /> },
];
  
const authPages: Route[] = [
  // { path: paths.login, element: <Login /> },
  { path: paths.authCallback, element: <Callback /> },
];

const router = createBrowserRouter([
  {
    path: paths.root,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: creatorPages,
  },
  // {
  //   path: paths.root,
  //   element: (
  //     <MainLayout />
  //   ),
  //   errorElement: <ErrorPage />,
  //   children: creatorPages,
  // },
  // ...authPages.map(({ path, element }) => ({
  //   path,
  //   element: <AuthRedirectRoute>{element}</AuthRedirectRoute>,
  // })),
  ...authPages.map(({ path, element }) => ({
    path,
    element: element,
  })),
  {
    path: paths.surveyPreview,
    element: <SurveyPreviewPage />,
  },
  {
    path: paths.surveyPreviewWithId,
    element: <SurveyPreviewPage />,
  }
]);

export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
}; 