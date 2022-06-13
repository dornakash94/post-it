import { createPostWithToken, requestWithSupertest } from "../utils/rest-utils";
import { Posts } from "../../src/generated/swagger/post-it";
import { expect } from "chai";
import { randNumber, randText } from "@ngneat/falso";

describe("get post list rest", () => {
  it("get all posts successfully", async () => {
    const createdPost = await createPostWithToken();
    const createdAnotherPost = await createPostWithToken();

    const response = await requestWithSupertest
      .get("/v1/posts/list")
      .set("Authorization", createdPost.token);

    const responseBody: Posts.GetAllPosts.ResponseBody = {
      postsSummaries: [
        response.body.postsSummaries[0],
        response.body.postsSummaries[1],
      ],
    };

    const expectedResponseBody: Posts.GetAllPosts.ResponseBody = {
      postsSummaries: [
        {
          id: createdAnotherPost.post.id,
          title: createdAnotherPost.post.title,
          author: createdAnotherPost.post.author,
        },
        {
          id: createdPost.post.id,
          title: createdPost.post.title,
          author: createdPost.post.author,
        },
      ],
    };

    expect(response.statusCode).to.equal(200);
    expect(responseBody).to.deep.equal(expectedResponseBody);

    const responseFromId = await requestWithSupertest
      .get("/v1/posts/list")
      .query(`from-id=${createdPost.post.id}`)
      .set("Authorization", createdPost.token);

    const responseFromIdBody: Posts.GetAllPosts.ResponseBody =
      responseFromId.body;
    const expectedResponseFromIdBody: Posts.GetAllPosts.ResponseBody = {
      postsSummaries: [
        {
          id: createdAnotherPost.post.id,
          title: createdAnotherPost.post.title,
          author: createdAnotherPost.post.author,
        },
      ],
    };

    expect(responseFromId.statusCode).to.equal(200);
    expect(responseFromIdBody).to.deep.equal(expectedResponseFromIdBody);
  });

  it("invalid authentication", async () => {
    const responseWithInvalidToken = await requestWithSupertest
      .get("/v1/posts/post/" + randNumber())
      .set("authorization", randText());

    expect(responseWithInvalidToken.statusCode).to.equal(401);
    expect(responseWithInvalidToken.text).to.equal("you need to login first");
  });
});
