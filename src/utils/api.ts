import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export const BASE_URL = 'https://new-stellarburgers.education-services.ru/api';

export const RESET_PASSWORD_FLAG = 'resetPassword';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

type TApiBody = {
  success?: boolean;
  message?: string;
};

type TTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

type TApiRequest = {
  url: string;
  method?: string;
  body?: unknown;
  auth?: boolean;
};

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const checkResponse = async <T>(response: Response): Promise<T> => {
  const data = (await response.json()) as T & TApiBody;

  if (response.ok && data.success !== false) {
    return data;
  }

  throw new Error(data.message ?? `Request failed: ${String(response.status)}`);
};

export const refreshToken = async (): Promise<TTokenResponse> => {
  const response = await fetch(`${BASE_URL}/auth/token`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({
      token: getRefreshToken(),
    }),
  });
  const data = await checkResponse<TTokenResponse>(response);

  saveTokens(data.accessToken, data.refreshToken);

  return data;
};

export const fetchWithRefresh = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, options);

    return await checkResponse<T>(response);
  } catch (error) {
    if (!(error instanceof Error) || error.message !== 'jwt expired') {
      throw error;
    }

    try {
      const tokens = await refreshToken();
      const headers = new Headers(options.headers);

      headers.set('authorization', tokens.accessToken);

      const response = await fetch(url, { ...options, headers });

      return await checkResponse<T>(response);
    } catch (refreshError) {
      clearTokens();
      throw refreshError;
    }
  }
};

const authHeaders = (): HeadersInit => {
  const headers: Record<string, string> = { ...JSON_HEADERS };
  const token = getAccessToken();

  if (token) {
    headers.authorization = token;
  }

  return headers;
};

export const apiBaseQuery: BaseQueryFn<TApiRequest, unknown, string> = async ({
  url,
  method = 'GET',
  body,
  auth = false,
}) => {
  try {
    const requestUrl = `${BASE_URL}${url}`;

    if (auth) {
      const data = await fetchWithRefresh<unknown>(requestUrl, {
        method,
        headers: authHeaders(),
        body: body === undefined ? undefined : JSON.stringify(body),
      });

      return { data };
    }

    const response = await fetch(requestUrl, {
      method,
      headers: body === undefined ? undefined : JSON_HEADERS,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    return { data: await checkResponse<unknown>(response) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Request failed' };
  }
};
