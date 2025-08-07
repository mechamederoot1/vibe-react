import apiService from './api';
import { Post, CreatePostRequest } from '../types/content';

class PostService {
  async getFeed(skip: number = 0, limit: number = 20): Promise<Post[]> {
    try {
      return await apiService.get<Post[]>(`/posts/feed?skip=${skip}&limit=${limit}`);
    } catch (error) {
      console.error('Get feed error:', error);
      throw error;
    }
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    try {
      return await apiService.post<Post>('/posts', postData);
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  }

  async getUserPosts(userId: number, skip: number = 0, limit: number = 20): Promise<Post[]> {
    try {
      return await apiService.get<Post[]>(`/posts/user/${userId}?skip=${skip}&limit=${limit}`);
    } catch (error) {
      console.error('Get user posts error:', error);
      throw error;
    }
  }

  async deletePost(postId: number): Promise<void> {
    try {
      await apiService.delete(`/posts/${postId}`);
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }

  async likePost(postId: number): Promise<void> {
    try {
      await apiService.post(`/posts/${postId}/like`);
    } catch (error) {
      console.error('Like post error:', error);
      throw error;
    }
  }

  async unlikePost(postId: number): Promise<void> {
    try {
      await apiService.delete(`/posts/${postId}/like`);
    } catch (error) {
      console.error('Unlike post error:', error);
      throw error;
    }
  }
}

export const postService = new PostService();
export default postService;
