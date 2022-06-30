import { Api } from "../generated/swagger/post-it";

export const api = new Api({ baseUrl: "http://localhost/v1" });

//api.user.login({ email: "myEmail", password: "asdsa" });
