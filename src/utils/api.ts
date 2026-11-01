import type { TIngredientsResponse } from '@utils/types';

export const BASE_URL = 'https://stellarburgers.education-services.ru/api';

const checkResponse = <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  return Promise.reject(new Error(`Request failed: ${String(response.status)}`));
};

export const getIngredients = (): Promise<TIngredientsResponse> =>
  fetch(`${BASE_URL}/ingredients`).then((response) =>
    checkResponse<TIngredientsResponse>(response)
  );
