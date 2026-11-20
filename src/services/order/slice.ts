import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrderResponse } from '@utils/types';

type TOrderState = {
  order: TOrderResponse | null;
};

const initialState: TOrderState = {
  order: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<TOrderResponse>): void => {
      state.order = action.payload;
    },
    clearOrder: (state): void => {
      state.order = null;
    },
  },
});

export const { clearOrder, setOrder } = orderSlice.actions;

type TOrderSliceState = {
  order: TOrderState;
};

export const selectOrder = (state: TOrderSliceState): TOrderResponse | null =>
  state.order.order;
