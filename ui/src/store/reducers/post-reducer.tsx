import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostSummary } from "../../generated/swagger/post-it";

interface PostState {
  postSummaries: PostSummary[];
  postIdToPost: { [id: number]: Post };
}

const initialState: PostState = {
  postSummaries: [],
  postIdToPost: {},
};

export const postSlice = createSlice({
  name: "postStore",
  initialState,
  reducers: {
    setPostSummaries: (state, action: PayloadAction<PostSummary[]>) => {
      state.postSummaries = action.payload;
    },
    setPost: (state, action: PayloadAction<Post>) => {
      const newPosIdToPost = { ...state.postIdToPost };
      newPosIdToPost[action.payload.id!] = action.payload;

      state.postIdToPost = newPosIdToPost;
    },
  },
});

export const { setPostSummaries, setPost } = postSlice.actions;
