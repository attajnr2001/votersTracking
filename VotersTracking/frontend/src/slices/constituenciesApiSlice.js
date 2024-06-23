// constituenciesApiSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit';

const BASE_URL = 'http://your-api-url'; // Replace with your actual API base URL

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    fetchConstituencies: builder.query({
      query: () => '/constituencies', // Replace with your actual endpoint to fetch constituencies
    }),
  }),
});

export const { useFetchConstituenciesQuery } = apiSlice;

export default apiSlice.reducer;
