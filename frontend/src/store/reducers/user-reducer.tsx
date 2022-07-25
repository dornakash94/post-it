import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "../../generated/swagger/post-it";

interface AccountState {
  account?: Account;
}

const loadInitialState = (): AccountState => {
  const savedAccount = localStorage.getItem("account");
  const account = savedAccount ? JSON.parse(savedAccount) : null;

  return {
    account,
  };
};

export const accountSlice = createSlice({
  name: "accountStore",
  initialState: loadInitialState(),
  reducers: {
    setAccount: (state, action: PayloadAction<Account | undefined>) => {
      if (action.payload?.token) {
        localStorage.setItem("account", JSON.stringify(action.payload));
      }

      state.account = action.payload;
    },
    logout: (state) => {
      localStorage.clear();
      state.account = loadInitialState().account;
    },
  },
});

export const { setAccount, logout } = accountSlice.actions;
