export type QuestionType =
  | "multiple_choice"
  | "long_text"
  | "short_text"
  | "checkbox"
  | "matrix_choice"
  | "matrix_input";

export interface Option {
  id?: string;
  questionId?: string;
  optionText: string;
  optionMediaUrl?: string;
  isOther?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MatrixRow {
  id?: string;
  questionId?: string;
  label: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MatrixColumn {
  id?: string;
  questionId?: string;
  label: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MatrixAnswer {
  id?: string;
  answerId?: string;
  rowId: string;
  columnId?: string;
  inputValue?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id?: string;
  tempId?: string;
  surveyId?: string;
  type: QuestionType;
  questionText: string;
  isRequired: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  options: Option[];
  questionMediaUrl?: string;
  matrixRows?: MatrixRow[];
  matrixColumns?: MatrixColumn[];
}

export interface SurveySettings {
  id?: string;
  surveyId?: string;
  openTime: string | null;
  closeTime: string | null;
  maxResponse: number | null;
  autoCloseCondition: "manual" | "by_time" | "by_response";
  requireEmail: boolean;
  allowMultipleResponses: boolean;
  responseLetter: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Survey {
  id?: string;
  title: string;
  description: string;
  status?: "DRAFT" | "PENDING" | "PUBLISHED" | "CLOSED";
  aiAnalysis?: any;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  closedAt?: string | null;
  userId?: string;
  questions?: Question[];
  settings?: SurveySettings;
  surveyMediaUrl?: string;
}

export interface SurveyAnswer {
  questionId: string;
  answer: string;
  customText?: string;
  matrixAnswers?: MatrixAnswer[];
}
