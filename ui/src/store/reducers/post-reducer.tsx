import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../generated/swagger/post-it";

interface PostState {
  posts: Post[];
}

const initialState: PostState = {
  posts: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPosts: (state, action: PayloadAction<Post[]>) => {
      const postMap = new Map(state.posts.map((post) => [post.id, post]));
      const changesMap = new Map(action.payload.map((post) => [post.id, post]));

      const combined = new Map([...postMap, ...changesMap]);

      state.posts = Array.from(combined.values()).sort((a, b) => b.id! - a.id!);
    },
    deletePost: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      const postsWithoutPostId = state.posts.filter(
        (post) => post.id !== postId
      );
      state.posts = postsWithoutPostId;
    },
  },
});

export const { addPosts, deletePost } = postsSlice.actions;
