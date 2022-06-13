import { Controller } from "../helper";
import createPost from "./createPost";
import deletePost from "./deletePost";
import getPost from "./getPost";
import getPostsList from "./getPostsList";
import editPost from "./editPost";

const controllers: Controller<any, any, any, any, any>[] = [
  createPost,
  deletePost,
  getPost,
  getPostsList,
  editPost,
];

export default controllers;
