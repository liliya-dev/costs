import axios from 'axios';

import { IAction, ISuccessResponse, Method } from '@/types/request-action';

const BASE_URL = process.env.BASE_URL;

export const axiosPublic = axios.create();

export const apiHelperPublic = async <T>({
  url,
  method = Method.GET,
  data = {},
  query = {},
  timeout = 20000,
}: IAction): Promise<ISuccessResponse<T>> => {
  try {
    const response = await axiosPublic({
      baseURL: BASE_URL,
      url,
      method,
      data,
      params: query,
      timeout,
      paramsSerializer: { indexes: null },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Something went wrong';
    console.log(message);
    return { statusCode: 400, message };
  }
};
