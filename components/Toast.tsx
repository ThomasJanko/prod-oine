"use client";

import { useToast } from "@/hooks/useToast";
import type { ToastType } from "@/hooks/useToast";

const typeStyles: Record<
  ToastType,
  { bg: string; border: string; icon: string }
> = {
  success: {
    bg: "bg-wood-dark/95 text-cream",
    border: "border-wood",
    icon: "✓",
  },
  error: {
    bg: "bg-red-800/95 text-white",
    border: "border-red-600",
    icon: "✕",
  },
  info: {
    bg: "bg-metal-dark/95 text-cream",
    border: "border-metal-muted",
    icon: "i",
  },
};

function ToastItem({
  id,
  type,
  message,
  onDismiss,
}: {
  id: string;
  type: ToastType;
  message: string;
  onDismiss: (id: string) => void;
}) {
  const style = typeStyles[type];
  return (
    <div
      role="alert"
      className={`flex items-center gap-3 px-4 py-3 rounded border shadow-lg ${style.bg} ${style.border} min-w-[280px] max-w-[420px]`}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold"
        aria-hidden
      >
        {style.icon}
      </span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="shrink-0 p-1 rounded hover:bg-white/20 transition-colors"
        aria-label="Fermer"
      >
        <span className="sr-only">Fermer</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts, remove } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            id={t.id}
            type={t.type}
            message={t.message}
            onDismiss={remove}
          />
        ))}
      </div>
    </div>
  );
}
