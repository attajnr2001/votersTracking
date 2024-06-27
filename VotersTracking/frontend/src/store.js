// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { apiSlice } from "./slices/appSlice";
import { constituenciesApiSlice } from "./slices/constituenciesApiSlice";
import { groupsApiSlice } from "./slices/groupsApiSlice";
import { groupMembersApiSlice } from "./slices/groupMembersApiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [constituenciesApiSlice.reducerPath]: constituenciesApiSlice.reducer,
    [groupsApiSlice.reducerPath]: groupsApiSlice.reducer,
    [groupMembersApiSlice.reducerPath]: groupMembersApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      constituenciesApiSlice.middleware,
      groupsApiSlice.middleware,
      groupMembersApiSlice.middleware
    ),
  devTools: true,
});

export default store;
