import {
  requestWithSupertest,
  createAccountAndToken,
} from "../utils/rest-utils";
import { randText } from "@ngneat/falso";
import { Posts } from "../../src/generated/swagger/post-it";
import { expect } from "chai";
import { randomBase64WithMime } from "../utils/common-utils";

describe("create post rest", () => {
  it("validate authentication", async () => {
    const request: Posts.CreatePost.RequestBody = {
      post: { title: randText(), content: randText() },
    };

    const responseWithInvalidToken = await requestWithSupertest
      .post("/v1/posts/post")
      .set("Authorization", randText())
      .send(request);

    expect(responseWithInvalidToken.statusCode).to.equal(401);
    expect(responseWithInvalidToken.text).to.equal("you need to login first");
  });

  it("invalid image type", async () => {
    const accountDetails = await createAccountAndToken();

    const request: Posts.CreatePost.RequestBody = {
      post: { title: randText(), content: randText(), image: randText() },
    };

    const response = await requestWithSupertest
      .post("/v1/posts/post")
      .set("Authorization", accountDetails.token)
      .send(request);

    expect(response.statusCode).to.equal(400);
    expect(response.text).to.equal("invalid image type");
  });

  it("missing title", async () => {
    const accountDetails = await createAccountAndToken();

    const requestWithOutTitle: Posts.CreatePost.RequestBody = {
      post: { content: randText(), image: randText() },
    };

    const responseWithOutTitle = await requestWithSupertest
      .post("/v1/posts/post")
      .set("Authorization", accountDetails.token)
      .send(requestWithOutTitle);

    expect(responseWithOutTitle.statusCode).to.equal(400);
    expect(responseWithOutTitle.text).to.equal("missing parameter title");
  });

  it("missing content", async () => {
    const accountDetails = await createAccountAndToken();

    const requestWithOutContent: Posts.CreatePost.RequestBody = {
      post: { title: randText(), image: randText() },
    };

    const responseWithOutContent = await requestWithSupertest
      .post("/v1/posts/post")
      .set("Authorization", accountDetails.token)
      .send(requestWithOutContent);

    expect(responseWithOutContent.statusCode).to.equal(400);
    expect(responseWithOutContent.text).to.equal("missing parameter content");
  });

  it("create post successfully", async () => {
    const accountDetails = await createAccountAndToken();

    const request: Posts.CreatePost.RequestBody = {
      post: {
        title: randText(),
        content: randText(),
        image: randomBase64WithMime(),
      },
    };

    const response = await requestWithSupertest
      .post("/v1/posts/post")
      .set("Authorization", accountDetails.token)
      .send(request);

    const responseBody: Posts.CreatePost.ResponseBody = response.body;

    const expectedResponseBody: Posts.CreatePost.ResponseBody = {
      post: {
        id: responseBody.post?.id,
        title: request.post.title,
        content: request.post.content,
        image: request.post.image,
        creationTime: responseBody.post?.creationTime,
        author: accountDetails.author,
      },
    };

    expect(response.statusCode).to.equal(200);
    expect(responseBody).to.deep.equal(expectedResponseBody);
  });
});
