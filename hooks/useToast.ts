import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  createdAt: number;
}

const DEFAULT_DURATION = 4000;

interface ToastStore {
  toasts: ToastItem[];
  add: (type: ToastType, message: string, duration?: number) => string;
  remove: (id: string) => void;
}

let idCounter = 0;
function generateId() {
  idCounter += 1;
  return `toast-${Date.now()}-${idCounter}`;
}

export const useToast = create<ToastStore>((set, get) => ({
  toasts: [],
  add: (type, message, duration = DEFAULT_DURATION) => {
    const id = generateId();
    const item: ToastItem = {
      id,
      type,
      message,
      duration,
      createdAt: Date.now(),
    };
    set((state) => ({ toasts: [...state.toasts, item] }));

    if (duration > 0) {
      setTimeout(() => {
        get().remove(id);
      }, duration);
    }
    return id;
  },
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

/** Call from anywhere: toast.success("Done!"), toast.error("Failed"), toast.info("Note") */
export const toast = {
  success: (message: string, duration?: number) =>
    useToast.getState().add("success", message, duration),
  error: (message: string, duration?: number) =>
    useToast.getState().add("error", message, duration ?? 6000),
  info: (message: string, duration?: number) =>
    useToast.getState().add("info", message, duration),
};
