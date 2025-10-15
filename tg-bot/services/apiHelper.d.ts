import 'dotenv/config';
export declare enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
export declare function apiHelperPublic<T>(config: {
    url: string;
    method: Method;
    data?: unknown;
    params?: unknown;
    headers?: Record<string, string>;
}): Promise<T>;
//# sourceMappingURL=apiHelper.d.ts.map