import { createApi } from '@reduxjs/toolkit/query/react';

import { apiBaseQuery } from '@utils/api';

import type { TIngredientsResponse } from '@utils/types';

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredientsResponse, void>({
      query: () => ({ url: '/ingredients' }),
    }),
  }),
});

export const { useGetIngredientsQuery } = ingredientsApi;
