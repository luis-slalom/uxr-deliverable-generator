import axios from 'axios';
import type {
  UploadedFile,
  Project,
  Deliverable,
  DeliverableType,
  ProjectWithDeliverable,
} from '../types/index.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  /**
   * Upload a file
   */
  async uploadFile(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadedFile>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Generate a deliverable
   */
  async generateDeliverable(
    fileIds: string[],
    context: string,
    deliverableType: DeliverableType,
    projectName?: string
  ): Promise<ProjectWithDeliverable> {
    const response = await api.post<ProjectWithDeliverable>('/api/generate', {
      files: fileIds,
      context,
      deliverableType,
      projectName,
    });

    return response.data;
  },

  /**
   * Get all projects
   */
  async getProjects(): Promise<{ projects: Project[]; count: number }> {
    const response = await api.get<{ projects: Project[]; count: number }>('/api/projects');
    return response.data;
  },

  /**
   * Get a project by ID
   */
  async getProject(id: string): Promise<Project> {
    const response = await api.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  /**
   * Get project deliverables
   */
  async getProjectDeliverables(id: string): Promise<{
    project: Project;
    deliverables: Deliverable[];
  }> {
    const response = await api.get<{ project: Project; deliverables: Deliverable[] }>(
      `/api/projects/${id}/deliverables`
    );
    return response.data;
  },

  /**
   * Update a project
   */
  async updateProject(id: string, name: string): Promise<Project> {
    const response = await api.put<Project>(`/api/projects/${id}`, { name });
    return response.data;
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    await api.delete(`/api/projects/${id}`);
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default apiService;
