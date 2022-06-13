import {
  requestWithSupertest,
  createPostWithToken,
  createAccountAndToken,
} from "../utils/rest-utils";
import { randText } from "@ngneat/falso";
import { Posts } from "../../src/generated/swagger/post-it";
import { expect } from "chai";
import { randomBase64WithMime } from "../utils/common-utils";

describe("edit post rest", () => {
  it("should not be able to edit other people post", async () => {
    const createdPost = await createPostWithToken();
    const otherAccount = await createAccountAndToken();

    const editRequest: Posts.EditPost.RequestBody = {
      post: {},
    };

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const id: number = createdPost.post.id!;

    const response = await requestWithSupertest
      .put(`/v1/posts/post/${id}`)
      .set("Authorization", otherAccount.token)
      .send(editRequest);

    expect(response.statusCode).to.equal(403);
    expect(response.text).to.equal("Insufficient permissions");
  });

  it("invalid image type", async () => {
    const createdPost = await createPostWithToken();
    const editRequest: Posts.EditPost.RequestBody = {
      post: {
        image: randText(),
      },
    };
    const id: number = createdPost.post.id!;
    const response = await requestWithSupertest
      .put(`/v1/posts/post/${id}`)
      .set("Authorization", createdPost.token)
      .send(editRequest);

    expect(response.statusCode).to.equal(400);
    expect(response.text).to.equal("invalid image type");
  });

  it("post doesn't exists", async () => {
    const accountDetails = await createAccountAndToken();
    const editRequest: Posts.EditPost.RequestBody = {
      post: {
        title: randText(),
        content: randText(),
        image: randomBase64WithMime(),
      },
    };

    //need to random number that bigger from the last id in mongo
    const response = await requestWithSupertest
      .put(`/v1/posts/post/-1`)
      .set("Authorization", accountDetails.token)
      .send(editRequest);

    expect(response.statusCode).to.equal(404);
    expect(response.text).to.equal("post doesn't exists");
  });

  it("edit  post successfully", async () => {
    const createdPost = await createPostWithToken();

    const editRequest: Posts.EditPost.RequestBody = {
      post: {
        title: randText(),
        content: randText(),
        image: randomBase64WithMime(),
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const id: number = createdPost.post.id!;
    const response = await requestWithSupertest
      .put(`/v1/posts/post/${id}`)
      .set("Authorization", createdPost.token)
      .send(editRequest);

    const responseBody: Posts.EditPost.ResponseBody = response.body;

    const expectedResponseBody: Posts.EditPost.ResponseBody = {
      post: {
        id: responseBody.post?.id,
        title: editRequest.post?.title || createdPost.post.title,
        content: editRequest.post?.content || createdPost.post.content,
        image: editRequest.post?.image || createdPost.post?.image,
        creationTime: createdPost.post?.creationTime,
        author: createdPost.post.author,
      },
    };

    expect(response.statusCode).to.equal(200);
    expect(responseBody).to.deep.equal(expectedResponseBody);
  });
});
