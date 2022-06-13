import {
  requestWithSupertest,
  createPostWithToken,
  createAccountAndToken,
} from "../utils/rest-utils";
import { expect } from "chai";

describe("delete post rest", () => {
  it("should not be able to delete other people post", async () => {
    const createdPost = await createPostWithToken();
    const otherAccount = await createAccountAndToken();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const id: number = createdPost.post.id!;
    const token = otherAccount.token;
    const response = await requestWithSupertest
      .delete(`/v1/posts/post/${id}`)
      .set("Authorization", token);

    expect(response.statusCode).to.equal(403);
    expect(response.text).to.equal("Insufficient permissions");
  });

  it("post doesn't exists", async () => {
    const accountDetails = await createAccountAndToken();

    const response = await requestWithSupertest
      .delete(`/v1/posts/post/-1`)
      .set("Authorization", accountDetails.token);

    expect(response.statusCode).to.equal(404);
    expect(response.text).to.equal("post doesn't exists");
  });

  it("delete  post successfully", async () => {
    const createdPost = await createPostWithToken();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const id: number = createdPost.post.id!;
    const response = await requestWithSupertest
      .delete(`/v1/posts/post/${id}`)
      .set("Authorization", createdPost.token);

    expect(response.statusCode).to.equal(204);

    const responseAfterDelete = await requestWithSupertest
      .get(`/v1/posts/post/${id}`)
      .set("Authorization", createdPost.token);

    expect(responseAfterDelete.statusCode).to.equal(404);
    expect(responseAfterDelete.text).to.equal("post doesn't exists");
  });
});
