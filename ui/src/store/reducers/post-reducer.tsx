import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostSummary } from "../../generated/swagger/post-it";

interface PostState {
  postSummaries: PostSummary[];
  post?: Post;
}

const initialState: PostState = {
  postSummaries: [],
};

export const postSlice = createSlice({
  name: "postStore",
  initialState,
  reducers: {
    setPostSummaries: (state, action: PayloadAction<PostSummary[]>) => {
      state.postSummaries = action.payload;
    },
    setPost: (state, action: PayloadAction<Post>) => {
      state.post = action.payload;
    },
  },
});

export const { setPostSummaries, setPost } = postSlice.actions;
