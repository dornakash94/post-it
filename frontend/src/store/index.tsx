import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./reducers/user-reducer";
import { postsSlice } from "./reducers/post-reducer";

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    post: postsSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
export const accountSelector = (state: RootState) => state.account.account;
export const postStateSelector = (state: RootState) => state.post;

export default store;
