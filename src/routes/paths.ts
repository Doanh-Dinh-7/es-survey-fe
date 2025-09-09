interface Paths {
  root: string;
  login: string;
  register: string;
  forgotPassword: string;
  resetPassword: string;
  createSurvey: string;
  surveyEditor: string;
  surveyResult: string;
  surveyPreview: string;
  surveyPreviewWithId: string;
  authCallback: string;
}

export const paths: Paths = {
  root: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  createSurvey: "/create-survey",
  surveyEditor: "/survey-editor",
  surveyResult: "/survey-result/:id",
  surveyPreview: "/survey-preview",
  surveyPreviewWithId: "/survey-preview/:id",
  authCallback: "/auth/callback"
};

