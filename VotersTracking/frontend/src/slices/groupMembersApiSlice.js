// slices/groupMembersApiSlice.js
import { apiSlice } from "./appSlice";

const GROUP_MEMBERS_URL = "/api/group-members";

export const groupMembersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroupMembers: builder.query({
      query: (groupId) => ({
        url: `${GROUP_MEMBERS_URL}/${groupId}`,
        method: "GET",
      }),
      providesTags: ["GroupMembers"],
    }),
    addGroupMember: builder.mutation({
      query: (data) => ({
        url: GROUP_MEMBERS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["GroupMembers"],
    }),
    updateGroupMember: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${GROUP_MEMBERS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["GroupMembers"],
    }),
    deleteGroupMember: builder.mutation({
      query: (id) => ({
        url: `${GROUP_MEMBERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GroupMembers"],
    }),
    importGroupMembers: builder.mutation({
      query: (data) => ({
        url: `${GROUP_MEMBERS_URL}/import`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["GroupMembers"],
    }),
  }),
});

export const {
  useGetGroupMembersQuery,
  useAddGroupMemberMutation,
  useUpdateGroupMemberMutation,
  useDeleteGroupMemberMutation,
  useImportGroupMembersMutation,
} = groupMembersApiSlice;
