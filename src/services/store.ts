import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer.ts";
import { baseQuery } from "./BaseFetchQuery";

const persistConfig = {
  key: "SWIGGY",
  storage,
  whitelist: ["auth", "activeLanguage"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseQuery.middleware
    ),
});

export default store;
export const persistor = persistStore(store);
export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

