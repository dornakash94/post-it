import { Controller, ControllerResponse } from "../helper";
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
    //TODO throttle so user wont spam us
    if (!emailValidator.validate(body.email)) {
      return Promise.resolve({
        code: 400,
        error: "invalid email",
      });
    }
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(body.password, salt);
    const success = await index.userDao.insert({
      email: body.email,
      password: password,
      author: body.author,
    });

    if (success) {
      const response: Api.ResponseBody = {
        account: {
          token: index.jwtInstance.createToken({ email: body.email }),
          author: body.author,
        },
      };

      return {
        body: response,
      };
    } else {
      return { code: 409, error: "email is already exists" };
    }
  },
};

export default controller;
