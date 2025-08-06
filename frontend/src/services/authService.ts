import { LoginData, RegisterData, AuthResponse, User, RegisterStep1, RegisterStep2, RegisterStep3, RegisterStep4 } from '../types/auth';

const API_BASE_URL = 'http://localhost:8000/api';

class AuthService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro na requisição');
    }

    return response.json();
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
