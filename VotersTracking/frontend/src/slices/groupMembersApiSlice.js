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
    getAllMembers: builder.query({
      query: () => ({
        url: `${GROUP_MEMBERS_URL}/all`,
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
  }),
});

export const {
  useGetGroupMembersQuery,
  useAddGroupMemberMutation,
  useUpdateGroupMemberMutation,
  useDeleteGroupMemberMutation,
  useGetAllMembersQuery,
} = groupMembersApiSlice;
