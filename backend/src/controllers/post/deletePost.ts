import { Controller, ControllerResponse, Session } from "../helper";
import index from "../..";
import { Posts } from "../../generated/swagger/post-it";
import Api = Posts.DeletePost;
import { controllerWithSession } from "../helper";

const controller: Controller<
  Api.RequestParams,
  Api.RequestQuery,
  Api.RequestHeaders,
  Api.RequestBody,
  Api.ResponseBody
> = controllerWithSession({
  method: "delete",
  path: "/v1/posts/post/:postId",
  handler: async (
    params: Api.RequestParams,
    query: Api.RequestQuery,
    headers: Api.RequestHeaders,
    body: Api.RequestBody,
    session: Session
  ): Promise<ControllerResponse<Api.ResponseBody>> => {
    const post = await index.postDao.getPost(params.postId);

    if (!post) {
      return Promise.resolve({
        code: 404,
        error: "post doesn't exists",
      });
    }

    if (session.email !== post.email) {
      return Promise.resolve({
        code: 403,
        error: "Insufficient permissions",
      });
    }

    const success = await index.postDao.deletePost(params.postId);

    if (!success) {
      return Promise.resolve({
        code: 500,
        error: "couldn't delete post",
      });
    }
    return Promise.resolve({
      code: 204,
    });
  },
});

export default controller;
