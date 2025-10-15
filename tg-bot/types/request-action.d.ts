export declare enum Method {
    PUT = "put",
    GET = "get",
    POST = "post",
    DELETE = "delete"
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
//# sourceMappingURL=request-action.d.ts.map