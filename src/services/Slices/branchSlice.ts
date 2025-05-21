// auth slice
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRBranch } from "../../types";
import { IRootState } from "../store";

const initialState: { branch?: IRBranch } = {};

export const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranch: (state, action: PayloadAction<IRBranch | undefined>) => {
      state.branch = action.payload;
    },
  },
});
export const branchSelector = (state: IRootState) => state.branch.branch;


export const { setBranch } = branchSlice.actions;