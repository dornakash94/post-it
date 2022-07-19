import { Controller, ControllerResponse, Session } from "../helper";
import index from "../..";
import { Posts } from "../../generated/swagger/post-it";
import Api = Posts.GetPost;
import { controllerWithSession } from "../helper";
import { mapPostDtoToPost } from "../../mappers/post-mappers";

const controller: Controller<
  Api.RequestParams,
  Api.RequestQuery,
  Api.RequestHeaders,
  Api.RequestBody,
  Api.ResponseBody
> = controllerWithSession({
  method: "get",
  path: "/v1/posts/post/:postId",
  handler: async (
    params: Api.RequestParams,
    query: Api.RequestQuery,
    headers: Api.RequestHeaders,
    body: Api.RequestBody,
    session: Session
  ): Promise<ControllerResponse<Api.ResponseBody>> => {
    const postDto = await index.postDao.getPost(params.postId);

    if (!postDto) {
      return Promise.resolve({
        code: 404,
        error: "post doesn't exists",
      });
    }

    const post = await mapPostDtoToPost(postDto);

    const response: Api.ResponseBody = {
      post,
    };

    return Promise.resolve({
      body: response,
      code: 200,
    });
  },
});

export default controller;
