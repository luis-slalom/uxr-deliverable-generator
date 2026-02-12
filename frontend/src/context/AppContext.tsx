import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { AppState, AppAction, DeliverableType } from '../types/index.js';
import { apiService } from '../services/api.js';

const initialState: AppState = {
  files: [],
  context: '',
  deliverableType: 'blueprint',
  projects: [],
  currentDeliverable: null,
  isGenerating: false,
  isLoading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.payload] };
    case 'REMOVE_FILE':
      return { ...state, files: state.files.filter((f) => f.id !== action.payload) };
    case 'SET_CONTEXT':
      return { ...state, context: action.payload };
    case 'SET_DELIVERABLE_TYPE':
      return { ...state, deliverableType: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_CURRENT_DELIVERABLE':
      return { ...state, currentDeliverable: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET_FORM':
      return {
        ...state,
        files: [],
        context: '',
        currentDeliverable: null,
        error: null,
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  uploadFile: (file: File) => Promise<void>;
  removeFile: (fileId: string) => void;
  setContext: (context: string) => void;
  setDeliverableType: (type: DeliverableType) => void;
  generateDeliverable: () => Promise<void>;
  loadProjects: () => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  viewDeliverable: (projectId: string) => Promise<void>;
  resetForm: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const uploadFile = async (file: File) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const uploadedFile = await apiService.uploadFile(file);
      dispatch({ type: 'ADD_FILE', payload: uploadedFile });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const removeFile = (fileId: string) => {
    dispatch({ type: 'REMOVE_FILE', payload: fileId });
  };

  const setContext = (context: string) => {
    dispatch({ type: 'SET_CONTEXT', payload: context });
  };

  const setDeliverableType = (type: DeliverableType) => {
    dispatch({ type: 'SET_DELIVERABLE_TYPE', payload: type });
  };

  const generateDeliverable = async () => {
    try {
      dispatch({ type: 'SET_GENERATING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const fileIds = state.files.map((f) => f.id);
      const result = await apiService.generateDeliverable(
        fileIds,
        state.context,
        state.deliverableType
      );

      dispatch({ type: 'SET_CURRENT_DELIVERABLE', payload: result.deliverable });
      await loadProjects();
      dispatch({ type: 'RESET_FORM' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate deliverable';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  const loadProjects = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { projects } = await apiService.getProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await apiService.deleteProject(projectId);
      await loadProjects();

      // Clear current deliverable if it belongs to the deleted project
      if (state.currentDeliverable?.project_id === projectId) {
        dispatch({ type: 'SET_CURRENT_DELIVERABLE', payload: null });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete project';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const viewDeliverable = async (projectId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { deliverables } = await apiService.getProjectDeliverables(projectId);

      if (deliverables && deliverables.length > 0) {
        dispatch({ type: 'SET_CURRENT_DELIVERABLE', payload: deliverables[0] });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load deliverable';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const value: AppContextType = {
    state,
    dispatch,
    uploadFile,
    removeFile,
    setContext,
    setDeliverableType,
    generateDeliverable,
    loadProjects,
    deleteProject,
    viewDeliverable,
    resetForm,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
