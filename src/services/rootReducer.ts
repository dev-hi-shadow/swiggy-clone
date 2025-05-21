import { combineReducers } from "@reduxjs/toolkit";
import { baseQuery } from "./BaseFetchQuery";
import { authSlice } from "./Slices/authSlice";
import { branchSlice } from "./Slices/branchSlice";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  branch: branchSlice.reducer,
  [baseQuery.reducerPath]: baseQuery.reducer,
});

export default rootReducer;
