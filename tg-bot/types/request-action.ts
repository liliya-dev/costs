/* eslint-disable @typescript-eslint/no-explicit-any */
export enum Method {
  PUT = 'put',
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
}

export interface IAction {
  url: string;
  method?: Method;
  data?: any;
  query?: any;
  timeout?: number;
  contentType?: string;
}

export interface ISuccessResponse<T> {
  statusCode: number;
  data?: T;
  message?: string;
}
