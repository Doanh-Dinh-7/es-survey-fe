import { Question, Survey, SurveySettings } from "../types/question.types";
import api from "./api";

export interface CreateSurveyRequest {
  title: string;
  description: string;
  surveyMediaUrl?: string;
  isTemplate?: Boolean;
  questions: Question[];
  settings: SurveySettings;
  deletedOptionMediaUrls?: string[];
}

export interface SubmitSurveyPayload {
  answers: any;
  userEmail?: string;
}

export const getAllSurveys = async (page: number = 1, pageSize: number = 9) => {
  try {
    const response = await api.get("/surveys/my", {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting surveys:", error);
    throw error;
  }
};

export const createSurvey = async (
  survey: CreateSurveyRequest,
  deletedOptionMediaUrls?: string[]
) => {
  try {
    const payload = deletedOptionMediaUrls
      ? { ...survey, deletedOptionMediaUrls }
      : survey;
    const response = await api.post("/surveys", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};

export const getSurvey = async (surveyId: string) => {
  try {
    const response = await api.get(`/surveys/${surveyId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting survey:", error);
    throw error;
  }
};

export const updateSurvey = async (
  surveyId: string,
  survey: Survey,
  deletedOptionMediaUrls?: string[]
) => {
  try {
    const payload = deletedOptionMediaUrls
      ? { ...survey, deletedOptionMediaUrls }
      : survey;
    const response = await api.patch(`/surveys/${surveyId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating survey:", error);
    throw error;
  }
};

export const updateSurveySetting = async (
  surveySettings: SurveySettings,
  surveyId: string
) => {
  try {
    const response = await api.put(
      `/surveys/${surveyId}/settings`,
      surveySettings
    );
    return response.data;
  } catch (error) {
    console.error("Error cloning survey:", error);
    throw error;
  }
};

export const deleteSurvey = async (surveyId: string) => {
  try {
    const response = await api.delete(`/surveys/${surveyId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting survey:", error);
    throw error;
  }
};

export const cloneSurvey = async (surveyId: string) => {
  try {
    const response = await api.post(`/surveys/${surveyId}/clone`);
    return response.data;
  } catch (error) {
    console.error("Error cloning survey:", error);
    throw error;
  }
};

export const changeStatusSurvey = async (
  surveyId: string,
  channels?: string[],
  message?: string
) => {
  try {
    const response = await api.patch(`/surveys/${surveyId}/status`, {
      channels,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error changing status survey:", error);
    throw error;
  }
};

export const statisticsSurvey = async (surveyId: string) => {
  try {
    const response = await api.get(`/surveys/${surveyId}/statistics`);
    return response.data;
  } catch (error) {
    console.error("Error getting statistic survey:", error);
    throw error;
  }
};

export const ListResponseDetailSurvey = async (surveyId: string) => {
  try {
    const response = await api.get(`/surveys/${surveyId}/responses`);
    return response.data;
  } catch (error) {
    console.error("Error getting list response detail survey:", error);
    throw error;
  }
};

export const getSurveyById = async (surveyId: string) => {
  try {
    const response = await api.get(`/surveys/${surveyId}/public`);
    return response.data;
  } catch (error) {
    console.error("Error getting survey by id:", error);
    throw error;
  }
};

export const SubmitSurvey = async (
  surveyId: string,
  payload: SubmitSurveyPayload
) => {
  try {
    const response = await api.post(`/surveys/${surveyId}/responses`, payload);
    return response.data;
  } catch (error) {
    console.error("Error submitting survey:", error);
    throw error;
  }
};

export const aiAnalysis = async (surveyId: string) => {
  try {
    const response = await api.post(
      `/surveys/${surveyId}/analysis?provider=ollama`
    );
    return response.data;
  } catch (error) {
    console.error("Error ai analysis:", error);
    throw error;
  }
};

export const getTemplateSurveys = async () => {
  try {
    const response = await api.get(`/surveys/templates`);
    return response.data;
  } catch (error) {
    console.error("Error getting template surveys:", error);
    throw error;
  }
};

export const createTemplate = async (survey: CreateSurveyRequest) => {
  try {
    const response = await api.post("/surveys/templates", survey);
    return response.data;
  } catch (error) {
    console.error("Error creating survey template:", error);
    throw error;
  }
};

// Slack integration APIs
export const getSlackChannels = async () => {
  try {
    const response = await api.get("/slack/channels");
    return response.data;
  } catch (error) {
    console.error("Error getting Slack channels:", error);
    throw error;
  }
};

export const sendSlackNotification = async (payload: {
  surveyId: string;
  channels?: string[];
  message: string;
}) => {
  try {
    const response = await api.post("/slack/notify-survey", payload);
    return response.data;
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    throw error;
  }
};

export const deleteResponse = async (surveyId: string, responseId: string) => {
  try {
    const response = await api.delete(
      `/surveys/${surveyId}/responses/${responseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting response:", error);
    throw error;
  }
};
