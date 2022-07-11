import { asArr, Controller, ControllerResponse, Session } from "../helper";
import index from "../..";
import { Posts } from "../../generated/swagger/post-it";
import Api = Posts.GetAllPosts;
import { controllerWithSession } from "../helper";
import { mapPostDtosToPosts } from "../../mappers/post-mappers";

const controller: Controller<
  Api.RequestParams,
  Api.RequestQuery,
  Api.RequestHeaders,
  Api.RequestBody,
  Api.ResponseBody
> = controllerWithSession({
  method: "get",
  path: "/v1/posts/list",
  handler: async (
    params: Api.RequestParams,
    query: Api.RequestQuery,
    headers: Api.RequestHeaders,
    body: Api.RequestBody,
    session: Session
  ): Promise<ControllerResponse<Api.ResponseBody>> => {
    const postsDtos = await index.postDao.getAllPosts(
      query["page-size"] || 30,
      query["page-number"] || 0,
      query["from-id"] || 0
    );

    const fieldMaskSet: Set<string> = new Set(asArr(query["field-mask"]));

    const posts = await mapPostDtosToPosts(postsDtos, fieldMaskSet);

    const response: Api.ResponseBody = {
      posts,
    };
    return Promise.resolve({
      body: response,
      code: 200,
    });
  },
});

export default controller;
