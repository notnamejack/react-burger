import { createApi } from '@reduxjs/toolkit/query/react';

import { apiBaseQuery, clearTokens, getRefreshToken, saveTokens } from '@utils/api';

import type {
  TAuthResponse,
  TForgotRequest,
  TLoginRequest,
  TMessageResponse,
  TRegisterRequest,
  TResetRequest,
  TUpdateUserRequest,
  TUserResponse,
} from '@utils/types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<TAuthResponse, TRegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        const { data } = await queryFulfilled;

        saveTokens(data.accessToken, data.refreshToken);
      },
    }),
    login: builder.mutation<TAuthResponse, TLoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        const { data } = await queryFulfilled;

        saveTokens(data.accessToken, data.refreshToken);
      },
    }),
    logout: builder.mutation<TMessageResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: { token: getRefreshToken() ?? '' },
      }),
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        await queryFulfilled;
        clearTokens();
      },
    }),
    forgotPassword: builder.mutation<TMessageResponse, TForgotRequest>({
      query: (body) => ({
        url: '/password-reset',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<TMessageResponse, TResetRequest>({
      query: (body) => ({
        url: '/password-reset/reset',
        method: 'POST',
        body,
      }),
    }),
    getUser: builder.query<TUserResponse, void>({
      query: () => ({
        url: '/auth/user',
        auth: true,
      }),
    }),
    updateUser: builder.mutation<TUserResponse, TUpdateUserRequest>({
      query: (body) => ({
        url: '/auth/user',
        method: 'PATCH',
        body,
        auth: true,
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
} = authApi;
