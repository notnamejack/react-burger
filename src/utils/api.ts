import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export const BASE_URL = 'https://new-stellarburgers.education-services.ru/api';

const checkResponse = async <T>(response: Response): Promise<T> => {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  return Promise.reject(new Error(`Request failed: ${String(response.status)}`));
};

export const apiBaseQuery: BaseQueryFn<
  { url: string; method?: string; body?: unknown },
  unknown,
  string
> = async ({ url, method = 'GET', body }) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    return { data: await checkResponse(response) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Request failed' };
  }
};
