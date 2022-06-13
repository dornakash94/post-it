import {
  Controller,
  ControllerResponse,
  Session,
  validateBase64Image,
  validateMandatoryParam,
} from "../helper";
import index from "../..";
import { PostDto } from "../../persistence/dto/PostDto";
import { Posts } from "../../generated/swagger/post-it";
import Api = Posts.CreatePost;
import { controllerWithSession } from "../helper";
import { mapPostDtoToPost } from "../../mappers/post-mappers";

const controller: Controller<
  Api.RequestParams,
  Api.RequestQuery,
  Api.RequestHeaders,
  Api.RequestBody,
  Api.ResponseBody
> = controllerWithSession({
  method: "post",
  path: "/v1/posts/post",
  handler: async (
    params: Api.RequestParams,
    query: Api.RequestQuery,
    headers: Api.RequestHeaders,
    body: Api.RequestBody,
    session: Session
  ): Promise<ControllerResponse<Api.ResponseBody>> => {
    //TODO - throttle so user wont try to spam us
    validateMandatoryParam("title", body.post.title);
    validateMandatoryParam("content", body.post.content);
    validateBase64Image(body.post.image);

    const postDto: PostDto = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      title: body.post!.title!,
      content: body.post!.content!,
      image: body.post?.image,
      email: session.email,
      creationTime: new Date().getTime(),
    };
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    const insertedPostDto = await index.postDao.insert(postDto);
    const post = await mapPostDtoToPost(insertedPostDto);

    const response: Api.ResponseBody = {
      post,
    };

    return Promise.resolve({
      body: response,
    });
  },
});

export default controller;
