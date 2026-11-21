import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@services/auth/api';
import { getAccessToken } from '@utils/api';

export const checkUserAuth = createAsyncThunk('auth/checkUserAuth', async (_, api) => {
  if (!getAccessToken()) {
    return;
  }

  await api
    .dispatch(authApi.endpoints.getUser.initiate(undefined, { subscribe: false }))
    .unwrap();
});
