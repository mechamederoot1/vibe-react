import { LoginData, RegisterData, AuthResponse, User, RegisterStep1, RegisterStep2, RegisterStep3, RegisterStep4 } from '../types/auth';

// Try to detect the environment and use appropriate API URL
const getApiBaseUrl = () => {
  // If running on fly.dev, use a placeholder backend URL or mock mode
  if (window.location.hostname.includes('fly.dev')) {
    return null; // Use mock mode
  }
  // Default to localhost for local development
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

class AuthService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // If no API_BASE_URL (fly.dev deployment), use mock responses
    if (!API_BASE_URL) {
      return this.mockRequest<T>(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('vibe_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro na requisição');
      }

      return response.json();
    } catch (error) {
      // If backend is not available, fallback to mock
      console.warn('Backend not available, using mock data');
      return this.mockRequest<T>(endpoint, options);
    }
  }

  private async mockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : {};

    // Mock responses for different endpoints
    switch (endpoint) {
      case '/auth/validate-step1':
      case '/auth/validate-step2':
      case '/auth/validate-step3':
      case '/auth/validate-step4':
        return { message: 'Dados válidos', data: body } as T;

      case '/auth/register':
        const mockUser: User = {
          id: 1,
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          gender: body.gender,
          birth_date: body.birth_date,
          created_at: new Date().toISOString()
        };
        const registerResponse: AuthResponse = {
          access_token: 'mock_token_' + Math.random(),
          token_type: 'bearer',
          user: mockUser
        };
        return registerResponse as T;

      case '/auth/login':
        const loginUser: User = {
          id: 1,
          first_name: 'Demo',
          last_name: 'User',
          email: body.email,
          gender: 'outro',
          birth_date: '1990-01-01',
          created_at: new Date().toISOString()
        };
        const loginResponse: AuthResponse = {
          access_token: 'mock_token_' + Math.random(),
          token_type: 'bearer',
          user: loginUser
        };
        return loginResponse as T;

      case '/auth/me':
        const currentUser: User = {
          id: 1,
          first_name: 'Demo',
          last_name: 'User',
          email: 'demo@vibe.social',
          gender: 'outro',
          birth_date: '1990-01-01',
          created_at: new Date().toISOString()
        };
        return currentUser as T;

      default:
        throw new Error('Endpoint não encontrado');
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async validateStep1(data: RegisterStep1): Promise<any> {
    return this.makeRequest('/auth/validate-step1', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async validateStep2(data: RegisterStep2): Promise<any> {
    return this.makeRequest('/auth/validate-step2', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async validateStep3(data: RegisterStep3): Promise<any> {
    return this.makeRequest('/auth/validate-step3', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async validateStep4(data: RegisterStep4): Promise<any> {
    return this.makeRequest('/auth/validate-step4', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.makeRequest<User>('/auth/me');
  }
}

export const authService = new AuthService();
