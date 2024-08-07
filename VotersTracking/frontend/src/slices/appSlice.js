import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["User", "Constituency", "GroupMembers", "Group", "Voter"],
  endpoints: (builder) => ({}),
});
