// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { apiSlice } from "./slices/appSlice";
import { constituenciesApiSlice } from "./slices/constituenciesApiSlice";
import { groupsApiSlice } from "./slices/groupsApiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [constituenciesApiSlice.reducerPath]: constituenciesApiSlice.reducer,
    [groupsApiSlice.reducerPath]: groupsApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      constituenciesApiSlice.middleware,
      groupsApiSlice.middleware
    ),
  devTools: true,
});

export default store;
