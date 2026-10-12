import React from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { GateResult } from '../../types';

interface GateChecklistProps {
  gates: GateResult[];
}

export const GateChecklist: React.FC<GateChecklistProps> = ({ gates }) => {
  const hasFailedGates = gates.some(g => !g.passed);

  return (
    <div className="bg-surface rounded-lg border border-border p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-sans font-semibold text-sm text-ink">Hard Gate Verification</h3>
          <p className="text-xs text-text-muted mt-0.5">Non-negotiable criteria that override any numerical score</p>
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-xs border ${
              !hasFailedGates
                ? 'bg-success-tint text-success border-success/30'
                : 'bg-error-tint text-error border-error/40 font-bold'
            }`}
          >
            {!hasFailedGates ? 'All 10 Gates Passed ✓' : 'Hard Gate Failed ✗'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {gates.map((gate) => (
          <div
            key={gate.id}
            className={`flex items-start gap-2.5 p-2.5 rounded-md border text-xs transition-colors ${
              gate.passed
                ? 'bg-surface-elevated border-border text-ink'
                : 'bg-error-tint/30 border-error/40 text-error'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {gate.passed ? (
                <div className="w-4 h-4 rounded-full bg-success-tint text-success flex items-center justify-center border border-success/30">
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-error-tint text-error flex items-center justify-center border border-error/40">
                  <X className="w-2.5 h-2.5" strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-[11px] text-text-secondary">{gate.id}</span>
                <span className="font-semibold text-ink">{gate.name}</span>
              </div>
              <p className="text-text-secondary text-[11px] mt-0.5 leading-relaxed">{gate.reason}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 text-[11px] text-text-muted flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
        <span>Rule: A high score never overrides a hard gate. Approval is locked if any gate fails.</span>
      </div>
    </div>
  );
};
