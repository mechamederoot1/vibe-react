import apiService from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await fetch(`${apiService['baseURL'].replace('/api', '')}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Set auth token for future requests
      await apiService.setAuthToken(data.access_token);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', userData);
      
      // Set auth token for future requests
      await apiService.setAuthToken(response.access_token);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await apiService.get<User>('/users/me');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.clearAuthToken();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async refreshToken(): Promise<void> {
    // Implement token refresh logic if needed
    // This depends on your backend implementation
  }
}

export const authService = new AuthService();
export default authService;
