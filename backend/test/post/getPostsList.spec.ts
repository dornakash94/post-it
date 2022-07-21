import { createPostWithToken, requestWithSupertest } from "../utils/rest-utils";
import { Posts } from "../../src/generated/swagger/post-it";
import { expect } from "chai";
import { randNumber, randText } from "@ngneat/falso";
import { allFields } from "../../src/mappers/post-mappers";

describe("get post list rest", () => {
  it("get all posts successfully", async () => {
    const createdPost = await createPostWithToken();
    const createdAnotherPost = await createPostWithToken();

    const fieldMaskString = Array.from(allFields)
      .map((field) => `field-mask=${field}`)
      .join("&");

    const response = await requestWithSupertest
      .get(`/v1/posts/list`)
      .query(fieldMaskString)
      .set("Authorization", createdPost.token);

    const responseBody: Posts.GetAllPosts.ResponseBody = {
      posts: [response.body.posts[0], response.body.posts[1]],
    };

    const expectedResponseBody: Posts.GetAllPosts.ResponseBody = {
      posts: [
        {
          id: createdAnotherPost.post.id,
          title: createdAnotherPost.post.title,
          content: createdAnotherPost.post.content,
          image: createdAnotherPost.post.image,
          author: createdAnotherPost.post.author,
          author_image: createdAnotherPost.post.author_image,
          creationTime: createdAnotherPost.post.creationTime,
        },
        {
          id: createdPost.post.id,
          title: createdPost.post.title,
          content: createdPost.post.content,
          image: createdPost.post.image,
          author: createdPost.post.author,
          author_image: createdPost.post.author_image,
          creationTime: createdPost.post.creationTime,
        },
      ],
    };

    expect(response.statusCode).to.equal(200);
    expect(responseBody).to.deep.equal(expectedResponseBody);

    const responseFromId = await requestWithSupertest
      .get("/v1/posts/list")
      .query(`from-id=${createdPost.post.id}`)
      .query(fieldMaskString)
      .set("Authorization", createdPost.token);

    const responseFromIdBody: Posts.GetAllPosts.ResponseBody =
      responseFromId.body;
    const expectedResponseFromIdBody: Posts.GetAllPosts.ResponseBody = {
      posts: [
        {
          id: createdAnotherPost.post.id,
          title: createdAnotherPost.post.title,
          content: createdAnotherPost.post.content,
          image: createdAnotherPost.post.image,
          author: createdAnotherPost.post.author,
          author_image: createdAnotherPost.post.author_image,
          creationTime: createdAnotherPost.post.creationTime,
        },
      ],
    };

    expect(responseFromId.statusCode).to.equal(200);
    expect(responseFromIdBody).to.deep.equal(expectedResponseFromIdBody);
  });

  it("invalid authentication", async () => {
    const responseWithInvalidToken = await requestWithSupertest
      .get(`/v1/posts/post/${randNumber()}`)
      .set("authorization", randText());

    expect(responseWithInvalidToken.statusCode).to.equal(401);
    expect(responseWithInvalidToken.text).to.equal("you need to login first");
  });
});
