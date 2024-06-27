import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { apiSlice } from "./slices/appSlice";
import { constituenciesApiSlice } from "./slices/constituenciesApiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [constituenciesApiSlice.reducerPath]: constituenciesApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      constituenciesApiSlice.middleware
    ),
  devTools: true,
});

export default store;
