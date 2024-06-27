
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
      query: (psCode) => ({
        url: `${VOTERS_URL}?psCode=${psCode}`,
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
      query: (psCode) => ({
        url: `${VOTERS_URL}/count${
          psCode !== "all" ? `?psCode=${psCode}` : ""
        }`,
        method: "GET",
      }),
    }),

    getVotersBelow40: builder.query({
      query: (psCode) => ({
        url: `${VOTERS_URL}/count/below40${
          psCode !== "all" ? `?psCode=${psCode}` : ""
        }`,
        method: "GET",
      }),
    }),

    getVotersAbove40: builder.query({
      query: (psCode) => ({
        url: `${VOTERS_URL}/count/above40${
          psCode !== "all" ? `?psCode=${psCode}` : ""
        }`,
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
