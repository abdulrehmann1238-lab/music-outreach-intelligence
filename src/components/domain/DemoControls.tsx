import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { failureManager, FailureType } from '../../mock/failures';

export const DemoControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [failuresOpen, setFailuresOpen] = useState(false);

  const {
    resetDemoData,
    fastForwardClock,
    emptyStateMode,
    setEmptyStateMode,
    addToast
  } = useAppStore();

  const handleInjectFailure = (type: FailureType, label: string) => {
    failureManager.inject(type);
    addToast({
      type: 'warning',
      title: 'Failure Injected',
      message: `"${label}" armed. It will be consumed on the next relevant action.`
    });
    setFailuresOpen(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-popover">
      {isOpen ? (
        <div className="bg-surface-elevated border-2 border-dashed border-border-strong rounded-lg shadow-3 p-4 w-72 text-xs font-sans animate-in fade-in-50 zoom-in-95">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <div className="flex items-center gap-1.5 font-semibold text-ink">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Demo Controls <span className="text-[10px] text-text-muted font-normal">(Demo only)</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-ink cursor-pointer p-0.5"
              aria-label="Minimize demo controls"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-text-secondary mb-3 leading-relaxed">
            Test resilience scenarios and safety gates without a live backend:
          </p>

          <div className="space-y-2">
            {/* Inject failure dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFailuresOpen(!failuresOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm bg-surface-sunken hover:bg-border text-ink border border-border text-left font-medium cursor-pointer"
              >
                <span>Inject failure scenario...</span>
                <span>{failuresOpen ? '▴' : '▾'}</span>
              </button>

              {failuresOpen && (
                <div className="mt-1 bg-surface-elevated border border-border-strong rounded-sm shadow-2 p-1 space-y-0.5 max-h-56 overflow-y-auto">
                  <button
                    onClick={() => handleInjectFailure('source_429', 'Source HTTP 429 (Rate-limited with backoff)')}
                    className="w-full text-left px-2 py-1 rounded-xs hover:bg-surface-sunken text-ink text-[11px] cursor-pointer"
                  >
                    1. Source HTTP 429 (Backoff retry demo)
                  </button>
                  <button
                    onClick={() => handleInjectFailure('source_403', 'Source HTTP 403 (Forbidden)')}
                    className="w-full text-left px-2 py-1 rounded-xs hover:bg-surface-sunken text-ink text-[11px] cursor-pointer"
                  >
                    2. Source HTTP 403 (Access forbidden)
                  </button>
                  <button
                    onClick={() => handleInjectFailure('local_model_timeout', 'Local model timeout (45s hold)')}
                    className="w-full text-left px-2 py-1 rounded-xs hover:bg-surface-sunken text-ink text-[11px] cursor-pointer"
                  >
                    3. Local model timeout (Record held)
                  </button>
                  <button
                    onClick={() => handleInjectFailure('model_malformed', 'Cloud model schema mismatch')}
                    className="w-full text-left px-2 py-1 rounded-xs hover:bg-surface-sunken text-ink text-[11px] cursor-pointer"
                  >
                    4. Model malformed output (Safe default hold)
                  </button>
                  <button
                    onClick={() => handleInjectFailure('gmail_429', 'Gmail rate limit 429')}
                    className="w-full text-left px-2 py-1 rounded-xs hover:bg-surface-sunken text-ink text-[11px] cursor-pointer"
                  >
                    5. Gmail provider 429 (Held safely)
                  </button>
                  <button
                    onClick={() => handleInjectFailure('send_timeout', 'Ambiguous send timeout')}
                    className="w-full text-left px-2 py-1 rounded-xs hover:bg-surface-sunken text-ink text-[11px] cursor-pointer"
                  >
                    6. Send timeout (Uncertain → Reconcile)
                  </button>
                  <button
                    onClick={() => handleInjectFailure('backup_mismatch', 'Backup count mismatch')}
                    className="w-full text-left px-2 py-1 rounded-xs hover:bg-surface-sunken text-ink text-[11px] cursor-pointer"
                  >
                    7. Backup verify mismatch (Refused restore)
                  </button>
                </div>
              )}
            </div>

            {/* Fast forward clock */}
            <button
              type="button"
              onClick={fastForwardClock}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm bg-surface-sunken hover:bg-border text-ink border border-border text-left font-medium cursor-pointer"
            >
              <span>Fast-forward to 17:00</span>
              <span className="text-[10px] text-text-muted">Trigger run</span>
            </button>

            {/* Toggle empty state */}
            <button
              type="button"
              onClick={() => {
                setEmptyStateMode(!emptyStateMode);
                addToast({
                  type: 'info',
                  title: !emptyStateMode ? 'Empty State View' : 'Populated Data View',
                  message: !emptyStateMode ? 'Displaying empty state representations' : 'Restored populated view'
                });
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm bg-surface-sunken hover:bg-border text-ink border border-border text-left font-medium cursor-pointer"
            >
              <span>{emptyStateMode ? 'Exit Empty State View' : 'Toggle Empty State View'}</span>
              <span className="text-[10px] text-text-muted">{emptyStateMode ? 'On' : 'Off'}</span>
            </button>

            {/* Reset data */}
            <button
              type="button"
              onClick={resetDemoData}
              className="w-full px-2.5 py-1.5 rounded-sm bg-error-tint hover:bg-error/20 text-error border border-error/30 text-left font-medium cursor-pointer"
            >
              Reset All Demo Data (Pristine Seed)
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-surface-elevated border-2 border-dashed border-border-strong hover:border-primary text-ink px-3 py-1.5 rounded-md shadow-2 text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors"
          title="Open interactive demo failure & state controls"
        >
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span>Demo Controls</span>
        </button>
      )}
    </div>
  );
};
