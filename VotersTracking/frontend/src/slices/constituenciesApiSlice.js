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
    // Add other constituency-related endpoints here if needed
  }),
  overrideExisting: false,
});

export const { useGetConstituenciesQuery } = constituenciesApiSlice;
