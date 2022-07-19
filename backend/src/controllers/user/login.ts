import { Controller, ControllerResponse } from "../helper";
import { User } from "../../generated/swagger/post-it";
import index from "../../";
import bcrypt from "bcrypt";
import Api = User.Login;

const controller: Controller<
  Api.RequestParams,
  Api.RequestQuery,
  Api.RequestHeaders,
  Api.RequestBody,
  Api.ResponseBody
> = {
  method: "post",
  path: "/v1/user/login",
  handler: async (
    params: Api.RequestParams,
    query: Api.RequestQuery,
    headers: Api.RequestHeaders,
    body: Api.RequestBody
  ): Promise<ControllerResponse<Api.ResponseBody>> => {
    const user = await index.userDao.get(body.email);

    const loginSuccessfully =
      user && (await bcrypt.compare(body.password, user.password));

    if (!loginSuccessfully) {
      return Promise.resolve({
        code: 401,
        error: "failed login",
      });
    }

    const response: Api.ResponseBody = {
      account: {
        token: index.jwtInstance.createToken({ email: body.email }),
        author: user.author,
        author_image: user.author_image,
      },
    };
    return {
      body: response,
    };
  },
};

export default controller;
