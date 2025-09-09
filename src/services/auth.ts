import { ApiResponse } from '../types/api';
import api from './api';

interface User {
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    // Store token in localStorage
    // localStorage.setItem('token', res.data.data.token);
    localStorage.setItem('email', res.data.data.user.email);
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getStoredAuth = (): { token: string | null } => {
  const token = localStorage.getItem('token');
  return { token };
};

export const register = async (email: string, password: string): Promise<ApiResponse<null>> => {
  try {
    const res = await api.post<ApiResponse<null>>("/auth/register", { 
      email, 
      password, 
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sentForgotPassword = async (email: string): Promise<ApiResponse<null>> => {
  try {
    const res = await api.post<ApiResponse<null>>("/auth/forgot-password", { 
      email, 
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
  try {
    const res = await api.post<ApiResponse<null>>(`/auth/reset-password`, { 
      token,
      newPassword, 
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}; 