export type QuestionType =
  | "multiple_choice"
  | "long_text"
  | "short_text"
  | "checkbox";

export interface Option {
  id?: string;
  questionId?: string;
  optionText: string;
  optionMediaUrl?: string;
  isOther?: boolean;
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
