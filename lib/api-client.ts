import { API_BASE_URL } from './config';

export interface RequestOptions extends RequestInit {
  body?: any;
  skipAuth?: boolean;
}

export async function apiClient<T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, skipAuth = false, headers: customHeaders, ...rest } = options;

  const url = `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

  const headers = new Headers(customHeaders);

  // Auto-attach content-type if JSON body
  if (body !== undefined && !(body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  // Auto-attach JWT token
  if (!skipAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('patterson-crm-token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (_) {
      // Use fallback error message if JSON parsing fails
    }
    throw new Error(errorMessage);
  }

  // Handle empty or 204 responses
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json() as T;
  } catch (_) {
    return {} as T;
  }
}
