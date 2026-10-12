import React from 'react';
import { ScoreComponent } from '../../types';

interface ScoreBreakdownProps {
  score: number;
  components: ScoreComponent[];
  highlightedEvidenceId?: string | null;
  onHoverComponent?: (evidenceIds: string[]) => void;
  onLeaveComponent?: () => void;
  onToggleUnsupported?: () => void;
  unsupportedClaimToggled?: boolean;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  score,
  components,
  highlightedEvidenceId,
  onHoverComponent,
  onLeaveComponent,
  onToggleUnsupported,
  unsupportedClaimToggled
}) => {
  // Compute sum string
  const parts = components.map(c => (c.isUnsupported ? '0' : Math.round(c.rawRatio * c.defaultWeight)));
  const sumString = `${parts.join(' + ')} = ${score}`;

  return (
    <div className="bg-surface rounded-lg border border-border p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-sans font-semibold text-sm text-ink">Scorecard Breakdown</h3>
          <p className="text-xs text-text-muted mt-0.5">Auditable weighted criteria (100 pts total)</p>
        </div>
        <div className="flex items-center gap-2">
          {onToggleUnsupported && (
            <button
              type="button"
              onClick={onToggleUnsupported}
              className={`text-[11px] font-sans px-2.5 py-1 rounded-sm border transition-colors cursor-pointer ${
                unsupportedClaimToggled
                  ? 'bg-error-tint text-error border-error/40 font-medium'
                  : 'bg-surface-sunken hover:bg-border text-text-secondary border-border'
              }`}
              title="Demonstrates that ungrounded AI claims earn 0 points and strike through"
            >
              {unsupportedClaimToggled ? 'Reset claim' : 'Show unsupported claim'}
            </button>
          )}
          <div className="text-right">
            <span className="font-display text-2xl font-normal text-ink tnum">{score}</span>
            <span className="text-xs text-text-muted"> / 100</span>
          </div>
        </div>
      </div>

      {/* Component Rows */}
      <div className="space-y-3">
        {components.map((comp) => {
          const earned = comp.isUnsupported ? 0 : Math.round(comp.rawRatio * comp.defaultWeight);
          const percent = Math.min(100, Math.round((earned / comp.defaultWeight) * 100));
          const isHighlighted = highlightedEvidenceId && comp.evidenceIds.includes(highlightedEvidenceId);

          return (
            <div
              key={comp.id}
              onMouseEnter={() => onHoverComponent?.(comp.evidenceIds)}
              onMouseLeave={() => onLeaveComponent?.()}
              className={`p-2 rounded-md transition-all duration-150 cursor-pointer ${
                isHighlighted
                  ? 'bg-primary-tint/70 border-l-2 border-primary pl-2.5'
                  : 'hover:bg-surface-sunken'
              } ${comp.isUnsupported ? 'bg-error-tint/20' : ''}`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium ${
                      comp.isUnsupported ? 'line-through text-text-muted' : 'text-ink'
                    }`}
                  >
                    {comp.name}
                  </span>
                  {comp.isUnsupported && (
                    <span className="text-[10px] text-error font-medium bg-error-tint px-1.5 py-0.2 rounded-xs border border-error/30">
                      Unsupported: 0 pts
                    </span>
                  )}
                </div>

                <div className="font-mono text-xs text-text-secondary tnum flex items-center gap-1.5">
                  <span className={comp.isUnsupported ? 'line-through text-error' : 'font-semibold text-ink'}>
                    {earned}
                  </span>
                  <span className="text-text-muted">/ {comp.defaultWeight}</span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-1.5 w-full bg-surface-sunken rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    comp.isUnsupported
                      ? 'w-0 bg-error'
                      : percent >= 80
                      ? 'bg-primary'
                      : percent >= 60
                      ? 'bg-secondary'
                      : 'bg-warning'
                  }`}
                  style={{ width: `${comp.isUnsupported ? 0 : percent}%` }}
                />
              </div>

              {/* Linked Evidence chips */}
              {comp.evidenceIds.length > 0 && !comp.isUnsupported && (
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[10px] text-text-muted">Evidence:</span>
                  {comp.evidenceIds.map(evId => (
                    <span
                      key={evId}
                      className="text-[10px] font-mono text-primary bg-primary-tint px-1 rounded-xs"
                    >
                      {evId}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Arithmetic Proof Line */}
      <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-1">
        <div className="font-mono text-text-secondary text-[11px] tnum">
          Proof: {sumString}
        </div>
        <div className="text-[11px] text-text-muted italic">
          "If it isn't in the evidence, it scores zero."
        </div>
      </div>
    </div>
  );
};
