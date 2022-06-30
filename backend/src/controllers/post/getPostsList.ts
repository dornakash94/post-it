import { Controller, ControllerResponse, Session } from "../helper";
import index from "../..";
import { Posts } from "../../generated/swagger/post-it";
import Api = Posts.GetAllPosts;
import { controllerWithSession } from "../helper";
import {
  mapPostDtosToPosts,
  mapPostToPostSummary,
} from "../../mappers/post-mappers";

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
    //TODO - throttle so user wont try to spam us
    const postsDtos = await index.postDao.getAllPosts(
      query["page-size"] || 30,
      query["page-number"] || 0,
      query["from-id"] || 0
    );

    const posts = await mapPostDtosToPosts(postsDtos);
    const postsSummaries = mapPostToPostSummary(posts);

    const response: Api.ResponseBody = {
      postsSummaries,
    };
    return Promise.resolve({
      body: response,
      code: 200,
    });
  },
});

export default controller;
