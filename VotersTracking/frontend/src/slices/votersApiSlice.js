// in votersApiSlice.js
import { apiSlice } from "./appSlice";

const VOTERS_URL = "/api/voters";
const CONSTITUENCIES_URL = "/api/constituencies";

export const votersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addVoter: builder.mutation({
      query: (data) => ({
        url: VOTERS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Voter"],
    }),
    getVoters: builder.query({
      query: () => ({
        url: VOTERS_URL,
        method: "GET",
      }),
      providesTags: ["Voter"],
    }),
    getConstituencies: builder.query({
      query: () => ({
        url: CONSTITUENCIES_URL,
        method: "GET",
      }),
    }),

    getTotalVoters: builder.query({
      query: () => ({
        url: `${VOTERS_URL}/count`,
        method: "GET",
      }),
    }),

    getVotersBelow40: builder.query({
      query: () => ({
        url: `${VOTERS_URL}/count/below40`,
        method: "GET",
      }),
    }),
    getVotersAbove40: builder.query({
      query: () => ({
        url: `${VOTERS_URL}/count/above40`,
        method: "GET",
      }),
    }),
    getConstituencyData: builder.query({
      query: (psCode) => ({
        url: `${VOTERS_URL}/constituency/${psCode}`,
        method: "GET",
      }),
    }),
    getAllConstituenciesData: builder.query({
      query: () => ({
        url: `${VOTERS_URL}/all-constituencies-data`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddVoterMutation,
  useGetVotersQuery,
  useGetConstituenciesQuery,
  useGetTotalVotersQuery,
  useGetVotersBelow40Query,
  useGetVotersAbove40Query,
  useGetConstituencyDataQuery,
  useGetAllConstituenciesDataQuery,
} = votersApiSlice;
