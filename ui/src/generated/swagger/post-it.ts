/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginResponse {
  account?: Account;
}

export interface RegisterResponse {
  account?: Account;
}

export interface GetAllPostsResponse {
  posts?: Post[];
}

export interface GetPostResponse {
  post?: Post;
}

export interface CreatePostResponse {
  post?: Post;
}

export interface EditPostResponse {
  post?: Post;
}

export interface Account {
  token?: string;
  author?: string;
  author_image?: string;
}

export interface Post {
  /** @format int64 */
  id?: number;
  title?: string;
  content?: string;
  image?: string;

  /** @format int64 */
  creationTime?: number;
  author?: string;
  author_image?: string;
}

export interface LoginPayload {
  /** @format email */
  email: string;
  password: string;
}

export interface RegisterPayload {
  /** @format email */
  email: string;
  password: string;
  author: string;
  author_image?: string;
}

export interface GetAllPostsParams {
  /**
   * current page
   * @min 0
   */
  "page-number"?: number;

  /**
   * Page size
   * @min 1
   * @max 50
   */
  "page-size"?: number;

  /**
   * filter using from id
   * @format int64
   */
  "from-id"?: number;
  "field-mask"?: string[];
}

export interface CreatePostPayload {
  post: Post;
}

export interface EditPostPayload {
  post?: Post;
}

export namespace User {
  /**
   * No description
   * @tags user
   * @name Login
   * @summary login if the email exists
   * @request POST:/user/login
   */
  export namespace Login {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginPayload;
    export type RequestHeaders = {};
    export type ResponseBody = LoginResponse;
  }
  /**
   * No description
   * @tags user
   * @name Register
   * @summary create new user
   * @request POST:/user/register
   */
  export namespace Register {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterPayload;
    export type RequestHeaders = {};
    export type ResponseBody = RegisterResponse;
  }
}

export namespace Posts {
  /**
   * No description
   * @tags post
   * @name GetAllPosts
   * @summary the list of the posts
   * @request GET:/posts/list
   */
  export namespace GetAllPosts {
    export type RequestParams = {};
    export type RequestQuery = {
      "page-number"?: number;
      "page-size"?: number;
      "from-id"?: number;
      "field-mask"?: string[];
    };
    export type RequestBody = {};
    export type RequestHeaders = { authorization: string };
    export type ResponseBody = GetAllPostsResponse;
  }
  /**
   * No description
   * @tags post
   * @name CreatePost
   * @summary create a new post
   * @request POST:/posts/post
   */
  export namespace CreatePost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreatePostPayload;
    export type RequestHeaders = { authorization: string };
    export type ResponseBody = CreatePostResponse;
  }
  /**
   * No description
   * @tags post
   * @name GetPost
   * @summary the specific post
   * @request GET:/posts/post/{post-id}
   */
  export namespace GetPost {
    export type RequestParams = { postId: number };
    export type RequestQuery = {};
    export type RequestBody = {};
    export type RequestHeaders = { authorization: string };
    export type ResponseBody = GetPostResponse;
  }
  /**
   * No description
   * @tags post
   * @name EditPost
   * @summary edit the post
   * @request PUT:/posts/post/{post-id}
   */
  export namespace EditPost {
    export type RequestParams = { postId: number };
    export type RequestQuery = {};
    export type RequestBody = EditPostPayload;
    export type RequestHeaders = { authorization: string };
    export type ResponseBody = EditPostResponse;
  }
  /**
   * No description
   * @tags post
   * @name DeletePost
   * @summary delete post by id
   * @request DELETE:/posts/post/{post-id}
   */
  export namespace DeletePost {
    export type RequestParams = { postId: number };
    export type RequestQuery = {};
    export type RequestBody = {};
    export type RequestHeaders = { authorization: string };
    export type ResponseBody = void;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === "number" ? value : `${value}`
    )}`;
  }

  private addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${
        queryString ? `?${queryString}` : ""
      }`,
      {
        ...requestParams,
        headers: {
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
          ...(requestParams.headers || {}),
        },
        signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title post-it service
 * @version 1.0.0
 * @license Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0.html)
 * @baseUrl /v1
 * @contact <dornakash94@gmail.com>
 *
 * post-it service
 */
export class Api<
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
  user = {
    /**
     * No description
     *
     * @tags user
     * @name Login
     * @summary login if the email exists
     * @request POST:/user/login
     */
    login: (LoginRequest: LoginPayload, params: RequestParams = {}) =>
      this.request<LoginResponse, void>({
        path: `/user/login`,
        method: "POST",
        body: LoginRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name Register
     * @summary create new user
     * @request POST:/user/register
     */
    register: (RegisterRequest: RegisterPayload, params: RequestParams = {}) =>
      this.request<RegisterResponse, void>({
        path: `/user/register`,
        method: "POST",
        body: RegisterRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  posts = {
    /**
     * No description
     *
     * @tags post
     * @name GetAllPosts
     * @summary the list of the posts
     * @request GET:/posts/list
     */
    getAllPosts: (query: GetAllPostsParams, params: RequestParams = {}) =>
      this.request<GetAllPostsResponse, void>({
        path: `/posts/list`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags post
     * @name CreatePost
     * @summary create a new post
     * @request POST:/posts/post
     */
    createPost: (
      CreatePostRequest: CreatePostPayload,
      params: RequestParams = {}
    ) =>
      this.request<CreatePostResponse, void>({
        path: `/posts/post`,
        method: "POST",
        body: CreatePostRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags post
     * @name GetPost
     * @summary the specific post
     * @request GET:/posts/post/{post-id}
     */
    getPost: (postId: number, params: RequestParams = {}) =>
      this.request<GetPostResponse, void>({
        path: `/posts/post/${postId}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags post
     * @name EditPost
     * @summary edit the post
     * @request PUT:/posts/post/{post-id}
     */
    editPost: (
      postId: number,
      EditPostRequest: EditPostPayload,
      params: RequestParams = {}
    ) =>
      this.request<EditPostResponse, void>({
        path: `/posts/post/${postId}`,
        method: "PUT",
        body: EditPostRequest,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags post
     * @name DeletePost
     * @summary delete post by id
     * @request DELETE:/posts/post/{post-id}
     */
    deletePost: (postId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/posts/post/${postId}`,
        method: "DELETE",
        type: ContentType.Json,
        ...params,
      }),
  };
}
