// auth slice
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types";
import { IRootState } from "../store";

const initialState: {
  token: string | null;
  user: IUser | undefined;
} = {
  token: "",
  user: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser | undefined>) => {
      state.user = action.payload;
    },
  },
});
export const userSelector = (state: IRootState) => state.auth.user;


export const { setToken, setUser } = authSlice.actions;