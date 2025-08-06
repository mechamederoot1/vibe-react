const API_BASE_URL = 'http://localhost:8000/api';

export interface Post {
  id: number;
  content: string;
  post_type: string;
  author_id: number;
  author_name: string;
  author_avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface PostCreate {
  content: string;
  post_type: string;
}

export interface Testimonial {
  id: number;
  content: string;
  author_id: number;
  target_user_id: number;
  author_name: string;
  target_user_name: string;
  text_color: string;
  background_color: string;
  font_family: string;
  font_size: number;
  text_shadow?: string;
  background_gradient?: string;
  created_at: string;
}

export interface TestimonialCreate {
  content: string;
  target_user_id: number;
  text_color?: string;
  background_color?: string;
  font_family?: string;
  font_size?: number;
  text_shadow?: string;
  background_gradient?: string;
}

class PostService {
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

  async createPost(data: PostCreate): Promise<Post> {
    return this.makeRequest<Post>('/posts/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFeed(skip: number = 0, limit: number = 20): Promise<Post[]> {
    return this.makeRequest<Post[]>(`/posts/feed?skip=${skip}&limit=${limit}`);
  }

  async getUserPosts(userId: number, skip: number = 0, limit: number = 20): Promise<Post[]> {
    return this.makeRequest<Post[]>(`/posts/user/${userId}?skip=${skip}&limit=${limit}`);
  }

  async deletePost(postId: number): Promise<void> {
    return this.makeRequest<void>(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async createTestimonial(data: TestimonialCreate): Promise<Testimonial> {
    return this.makeRequest<Testimonial>('/posts/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserTestimonials(userId: number, skip: number = 0, limit: number = 20): Promise<Testimonial[]> {
    return this.makeRequest<Testimonial[]>(`/posts/testimonials/${userId}?skip=${skip}&limit=${limit}`);
  }
}

export const postService = new PostService();
