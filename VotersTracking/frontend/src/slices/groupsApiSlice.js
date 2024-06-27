// slices/groupsApiSlice.js
import { apiSlice } from "./appSlice";

const GROUPS_URL = "/api/groups";

export const groupsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: () => ({
        url: GROUPS_URL,
        method: "GET",
      }),
      providesTags: ["Group"],
    }),
    addGroup: builder.mutation({
      query: (data) => ({
        url: GROUPS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),
    updateGroup: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${GROUPS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Group"],
    }),
    deleteGroup: builder.mutation({
      query: (id) => ({
        url: `${GROUPS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useAddGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupsApiSlice;
