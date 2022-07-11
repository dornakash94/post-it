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
