// src/services/api.ts

import axios, { AxiosError } from 'axios';

const AUTH_TOKEN_KEY = 'token';

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

function createApiClient() {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  api.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (typeof window !== 'undefined') {
        if (error.response?.status === 401) {
          console.error('Erro 401: Token inválido ou expirado.');
          removeAuthToken(); 
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    },
  );

  return api;
}

export const api = createApiClient();