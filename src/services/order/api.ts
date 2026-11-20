import { createApi } from '@reduxjs/toolkit/query/react';

import { apiBaseQuery } from '@utils/api';

import type { TOrderResponse } from '@utils/types';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    createOrder: builder.mutation<TOrderResponse, string[]>({
      query: (ingredientIds) => ({
        url: '/orders',
        method: 'POST',
        body: { ingredients: ingredientIds },
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
