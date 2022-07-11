import index from "../";
import isBase64 from "is-base64";

export interface ControllerResponse<Response> {
  body?: Response;
  code?: number;
  error?: unknown;
}

export type Method =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export interface Controller<Params, Query, Headers, Body, ResponseBody> {
  method: Method;
  path: string;
  handler: (
    params: Params,
    query: Query,
    headers: Headers,
    body: Body
  ) => Promise<ControllerResponse<ResponseBody>>;
}

interface ControllerWithSession<Params, Query, Headers, Body, ResponseBody> {
  method: Method;
  path: string;
  handler: (
    params: Params,
    query: Query,
    headers: Headers,
    body: Body,
    session: Session
  ) => Promise<ControllerResponse<ResponseBody>>;
}

export interface Session {
  email: string;
}

export const controllerWithSession = <
  Params,
  Query,
  Headers extends { authorization: string },
  Body,
  ResponseBody
>(
  controller: ControllerWithSession<Params, Query, Headers, Body, ResponseBody>
): Controller<Params, Query, Headers, Body, ResponseBody> => {
  return {
    method: controller.method,
    path: controller.path,
    handler: async (
      params: Params,
      query: Query,
      headers: Headers,
      body: Body
    ): Promise<ControllerResponse<ResponseBody>> => {
      const session = index.jwtInstance.readToken(headers.authorization);

      if (!session) {
        return Promise.resolve({
          code: 401,
          error: "you need to login first",
        });
      }

      return controller.handler(params, query, headers, body, session);
    },
  };
};

const throwError = (code: number, error: string) => {
  throw { code, error };
};

export const validateBase64Image = (base64Str?: string): void => {
  if (base64Str && !isBase64(base64Str, { mimeRequired: true })) {
    throwError(400, "invalid image type");
  }
};

export const validateMandatoryParam = <T>(paramName: string, value?: T) => {
  if (typeof value === "undefined" || value === null)
    throwError(400, `missing parameter ${paramName}`);
};

export const asArr = <T>(something: T[] | undefined): T[] | undefined => {
  if (!something) return undefined;
  if (!Array.isArray(something)) return [something];
  return something;
};
