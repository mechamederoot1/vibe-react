import apiService from './api';
import { Story, CreateStoryRequest } from '../types/content';

class StoryService {
  async getActiveStories(skip: number = 0, limit: number = 50): Promise<Story[]> {
    try {
      return await apiService.get<Story[]>(`/stories/active?skip=${skip}&limit=${limit}`);
    } catch (error) {
      console.error('Get active stories error:', error);
      throw error;
    }
  }

  async createStory(storyData: CreateStoryRequest): Promise<Story> {
    try {
      return await apiService.post<Story>('/stories', storyData);
    } catch (error) {
      console.error('Create story error:', error);
      throw error;
    }
  }

  async getUserStories(userId: number): Promise<Story[]> {
    try {
      return await apiService.get<Story[]>(`/stories/user/${userId}`);
    } catch (error) {
      console.error('Get user stories error:', error);
      throw error;
    }
  }

  async deleteStory(storyId: number): Promise<void> {
    try {
      await apiService.delete(`/stories/${storyId}`);
    } catch (error) {
      console.error('Delete story error:', error);
      throw error;
    }
  }

  async viewStory(storyId: number): Promise<void> {
    try {
      await apiService.post(`/stories/${storyId}/view`);
    } catch (error) {
      console.error('View story error:', error);
      // Don't throw on view errors as they're not critical
    }
  }
}

export const storyService = new StoryService();
export default storyService;
