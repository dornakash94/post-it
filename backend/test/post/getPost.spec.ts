import {
  createPostWithToken,
  requestWithSupertest,
  createAccountAndToken,
} from "../utils/rest-utils";
import { Posts } from "../../src/generated/swagger/post-it";
import { expect } from "chai";
import { randText } from "@ngneat/falso";

describe("get post rest", () => {
  it("get post successfully", async () => {
    const createdPost = await createPostWithToken();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const id: number = createdPost.post.id!;
    const response = await requestWithSupertest
      .get(`/v1/posts/post/${id}`)
      .set("Authorization", createdPost.token);

    const responseBody: Posts.GetPost.ResponseBody = response.body;

    const expectedResponseBody: Posts.GetPost.ResponseBody = {
      post: {
        id,
        title: createdPost.post.title,
        content: createdPost.post.content,
        image: createdPost.post?.image,
        creationTime: createdPost.post?.creationTime,
        author: createdPost.post.author,
        author_image: createdPost.post.author_image,
      },
    };

    expect(response.statusCode).to.equal(200);
    expect(responseBody).to.deep.equal(expectedResponseBody);
  });

  it("post doesn't exists", async () => {
    const createdAccount = await createAccountAndToken();
    const response = await requestWithSupertest
      .get(`/v1/posts/post/-1`)
      .set("Authorization", createdAccount.token);

    expect(response.statusCode).to.equal(404);
    expect(response.text).to.equal("post doesn't exists");
  });

  it("invalid authentication", async () => {
    const responseWithInvalidToken = await requestWithSupertest
      .get(`/v1/posts/post/-1`)
      .set("authorization", randText());

    expect(responseWithInvalidToken.statusCode).to.equal(401);
    expect(responseWithInvalidToken.text).to.equal("you need to login first");
  });
});
