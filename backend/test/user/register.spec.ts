import index from "../../src/";
import { randEmail, randFullName, randPassword, randText } from "@ngneat/falso";
import { User } from "../../src/generated/swagger/post-it";
import { expect } from "chai";
import { requestWithSupertest } from "../utils/rest-utils";

describe("register rest", () => {
  it("register successfully", async () => {
    const request: User.Register.RequestBody = {
      email: randEmail(),
      password: randPassword(),
      author: randFullName(),
    };

    const res = await requestWithSupertest
      .post("/v1/user/register")
      .send(request);

    const responseBody: User.Register.ResponseBody = res.body;
    expect(res.statusCode).to.equal(200);
    expect(responseBody.account?.author).to.equal(request.author);

    const userDto = await index.userDao.get(request.email);
    expect(userDto?.author).equals(request.author);
    expect(userDto?.password).not.equals(request.password);
    expect(
      index.jwtInstance.readToken(responseBody?.account?.token)?.email
    ).equals(request.email);
  });

  it("bad request", async () => {
    const request: User.Register.RequestBody = {
      email: randText(),
      password: randPassword(),
      author: randFullName(),
    };

    const res = await requestWithSupertest
      .post("/v1/user/register")
      .send(request);

    expect(res.statusCode).to.equal(400);
    expect(res.text).to.equal("invalid email");
  });

  it("already exists email&author", async () => {
    const request: User.Register.RequestBody = {
      email: randEmail(),
      password: randPassword(),
      author: randFullName(),
    };

    const res = await requestWithSupertest
      .post("/v1/user/register")
      .send(request);

    expect(res.statusCode).to.equal(200);

    const secondRegister = await requestWithSupertest
      .post("/v1/user/register")
      .send(request);

    const error = {
      message: "unique validation failed",
      fields: ["author", "email"],
    };

    expect(secondRegister.statusCode).to.equal(409);
    expect(secondRegister.body).to.deep.equal(error);
  });
  it("already exists email", async () => {
    const request: User.Register.RequestBody = {
      email: randEmail(),
      password: randPassword(),
      author: randFullName(),
    };
    const anotherRequest: User.Register.RequestBody = {
      email: request.email,
      password: randPassword(),
      author: randFullName(),
    };
    const res = await requestWithSupertest
      .post("/v1/user/register")
      .send(request);

    expect(res.statusCode).to.equal(200);

    const secondRegister = await requestWithSupertest
      .post("/v1/user/register")
      .send(anotherRequest);

    const error = {
      message: "unique validation failed",
      fields: ["email"],
    };

    expect(secondRegister.statusCode).to.equal(409);
    expect(secondRegister.body).to.deep.equal(error);
  });

  it("already exists author", async () => {
    const request: User.Register.RequestBody = {
      email: randEmail(),
      password: randPassword(),
      author: randFullName(),
    };
    const anotherRequest: User.Register.RequestBody = {
      email: randEmail(),
      password: randPassword(),
      author: request.author,
    };

    const res = await requestWithSupertest
      .post("/v1/user/register")
      .send(request);

    expect(res.statusCode).to.equal(200);

    const secondRegister = await requestWithSupertest
      .post("/v1/user/register")
      .send(anotherRequest);

    const error = {
      message: "unique validation failed",
      fields: ["author"],
    };

    expect(secondRegister.statusCode).to.equal(409);
    expect(secondRegister.body).to.deep.equal(error);
  });
});
