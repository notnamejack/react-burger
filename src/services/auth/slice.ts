import { createSlice } from '@reduxjs/toolkit';

import { checkUserAuth } from '@services/auth/actions';
import { authApi } from '@services/auth/api';

import type { TUser } from '@utils/types';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addMatcher(authApi.endpoints.getUser.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addMatcher(authApi.endpoints.updateUser.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
      })
      .addMatcher(authApi.endpoints.getUser.matchRejected, (state) => {
        state.user = null;
      });
  },
});

type TAuthSliceState = {
  auth: TAuthState;
};

export const selectUser = (state: TAuthSliceState): TUser | null => state.auth.user;

export const selectIsAuthChecked = (state: TAuthSliceState): boolean =>
  state.auth.isAuthChecked;
