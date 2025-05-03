import axios from 'axios';

// Base API URL configuration
// Use environment variable if available, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Task status types
export interface Task {
  task_id: string;
  status: 'running' | 'completed' | 'error';
  message: string;
  data?: any;
}

// Social data types
export interface YouTubeData {
  channel_name: string;
  item_count: number;
  file_path: string;
  created: number;
  data: any[];
  display_name?: string;
  has_error?: boolean;
}

export interface InstagramData {
  username: string;
  item_count: number;
  file_path: string;
  created: number;
  data: any[];
  display_name?: string;
  has_error?: boolean;
}

export interface SocialDataList {
  youtube: YouTubeData[];
  instagram: InstagramData[];
}

// API service
const api = {
  // Health check
  checkHealth: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // YouTube scraping
  scrapeYouTube: async (url: string): Promise<Task> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/scrape/youtube`, { url });
      return response.data;
    } catch (error) {
      console.error('YouTube scraping failed:', error);
      throw error;
    }
  },

  // Instagram scraping
  scrapeInstagram: async (username: string): Promise<Task> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/scrape/instagram`, { username });
      return response.data;
    } catch (error) {
      console.error('Instagram scraping failed:', error);
      throw error;
    }
  },

  // Get task status
  getTaskStatus: async (taskId: string): Promise<Task> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Get task status failed:', error);
      throw error;
    }
  },

  // List available data
  listData: async (): Promise<SocialDataList> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/data/list`);
      return response.data;
    } catch (error) {
      console.error('List data failed:', error);
      throw error;
    }
  },

  // Get data file
  getDataFile: async (filePath: string): Promise<any> => {
    try {
      // Fix path formatting - convert Windows-style backslashes to forward slashes
      // and remove leading drive letter or absolute path parts if present
      let normalizedPath = filePath.replace(/\\/g, '/');
      
      // Remove any drive letter or absolute path prefix (like C:/)
      normalizedPath = normalizedPath.replace(/^[A-Z]:[\/\\]/, '');
      
      // If it's an absolute path starting with /, remove the leading /
      normalizedPath = normalizedPath.replace(/^\//, '');
      
      console.log('Fetching data file from path:', normalizedPath);
      const response = await axios.get(`${API_BASE_URL}/data/${normalizedPath}`);
      return response.data;
    } catch (error) {
      console.error('Get data file failed:', error, 'Path:', filePath);
      throw error;
    }
  },
};

export default api; 