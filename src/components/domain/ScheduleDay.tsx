import React from 'react';
import { Play, Shield, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

interface ScheduleDayProps {
  pipeline: 'companies' | 'artists';
  slots: string[];
  currentHour: number;
  currentMinute: number;
  timezone: string;
  isPaused: boolean;
  onRunNow: () => void;
  onDryRun: () => void;
  lockHeld?: string | null;
}

export const ScheduleDay: React.FC<ScheduleDayProps> = ({
  pipeline,
  slots,
  currentHour,
  timezone,
  isPaused,
  onRunNow,
  onDryRun,
  lockHeld
}) => {
  const title = pipeline === 'companies' ? 'Companies Pipeline (Labels & Sync)' : 'Artists Pipeline (Independent Talent)';

  return (
    <div className="bg-surface rounded-lg border border-border p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-semibold text-sm text-ink">{title}</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-surface-sunken text-text-secondary border border-border">
              {timezone}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">5 daily scheduled extraction and local qualification slots</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onDryRun}
            title="Simulate execution without touching outreach tables"
          >
            Dry Run
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={onRunNow}
            disabled={isPaused || !!lockHeld}
            disabledReason={isPaused ? 'Processing is currently paused' : lockHeld ? `Lock held by ${lockHeld}` : undefined}
          >
            <Play className="w-3 h-3 mr-1" />
            Run Now
          </Button>
        </div>
      </div>

      {/* 5-Slot Daily Timeline */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
          Daily Schedule Slots
        </div>

        <div className="grid grid-cols-5 gap-2">
          {slots.map((timeStr, idx) => {
            const slotHour = parseInt(timeStr.split(':')[0], 10);
            const isCompleted = slotHour < currentHour;
            const isNext = slotHour === 17 || (slotHour > currentHour && idx === 3);
            const isUpcoming = slotHour > currentHour && !isNext;

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-md border text-center transition-all ${
                  isPaused
                    ? 'bg-surface-sunken border-border opacity-60'
                    : isNext
                    ? 'bg-accent-tint/40 border-accent text-accent shadow-1'
                    : isCompleted
                    ? 'bg-surface-elevated border-border text-ink'
                    : 'bg-surface-sunken/40 border-border text-text-muted'
                }`}
              >
                <div className="font-mono text-xs font-semibold tnum">
                  {timeStr}
                </div>
                <div className="text-[10px] mt-1 font-medium">
                  {isPaused
                    ? 'Skipped (Paused)'
                    : isNext
                    ? 'Next Run ◐'
                    : isCompleted
                    ? 'Done ✓'
                    : 'Scheduled'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overlap & Safety Status Footer */}
      <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-text-muted gap-2">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-text-muted" />
          <span>
            Overlap lock: {lockHeld ? <span className="font-mono text-error font-medium">Locked ({lockHeld})</span> : <span className="text-success font-medium">No lock held (Available)</span>}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-text-secondary">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>Scheduled runs never enable live sending.</span>
        </div>
      </div>
    </div>
  );
};
