import index from "../../src/";
import supertest from "supertest";
import { randEmail, randPassword, randFullName, randText } from "@ngneat/falso";
import { User, Post, Posts } from "../../src/generated/swagger/post-it";
import { randomBase64WithMime } from "./common-utils";

export const requestWithSupertest = supertest(index.app);

export const createAccountAndToken = async (): Promise<AccountDetails> => {
  const registerRequest: User.Register.RequestBody = {
    email: randEmail(),
    password: randPassword(),
    author: randFullName(),
    author_image: randomBase64WithMime(),
  };

  const registerResponse = await requestWithSupertest
    .post("/v1/user/register")
    .send(registerRequest);

  const registerResponseBody: User.Register.ResponseBody =
    registerResponse.body;

  return {
    ...registerRequest,
    token: registerResponseBody.account?.token || "",
  };
};

interface AccountDetails {
  email: string;
  password: string;
  author: string;
  author_image?: string;
  token: string;
}
export const createPostWithToken = async (): Promise<PostDetail> => {
  const accountDetails = await createAccountAndToken();
  const cratePostRequest: Posts.CreatePost.RequestBody = {
    post: {
      title: randText(),
      content: randText(),
      image: randomBase64WithMime(),
    },
  };
  const post = await requestWithSupertest
    .post("/v1/posts/post")
    .set("Authorization", accountDetails.token)
    .send(cratePostRequest);

  const createPostResponseBody: Posts.CreatePost.ResponseBody = post.body;

  return {
    post: createPostResponseBody.post || {},
    token: accountDetails.token,
  };
};
interface PostDetail {
  post: Post;
  token: string;
}
