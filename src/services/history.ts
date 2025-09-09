import { ApiResponse } from '../types/api';
import api from './api';

interface TestHistory {
  id: string;
  testId: string;
  score: number;
  completedAt: string;
  // Add other fields as needed
}


export const getTestHistory = async (): Promise<ApiResponse<TestHistory[]>> => {
  try {
    const response = await api.get<ApiResponse<TestHistory[]>>('/user/history');
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}; 