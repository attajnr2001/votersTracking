// slices/galleryApiSlice.js
import { apiSlice } from "./appSlice";

const GALLERY_URL = "/api/gallery";

export const galleryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGalleryItems: builder.query({
      query: () => ({
        url: GALLERY_URL,
        method: "GET",
      }),
      providesTags: ["Gallery"],
    }),
    addGalleryItem: builder.mutation({
      query: (data) => ({
        url: GALLERY_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Gallery"],
    }),
    updateGalleryItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${GALLERY_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Gallery"],
    }),
    deleteGalleryItem: builder.mutation({
      query: (id) => ({
        url: `${GALLERY_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Gallery"],
    }),
  }),
});

export const {
  useGetGalleryItemsQuery,
  useAddGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} = galleryApiSlice;
