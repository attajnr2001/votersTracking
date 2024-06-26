// slices/constituenciesApiSlice.js
import { apiSlice } from "./appSlice";

const CONSTITUENCIES_URL = "/api/constituencies";

export const constituenciesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConstituencies: builder.query({
      query: () => ({
        url: CONSTITUENCIES_URL,
        method: "GET",
      }),
      providesTags: ["Constituency"],
    }),
    // Add other endpoints for create, update, and delete as needed
  }),
});

export const { useGetConstituenciesQuery } = constituenciesApiSlice;
