import { configureStore } from "@reduxjs/toolkit";
import { postSlice } from "./reducers/post-reducer";
import { accountSlice } from "./reducers/user-reducer";

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    post: postSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
export const accountSelector = (state: RootState) => state.account.account;
export const postSummariesSelector = (state: RootState) =>
  state.post.postSummaries;
export const postSelector = (state: RootState) => state.post.post;

export default store;
