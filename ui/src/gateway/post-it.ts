import { Account, Api, Post } from "../generated/swagger/post-it";

const api = new Api({ baseUrl: "http://localhost/v1" });

const allFields: string[] = [
  "id",
  "title",
  "content",
  "image",
  "creationTime",
  "author",
  "author_image",
];

const register = (
  email: string,
  password: string,
  author: string,
  author_image?: string
): Promise<Account | undefined> => {
  try {
    return api.user
      .register({ email, password, author, author_image })
      .then((response) => response.data.account || undefined);
  } catch (error) {
    const errorMessage = () => {
      if (error instanceof Response) {
        switch (error.status) {
          case 400:
            return "invalid input";
          case 409:
            return "account already exists";
          default:
            break;
        }

        return "something bad happened";
      }
    };
    return Promise.reject(errorMessage());
  }
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
    .then((response) => response.data.posts || []);
};

const createPost = (token: string, post: Post): Promise<Post | undefined> => {
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
