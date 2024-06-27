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
    addConstituency: builder.mutation({
      query: (data) => ({
        url: CONSTITUENCIES_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Constituency"],
    }),
    updateConstituency: builder.mutation({
      query: (data) => ({
        url: `${CONSTITUENCIES_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Constituency"],
    }),
    deleteConstituency: builder.mutation({
      query: (id) => ({
        url: `${CONSTITUENCIES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Constituency"],
    }),
  }),
});

export const {
  useGetConstituenciesQuery,
  useAddConstituencyMutation,
  useUpdateConstituencyMutation,
  useDeleteConstituencyMutation,
} = constituenciesApiSlice;
