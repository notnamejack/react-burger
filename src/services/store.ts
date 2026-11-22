import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
} from 'react-redux';

import { authApi } from '@services/auth/api';
import { authSlice } from '@services/auth/slice';
import { burgerConstructorSlice } from '@services/burger-constructor/slice';
import { ingredientsApi } from '@services/ingredients/api';
import { orderApi } from '@services/order/api';
import { orderSlice } from '@services/order/slice';

import type { TypedUseSelectorHook, UseDispatch } from 'react-redux';

const rootReducer = combineSlices(
  ingredientsApi,
  orderApi,
  authApi,
  burgerConstructorSlice,
  orderSlice,
  authSlice
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ingredientsApi.middleware,
      orderApi.middleware,
      authApi.middleware
    ),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: UseDispatch<AppDispatch> =
  useDispatchBase.withTypes<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> =
  useSelectorBase.withTypes<RootState>();
