import { API_BASE_URL } from '../utils/api';

export interface Story {
  id: number;
  content: string;
  author_id: number;
  author_name: string;
  author_avatar?: string;
  media_url?: string;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

export interface StoryCreate {
  content: string;
  media_url?: string;
}

class StoryService {
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

  async createStory(data: StoryCreate): Promise<Story> {
    return this.makeRequest<Story>('/stories/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getActiveStories(skip: number = 0, limit: number = 50): Promise<Story[]> {
    return this.makeRequest<Story[]>(`/stories/active?skip=${skip}&limit=${limit}`);
  }

  async getUserStories(userId: number, skip: number = 0, limit: number = 20): Promise<Story[]> {
    return this.makeRequest<Story[]>(`/stories/user/${userId}?skip=${skip}&limit=${limit}`);
  }

  async deactivateStory(storyId: number): Promise<void> {
    return this.makeRequest<void>(`/stories/${storyId}`, {
      method: 'DELETE',
    });
  }
}

export const storyService = new StoryService();
