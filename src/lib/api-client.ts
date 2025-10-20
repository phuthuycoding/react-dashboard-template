interface RequestConfig extends RequestInit {
  requireAuth?: boolean;
}

interface ApiClientConfig {
  baseUrl?: string;
  onUnauthorized?: () => void;
}

class ApiClient {
  private baseUrl: string;
  private onUnauthorized?: () => void;

  private static client: ApiClient;

  private constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || '/api';
    this.onUnauthorized = config.onUnauthorized;
  }

  static getInstance(options: ApiClientConfig = {}) {
    if (!this.client) {
      this.client = new ApiClient(options);
    }
    return this.client;
  }

  private getHeaders(requireAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requireAuth) {
      const token = localStorage.getItem('firebaseToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (response.status === 401) {
      if (this.onUnauthorized) {
        this.onUnauthorized();
      }
      localStorage.removeItem('firebaseToken');
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'An error occurred');
    }

    const json = await response.json();
    if (typeof json === 'object' && Object.prototype.hasOwnProperty.call(json, 'data')) {
      return json.data;
    }

    return json;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requireAuth = true, ...requestConfig } = config;
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...requestConfig,
        headers: {
          ...this.getHeaders(requireAuth),
          ...requestConfig.headers,
        },
      });

      return this.handleResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  async get<T>(endpoint: string, config: RequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, config: RequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

const instanceConfig = {
  onUnauthorized: () => {
    window.location.href = '/auth/login';
  },
  baseUrl: import.meta.env.VITE_API_BASE_URL,
};

export function useApiClient() {
  const apiClient = ApiClient.getInstance(instanceConfig);

  console.log(import.meta.env.VITE_API_BASE_URL);

  return apiClient;
}

export const api = ApiClient.getInstance(instanceConfig);

export type { ApiClient };
