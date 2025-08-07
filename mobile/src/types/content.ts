import { User } from './auth';

export interface Post {
  id: number;
  content: string;
  author_id: number;
  author_name: string;
  author_avatar?: string;
  post_type: 'text' | 'testimonial';
  created_at: string;
  updated_at: string;
}

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

export interface CreatePostRequest {
  content: string;
  post_type: string;
}

export interface CreateStoryRequest {
  content: string;
  media_url?: string;
}
