import { PostDto } from "../../dto/PostDto";
import { PostDao } from "../PostDao";
import { generateId } from "./MongoCounterDao";
import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const postSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: false },
  email: { type: String, required: true },
  creationTime: { type: Number, required: true },
});

postSchema.plugin(mongooseUniqueValidator);

const mongoPost = mongoose.model<PostDto>("Post", postSchema);

const getPost = (id: number): Promise<PostDto | null> => {
  return mongoPost.findOne({ id }).then((res) => res && mapMongoToDto(res));
};

const insert = async (postDto: PostDto): Promise<PostDto> => {
  const id = await generateId("post");

  const postDtoWithId: PostDto = {
    ...postDto,
    id: id,
  };

  return mongoPost.create(postDtoWithId).then(() => postDtoWithId);
};

export const getAllPosts = async (
  pageSize: number,
  pageNumber: number,
  fromId: number
): Promise<PostDto[]> => {
  const offset = pageSize * pageNumber;
  return mongoPost
    .find({
      id: { $gt: fromId },
    })
    .sort("-id")
    .skip(offset)
    .limit(pageSize)
    .then((res) => res && res.map(mapMongoToDto));
};

const deletePost = (id: number): Promise<boolean> => {
  return mongoPost
    .deleteOne({ id })
    .then((res) => res.deletedCount > 0)
    .catch(() => false);
};

const editPost = (postDto: PostDto): Promise<boolean> => {
  return mongoPost
    .updateOne({ id: postDto.id }, postDto)
    .then((res) => res.modifiedCount > 0);
};

const mapMongoToDto = (
  res: mongoose.Document<unknown, unknown, PostDto> & PostDto
): PostDto => {
  return {
    id: res.id,
    title: res.title,
    content: res.content,
    image: res.image,
    email: res.email,
    creationTime: res.creationTime,
  };
};

export const dao: PostDao = {
  getPost,
  insert,
  getAllPosts,
  deletePost,
  editPost,
};

export default dao;
