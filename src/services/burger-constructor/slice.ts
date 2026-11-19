import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TIngredient } from '@utils/types';

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TMoveIngredientPayload = {
  fromIndex: number;
  toIndex: number;
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>): void => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          constructorId: nanoid(),
        },
      }),
    },
    setBun: (state, action: PayloadAction<TIngredient>): void => {
      state.bun = action.payload;
    },
    removeIngredient: (state, action: PayloadAction<string>): void => {
      state.ingredients = state.ingredients.filter(
        (item) => item.constructorId !== action.payload
      );
    },
    moveIngredient: (state, action: PayloadAction<TMoveIngredientPayload>): void => {
      const { fromIndex, toIndex } = action.payload;
      const ingredient = state.ingredients[fromIndex];

      if (!ingredient || fromIndex === toIndex) {
        return;
      }

      state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, ingredient);
    },
  },
});

export const { addIngredient, moveIngredient, removeIngredient, setBun } =
  burgerConstructorSlice.actions;

type TBurgerConstructorSliceState = {
  burgerConstructor: TBurgerConstructorState;
};

export const selectBun = (state: TBurgerConstructorSliceState): TIngredient | null =>
  state.burgerConstructor.bun;

export const selectConstructorIngredients = (
  state: TBurgerConstructorSliceState
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

export const selectIngredientCounts = createSelector(
  (state: TBurgerConstructorSliceState): TBurgerConstructorState =>
    state.burgerConstructor,
  (constructorState): Record<string, number> => {
    const counts: Record<string, number> = {};

    for (const item of constructorState.ingredients) {
      counts[item._id] = (counts[item._id] ?? 0) + 1;
    }

    if (constructorState.bun) {
      counts[constructorState.bun._id] = 2;
    }

    return counts;
  }
);

export const selectTotalPrice = createSelector(
  (state: TBurgerConstructorSliceState): TBurgerConstructorState =>
    state.burgerConstructor,
  (constructorState): number =>
    constructorState.ingredients.reduce((sum, item) => sum + item.price, 0) +
    (constructorState.bun ? constructorState.bun.price * 2 : 0)
);
