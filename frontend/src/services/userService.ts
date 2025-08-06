const API_BASE_URL = 'http://localhost:8000/api';

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  birth_date: string;
  avatar_url?: string;
  cover_photo_url?: string;
  bio?: string;
  is_verified: boolean;
  created_at: string;
  posts_count: number;
  testimonials_count: number;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_photo_url?: string;
}

export interface UserSearchResult {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  is_verified: boolean;
}

class UserService {
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

  async getMyProfile(): Promise<UserProfile> {
    return this.makeRequest<UserProfile>('/users/me');
  }

  async updateMyProfile(data: UserUpdate): Promise<UserProfile> {
    return this.makeRequest<UserProfile>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserProfile(userId: number): Promise<UserProfile> {
    return this.makeRequest<UserProfile>(`/users/${userId}`);
  }

  async searchUsers(query: string, skip: number = 0, limit: number = 20): Promise<UserSearchResult[]> {
    return this.makeRequest<UserSearchResult[]>(`/users/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
  }
}

export const userService = new UserService();
