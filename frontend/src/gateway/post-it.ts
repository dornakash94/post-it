import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { Account, Api, Post, HttpResponse } from "../generated/swagger/post-it";
import { logout } from "../store/reducers/user-reducer";

const api = new Api({ baseUrl: "http://localhost:8080/v1" });

const allFields: string[] = [
  "id",
  "title",
  "content",
  "image",
  "creationTime",
  "author",
  "author_image",
];

const dispatchLogout = (dispatch: Dispatch<AnyAction>) => {
  dispatch(logout());
};

const register = (
  email: string,
  password: string,
  author: string,
  author_image?: string
): Promise<Account | undefined> => {
  return api.user
    .register({ email, password, author, author_image })
    .then((response) => response.data.account || undefined)
    .catch((error) => {
      const errorMessage = () => {
        if ((error as HttpResponse<unknown, any>).error) {
          const httpResponse = error as HttpResponse<unknown, any>;

          switch (error.status) {
            case 400:
              return { message: "invalid input", fields: [] };
            case 409:
              return {
                message: "",
                fields: httpResponse.error.fields,
              };
            default:
              break;
          }
        }
        return { message: "invalid input", fields: [] };
      };

      return Promise.reject(errorMessage());
    });
};

const login = (
  email: string,
  password: string
): Promise<Account | undefined> => {
  try {
    return api.user
      .login({ email, password })
      .then((response) => response.data.account || undefined);
  } catch (error) {
    const errorMessage = () => {
      if (error instanceof Response) {
        switch (error.status) {
          case 400:
            return "invalid input";
          case 401:
            return "failed login";
          case 409:
            return "Too many requests";
          default:
            break;
        }
      }

      return "something bad happened";
    };

    return Promise.reject(errorMessage());
  }
};

const getAllPosts = (
  dispatch: Dispatch<AnyAction>,
  token: string,
  pageNumber: number,
  pageSize: number,
  fromId = 0 as number
): Promise<Post[]> => {
  return api.posts
    .getAllPosts(
      {
        "page-number": pageNumber,
        "page-size": pageSize,
        "field-mask": allFields,
        "from-id": fromId,
      },
      { headers: { Authorization: token } }
    )
    .then((response) => response.data.posts || [])
    .catch((error) => {
      if (error instanceof Response) {
        switch (error.status) {
          case 401:
            dispatchLogout(dispatch);
            break;
          default:
            break;
        }
      }

      return Promise.reject(error);
    });
};

const createPost = (
  dispatch: Dispatch<AnyAction>,
  token: string,
  post: Post
): Promise<Post | undefined> => {
  try {
    return api.posts
      .createPost(
        {
          post,
        },
        { headers: { Authorization: token } }
      )
      .then((response) => response.data.post || undefined);
  } catch (error) {
    const errorMessage = () => {
      if (error instanceof Response) {
        switch (error.status) {
          case 401:
            dispatchLogout(dispatch);
            break;
          case 400:
            return "invalid input";
          default:
            break;
        }
      }
      return "something bad happened";
    };
    return Promise.reject(errorMessage());
  }
};
const deletePost = (post_id: number, token: string): Promise<void> => {
  return api.posts
    .deletePost(post_id, { headers: { Authorization: token } })
    .then();
};
const editPost = (
  dispatch: Dispatch<AnyAction>,
  post_id: number,
  post: Post,
  token: string
): Promise<Post | undefined> => {
  try {
    return api.posts
      .editPost(post_id, { post }, { headers: { Authorization: token } })
      .then((response) => response.data.post || undefined);
  } catch (error) {
    const errorMessage = () => {
      if (error instanceof Response) {
        switch (error.status) {
          case 401:
            dispatchLogout(dispatch);
            break;
          case 400:
            return "invalid input";
          default:
            break;
        }
      }
      return "something bad happened";
    };
    return Promise.reject(errorMessage());
  }
};
export const apiWrapper = {
  user: {
    login,
    register,
  },
  posts: {
    getAllPosts,
    createPost,
    deletePost,
    editPost,
  },
};
