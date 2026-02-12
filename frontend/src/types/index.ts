export type DeliverableType = 'persona' | 'journey' | 'blueprint';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  sizeFormatted?: string;
  type: string;
  preview?: string;
  contentLength?: number;
}

export interface Project {
  id: string;
  name: string;
  deliverable_type: DeliverableType;
  created_at: string;
  updated_at: string;
}

export interface Deliverable {
  id: string;
  project_id: string;
  content: string;
  context_used: string | null;
  file_names: string | null;
  created_at: string;
}

export interface ProjectWithDeliverable {
  project: Project;
  deliverable: Deliverable;
}

export interface AppState {
  files: UploadedFile[];
  context: string;
  deliverableType: DeliverableType;
  projects: Project[];
  currentDeliverable: Deliverable | null;
  isGenerating: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_FILES'; payload: UploadedFile[] }
  | { type: 'ADD_FILE'; payload: UploadedFile }
  | { type: 'REMOVE_FILE'; payload: string }
  | { type: 'SET_CONTEXT'; payload: string }
  | { type: 'SET_DELIVERABLE_TYPE'; payload: DeliverableType }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_CURRENT_DELIVERABLE'; payload: Deliverable | null }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_FORM' };
