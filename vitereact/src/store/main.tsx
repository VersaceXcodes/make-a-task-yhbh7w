import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// --- Types Definition ---

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface TaskItem {
  task_id: number;
  title: string;
  description: string | null;
  due_date: string | null; // "YYYY-MM-DD"
  due_time: string | null; // "HH:MM"
  planned_completion_date: string | null; // "YYYY-MM-DD"
  estimated_finish_time: number | null; // in hours
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

export type TaskStatus = TaskItem['status'];
export const TASK_STATUS_OPTIONS: TaskStatus[] = ['pending', 'in_progress', 'completed'];

export type SortBy = 'due_date' | 'planned_completion_date' | 'title' | 'created_at' | 'updated_at';
export type SortOrder = 'asc' | 'desc';

export interface ModalVisibility {
  task_creation: boolean;
  task_edit: boolean;
  task_deletion_confirmation: boolean;
}

export interface ActiveModalData {
  task_id_for_edit: number | null;
  task_id_for_delete: number | null;
  task_title_for_delete: string | null;
}

export interface Notification {
  message: string | null;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface TaskState {
  tasks: TaskItem[];
  filter: 'all' | 'pending' | 'in_progress' | 'completed';
  sort_by: SortBy;
  sort_order: SortOrder;
  is_loading: boolean;
  error: string | null;
  modal_visibility: ModalVisibility;
  active_modal_data: ActiveModalData;
  notification: Notification;
}

// --- Actions Interface ---
// These are the methods exposed by the store that components can call.
interface TaskActions {
  // State setters - Components will call these after making API calls
  set_tasks: (tasks: TaskItem[]) => void;
  set_filter: (filter: TaskState['filter']) => void;
  set_sort: (sort_by: TaskState['sort_by'], sort_order: TaskState['sort_order']) => void;
  set_loading: (isLoading: boolean) => void;
  set_error: (error: string | null) => void;

  // UI Control Actions
  open_modal: (modal_name: keyof ModalVisibility, data?: Partial<ActiveModalData>) => void;
  close_modal: (modal_name: keyof ModalVisibility) => void;
  set_modal_visibility: (modal_name: keyof ModalVisibility, is_visible: boolean) => void;
  set_active_modal_data: (data: Partial<ActiveModalData>) => void;

  // Notification Actions
  show_notification: (message: string, type: Notification['type']) => void;
  clear_notification: () => void;

  // Initialization
  initialize_state_from_local_storage: () => void;
}

// --- Store Definition ---
type AppStore = TaskState & TaskActions;

const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  sort_by: 'due_date',
  sort_order: 'asc',
  is_loading: false,
  error: null,
  modal_visibility: {
    task_creation: false,
    task_edit: false,
    task_deletion_confirmation: false,
  },
  active_modal_data: {
    task_id_for_edit: null,
    task_id_for_delete: null,
    task_title_for_delete: null,
  },
  notification: {
    message: null,
    type: 'info',
  },
};

export const useAppStore = create<AppStore>(
  persist(
    (set, get) => ({
      ...initialState,

      // --- State Setter Actions ---
      set_tasks: (tasks) => set({ tasks }),
      set_filter: (filter) => {
        set({ filter });
        // Note: The component consuming the store will re-trigger fetch based on filter change
      },
      set_sort: (sort_by, sort_order) => {
        set({ sort_by, sort_order });
        // Note: The component consuming the store will re-trigger fetch based on sort change
      },
      set_loading: (isLoading) => set({ is_loading: isLoading }),
      set_error: (error) => set({ error }),

      // --- UI Control Actions ---
      open_modal: (modal_name, data) => {
        set((state) => ({
          modal_visibility: {
            ...state.modal_visibility,
            [modal_name]: true,
          },
          active_modal_data: data ? { ...state.active_modal_data, ...data } : state.active_modal_data,
        }));
      },
      close_modal: (modal_name) => {
        set((state) => ({
          modal_visibility: {
            ...state.modal_visibility,
            [modal_name]: false,
          },
          // Clear specific modal data when closing
          active_modal_data: (() => {
            if (modal_name === 'task_edit') {
              return { ...state.active_modal_data, task_id_for_edit: null };
            }
            if (modal_name === 'task_deletion_confirmation') {
              return { ...state.active_modal_data, task_id_for_delete: null, task_title_for_delete: null };
            }
            return state.active_modal_data;
          })(),
        }));
      },
      set_modal_visibility: (modal_name, is_visible) => {
        set((state) => ({
          modal_visibility: {
            ...state.modal_visibility,
            [modal_name]: is_visible,
          },
        }));
      },
      set_active_modal_data: (data) => {
        set((state) => ({
          active_modal_data: { ...state.active_modal_data, ...data },
        }));
      },

      // --- Notification Actions ---
      show_notification: (message, type) => {
        set({ notification: { message, type } });
        // Automatically clear notification after a few seconds
        setTimeout(() => {
          // Ensure notification is still active before clearing
          if (get().notification.message === message) {
            get().clear_notification();
          }
        }, 3000); // Notification visible for 3 seconds
      },
      clear_notification: () => {
        set({ notification: { message: null, type: 'info' } });
      },

      // --- Initialization ---
      // This method is designed to be called by the root component to load
      // persisted state and potentially trigger initial data fetching.
      initialize_state_from_local_storage: () => {
         // Zustand persist middleware automatically loads from localStorage on store creation.
         // This action could be used for additional initialization logic if needed,
         // e.g., triggering an initial fetch based on loaded filter/sort.
         // For now, it serves as a placeholder if more complex init is required later.
      },
    }),
    {
      name: 'make-a-task-storage', // name of the item in the storage
      // Specify which parts of the state to persist.
      // UI states like modale visibility or loading states are typically not persisted.
      partialize: (state) => ({
        tasks: state.tasks,
        filter: state.filter,
        sort_by: state.sort_by,
        sort_order: state.sort_order,
      }),
      // Optional: Set skipHydration to true if you want to manually hydrate
      // or if you want to avoid initial hydration from localStorage on server.
      // skipHydration: true,
    }
  )
);

// Exporting helper types and constants
export type { TaskItem, TaskStatus, SortBy, SortOrder, ModalVisibility, ActiveModalData, Notification, TaskState };
