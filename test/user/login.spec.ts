import {
  requestWithSupertest,
  createAccountAndToken,
} from "../utils/rest-utils";
import index from "../../src/";
import { randEmail, randPassword, randText } from "@ngneat/falso";
import { User } from "../../src/generated/swagger/post-it";
import { expect } from "chai";

describe("login rest", () => {
  it("login successfully", async () => {
    const accountDetails = await createAccountAndToken();

    const request: User.Login.RequestBody = {
      email: accountDetails.email,
      password: accountDetails.password,
    };

    const res = await requestWithSupertest.post("/v1/user/login").send(request);
    expect(res.statusCode).to.equal(200);
    expect(index.jwtInstance.readToken(res.body?.account?.token)?.email).equals(
      request.email
    );
  });

  it("invalid email request", async () => {
    const request: User.Login.RequestBody = {
      email: randText(),
      password: randPassword(),
    };
    const res = await requestWithSupertest.post("/v1/user/login").send(request);
    expect(res.statusCode).to.equal(401);
    expect(res.text).to.equal("failed login");
  });

  it("user doesn't exists request", async () => {
    const request: User.Login.RequestBody = {
      email: randEmail(),
      password: randPassword(),
    };
    const res = await requestWithSupertest.post("/v1/user/login").send(request);
    expect(res.statusCode).to.equal(401);
    expect(res.text).to.equal("failed login");
  });

  it("incorrect password request", async () => {
    const accountDetails = await createAccountAndToken();

    const request: User.Login.RequestBody = {
      email: accountDetails.email,
      password: randPassword(),
    };

    const res = await requestWithSupertest.post("/v1/user/login").send(request);
    expect(res.statusCode).to.equal(401);
  });
});
