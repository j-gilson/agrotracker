import { appConfig } from '../config/appConfig';
import { env } from '../config/env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  retries?: number;
}

class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

const buildUrl = (path: string): string => {
  const normalizedBase = env.API_URL.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
};

const parseErrorPayload = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    try {
      return await response.text();
    } catch {
      return undefined;
    }
  }
};

const getFriendlyErrorMessage = (status: number, statusText: string, payload?: unknown): string => {
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const errorMessage = payload.error;

    if (typeof errorMessage === 'string' && errorMessage.trim()) {
      return errorMessage;
    }
  }

  if (status >= 500) {
    return 'Nao foi possivel conectar ao servidor. Verifique internet e tente novamente.';
  }

  if (status === 404) {
    return 'Nao encontramos as informacoes solicitadas.';
  }

  if (status === 400) {
    return 'Nao foi possivel concluir a operacao. Revise os dados e tente novamente.';
  }

  return `Nao foi possivel concluir a requisicao (${status} - ${statusText}).`;
};

const delay = (durationMs: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });

const request = async <TResponse>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {}
): Promise<TResponse> => {
  const retries = options.retries ?? (method === 'GET' ? 1 : 0);
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? appConfig.api.timeoutMs
  );

  try {
    const response = await fetch(buildUrl(path), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      const payload = await parseErrorPayload(response);
      throw new ApiError(
        getFriendlyErrorMessage(response.status, response.statusText, payload),
        response.status,
        payload
      );
    }

    if (response.status === 204) {
      return undefined as TResponse;
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      if (retries > 0) {
        await delay(500);
        return request<TResponse>(method, path, {
          ...options,
          retries: retries - 1,
        });
      }

      throw new Error('Nao foi possivel conectar ao servidor. Verifique internet e tente novamente.');
    }

    if (error instanceof Error) {
      if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('Network request failed'))) {
        await delay(500);
        return request<TResponse>(method, path, {
          ...options,
          retries: retries - 1,
        });
      }

      if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
        throw new Error('Nao foi possivel conectar ao servidor. Verifique internet e tente novamente.');
      }

      throw error;
    }

    throw new Error('Erro inesperado ao comunicar com a API');
  } finally {
    clearTimeout(timeout);
  }
};

export const apiClient = {
  get: <TResponse>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<TResponse>('GET', path, options),
  post: <TResponse>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<TResponse>('POST', path, { ...options, body }),
  put: <TResponse>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<TResponse>('PUT', path, { ...options, body }),
  delete: <TResponse>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<TResponse>('DELETE', path, options),
};
