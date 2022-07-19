import { Controller, ControllerResponse, validateBase64Image } from "../helper";
import { User } from "../../generated/swagger/post-it";
import index from "../../";
import emailValidator from "email-validator";
import bcrypt from "bcrypt";

import Api = User.Register;

const controller: Controller<
  Api.RequestParams,
  Api.RequestQuery,
  Api.RequestHeaders,
  Api.RequestBody,
  Api.ResponseBody
> = {
  method: "post",
  path: "/v1/user/register",
  handler: async (
    params: Api.RequestParams,
    query: Api.RequestQuery,
    headers: Api.RequestHeaders,
    body: Api.RequestBody
  ): Promise<ControllerResponse<Api.ResponseBody>> => {
    if (!emailValidator.validate(body.email)) {
      return Promise.resolve({
        code: 400,
        error: "invalid email",
      });
    }
    validateBase64Image(body.author_image);

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(body.password, salt);
    const error = await index.userDao.insert({
      email: body.email,
      password: password,
      author: body.author,
      author_image: body.author_image,
    });

    if (!error) {
      const response: Api.ResponseBody = {
        account: {
          token: index.jwtInstance.createToken({ email: body.email }),
          author: body.author,
          author_image: body.author_image,
        },
      };

      return {
        body: response,
      };
    } else {
      return { code: 409, error };
    }
  },
};

export default controller;
