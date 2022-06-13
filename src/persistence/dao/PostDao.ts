import { PostDto } from "../dto/PostDto";

export interface PostDao {
  insert: (postDto: PostDto) => Promise<PostDto>;
  getPost: (id: number) => Promise<PostDto | null>;
  getAllPosts: (
    pageSize: number,
    pageNumber: number,
    fromId: number
  ) => Promise<PostDto[]>;
  deletePost: (id: number) => Promise<boolean>;
  editPost: (postDto: PostDto) => Promise<boolean>;
}
