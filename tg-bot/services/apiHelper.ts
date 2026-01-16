import axios, { type AxiosRequestConfig } from 'axios';
import 'dotenv/config';

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface ApiResponse<T> {
  data: T;
}

const API_BASE_URL = process.env.BASE_URL || 'http://localhost:4000/api';

export async function apiHelperPublic<T>(config: {
  url: string;
  method: Method;
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
}): Promise<T> {
  console.log(`${API_BASE_URL}/${config.url}`);
  const axiosConfig: AxiosRequestConfig = {
    url: `${API_BASE_URL}/${config.url}`,
    method: config.method,
    data: config.data,
    params: config.params,
    headers: {
      'Content-Type': 'application/json',
      ...(config.headers || {}),
    },
  };

  try {
    const response = await axios<ApiResponse<T>>(axiosConfig);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('❌ API request failed:', {
        url: config.url,
        method: config.method,
        message: error.response?.data || error.message,
      });

      throw new Error(
        typeof error.response?.data === 'string' ? error.response.data : error.message,
      );
    }
    console.error('❌ Unexpected error:', error);
    throw new Error('Unexpected error occurred');
  }
}
