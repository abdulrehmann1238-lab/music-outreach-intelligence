import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-toast flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map(toast => {
        const isError = toast.type === 'error';
        const role = isError ? 'alert' : 'status';

        const borderStyles = {
          success: 'border-success/40 bg-surface text-ink',
          warning: 'border-warning/40 bg-surface text-ink',
          error: 'border-error/40 bg-surface text-ink',
          info: 'border-info/40 bg-surface text-ink',
        }[toast.type];

        const iconStyles = {
          success: 'text-success',
          warning: 'text-warning',
          error: 'text-error',
          info: 'text-info',
        }[toast.type];

        return (
          <div
            key={toast.id}
            role={role}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-3 transition-all duration-200 transform translate-y-0 ${borderStyles}`}
          >
            <div className={`mt-0.5 shrink-0 ${iconStyles}`}>
              {toast.type === 'success' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toast.type === 'warning' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {toast.type === 'info' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-ink">{toast.title}</div>
              {toast.message && (
                <div className="text-xs text-text-secondary mt-0.5 leading-relaxed">{toast.message}</div>
              )}
            </div>

            {toast.undoAction && (
              <button
                type="button"
                onClick={() => {
                  toast.undoAction?.();
                  removeToast(toast.id);
                }}
                className="text-xs font-semibold text-primary hover:text-primary-hover underline underline-offset-2 shrink-0 cursor-pointer"
              >
                Undo
              </button>
            )}

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-ink shrink-0 cursor-pointer p-0.5"
              aria-label="Close notification"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};
