import { Controller } from "../helper";
import login from "./login";
import register from "./register";

const controllers: Controller<any, any, any, any, any>[] = [login, register];

export default controllers;
