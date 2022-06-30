import {
  Controller,
  ControllerResponse,
  Session,
  validateBase64Image,
  controllerWithSession,
} from "../helper";
import index from "../..";
import { Posts } from "../../generated/swagger/post-it";
import { mapPostDtoToPost } from "../../mappers/post-mappers";
import Api = Posts.EditPost;

const controller: Controller<
  Api.RequestParams,
  Api.RequestQuery,
  Api.RequestHeaders,
  Api.RequestBody,
  Api.ResponseBody
> = controllerWithSession({
  method: "put",
  path: "/v1/posts/post/:postId",
  handler: async (
    params: Api.RequestParams,
    query: Api.RequestQuery,
    headers: Api.RequestHeaders,
    body: Api.RequestBody,
    session: Session
  ): Promise<ControllerResponse<Api.ResponseBody>> => {
    //TODO - throttle so user wont try to spam us
    validateBase64Image(body.post?.image);
    const postDto = await index.postDao.getPost(params.postId);

    if (!postDto) {
      return Promise.resolve({
        code: 404,
        error: "post doesn't exists",
      });
    }

    if (session.email !== postDto.email) {
      return Promise.resolve({
        code: 403,
        error: "Insufficient permissions",
      });
    }

    const newPostDto = {
      ...postDto,
      title: body.post?.title || postDto.title,
      content: body.post?.content || postDto.content,
      image: body.post?.image || postDto.image,
    };

    const success = await index.postDao.editPost(newPostDto);

    if (success) {
      const post = await mapPostDtoToPost(newPostDto);

      const response: Api.ResponseBody = {
        post,
      };

      return Promise.resolve({
        body: response,
      });
    } else {
      return Promise.resolve({
        code: 404,
      });
    }
  },
});

export default controller;
