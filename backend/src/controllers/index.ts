import user from "./user";
import post from "./post";
import { Controller } from "./helper";

const controllers: Controller<unknown, unknown, unknown, unknown, unknown>[] = [
  ...user,
  ...post,
];

export default controllers;
