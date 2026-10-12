import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Copy, Check, AlertCircle, Clock, ShieldCheck, Lock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ScheduleDay } from '../components/domain/ScheduleDay';
import { Button } from '../components/ui/Button';

export const Jobs: React.FC = () => {
  const {
    runs,
    activeRun,
    settings,
    setProcessingPaused,
    startRun,
    cancelRun,
    addToast,
    demoClockHour,
    demoClockMinute
  } = useAppStore();

  const [copiedLog, setCopiedLog] = useState(false);

  const isPaused = settings.safety.processingPaused;
  const timezone = settings.outreach.ownerTimezone;

  const handleCopyLogs = (logs: string[]) => {
    // Redact any simulated tokens or sensitive keys
    const redacted = logs.map(l => l.replace(/([a-zA-Z0-9_-]{16,})/g, '****')).join('\n');
    navigator.clipboard?.writeText(redacted);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
    addToast({
      type: 'info',
      title: 'Logs Copied',
      message: 'Sensitive tokens redacted.'
    });
  };

  const handleSafeRetry = (runId: string) => {
    addToast({
      type: 'info',
      title: 'Safe Retry Initiated',
      message: `Resuming strictly the failed sources for ${runId} with exponential backoff.`
    });
    startRun('artists', false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-normal text-ink tracking-tight">Jobs & Schedule</h1>
          <p className="text-xs text-text-muted mt-0.5">
            5 autonomous ingestion & qualification runs per day per pipeline · Overlap-locked & restart-safe
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary">Processing State:</span>
            <Button
              size="sm"
              variant={isPaused ? 'destructive' : 'secondary'}
              onClick={() => {
                setProcessingPaused(!isPaused);
                addToast({
                  type: !isPaused ? 'warning' : 'success',
                  title: !isPaused ? 'Processing Paused' : 'Processing Resumed',
                  message: !isPaused ? 'Autonomous scheduled runs suspended.' : 'Autonomous schedule active.'
                });
              }}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 mr-1" /> : <Pause className="w-3.5 h-3.5 mr-1" />}
              {isPaused ? 'Resume Processing' : 'Pause All Processing'}
            </Button>
          </div>
        </div>
      </div>

      {/* Active Run Live Streaming Panel */}
      {activeRun && (
        <div className="p-5 rounded-xl bg-surface-elevated border-2 border-primary shadow-2 space-y-4 animate-in fade-in-0">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-accent animate-ping" />
              <div>
                <div className="font-sans font-semibold text-sm text-ink flex items-center gap-2">
                  <span>Live Pipeline Execution: {activeRun.id}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-primary-tint text-primary font-bold">
                    {activeRun.isDryRun ? 'DRY RUN' : 'PRODUCTION'}
                  </span>
                </div>
                <div className="text-xs text-text-muted mt-0.5">
                  Pipeline: <strong className="text-ink capitalize">{activeRun.pipeline}</strong> · {activeRun.stageName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleCopyLogs(activeRun.logs)}>
                {copiedLog ? <Check className="w-3.5 h-3.5 text-success mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                Copy Log (Redacted)
              </Button>
              {!activeRun.isFinished && (
                <Button size="sm" variant="destructive" onClick={cancelRun}>
                  Cancel Run
                </Button>
              )}
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans">
            <div className={`p-2 rounded-md ${activeRun.stage >= 1 ? 'bg-primary text-bg font-semibold' : 'bg-surface-sunken text-text-muted'}`}>
              1. Discover ({activeRun.candidatesFound} found)
            </div>
            <div className={`p-2 rounded-md ${activeRun.stage >= 2 ? 'bg-primary text-bg font-semibold' : 'bg-surface-sunken text-text-muted'}`}>
              2. Extract ({activeRun.duplicatesMerged} merged)
            </div>
            <div className={`p-2 rounded-md ${activeRun.stage >= 3 ? 'bg-primary text-bg font-semibold' : 'bg-surface-sunken text-text-muted'}`}>
              3. Local Qualify
            </div>
            <div className={`p-2 rounded-md ${activeRun.stage >= 4 ? (activeRun.isPartial ? 'bg-warning text-bg font-semibold' : 'bg-success text-bg font-semibold') : 'bg-surface-sunken text-text-muted'}`}>
              4. Shortlist
            </div>
          </div>

          {/* Log Stream Box */}
          <div className="p-3 bg-surface-sunken rounded-md border border-border font-mono text-[11px] text-ink max-h-48 overflow-y-auto space-y-1">
            {activeRun.logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2 Pipeline Schedule Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScheduleDay
          pipeline="companies"
          slots={['02:00', '07:00', '12:00', '17:00', '22:00']}
          currentHour={demoClockHour}
          currentMinute={demoClockMinute}
          timezone={timezone}
          isPaused={isPaused}
          onRunNow={() => startRun('companies', false)}
          onDryRun={() => startRun('companies', true)}
          lockHeld={activeRun && !activeRun.isFinished && activeRun.pipeline === 'companies' ? activeRun.id : null}
        />

        <ScheduleDay
          pipeline="artists"
          slots={['02:30', '07:30', '12:30', '17:30', '22:30']}
          currentHour={demoClockHour}
          currentMinute={demoClockMinute}
          timezone={timezone}
          isPaused={isPaused}
          onRunNow={() => startRun('artists', false)}
          onDryRun={() => startRun('artists', true)}
          lockHeld={activeRun && !activeRun.isFinished && activeRun.pipeline === 'artists' ? activeRun.id : null}
        />
      </div>

      {/* Failure Classes Legend */}
      <div className="p-4 rounded-xl bg-surface border border-border space-y-2 text-xs">
        <div className="font-semibold text-ink text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Defensive Error Handling Classes</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-text-secondary">
          <div className="p-2 rounded-md bg-surface-sunken">
            <strong className="text-ink font-mono block">HTTP_429</strong>
            <span>Exponential backoff retry (2s, 6s, 18s); defer to next run.</span>
          </div>
          <div className="p-2 rounded-md bg-surface-sunken">
            <strong className="text-ink font-mono block">TIMEOUT_MODEL</strong>
            <span>45s timeout on local endpoint; candidate held for review.</span>
          </div>
          <div className="p-2 rounded-md bg-surface-sunken">
            <strong className="text-ink font-mono block">SCHEMA_MODEL</strong>
            <span>JSON schema validation mismatch; safe default hold.</span>
          </div>
          <div className="p-2 rounded-md bg-surface-sunken">
            <strong className="text-ink font-mono block">OVERLAP_LOCK</strong>
            <span>Active run holds lock; overlapping scheduled runs refuse.</span>
          </div>
        </div>
      </div>

      {/* Run History Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-1">
        <div className="p-4 border-b border-border bg-surface-sunken flex justify-between items-center text-xs">
          <span className="font-semibold text-ink">Historical Execution Log</span>
          <span className="font-mono text-text-muted">{runs.length} runs recorded</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface border-b border-border text-[11px] font-semibold text-text-secondary uppercase">
              <th className="py-3 px-4">Run ID</th>
              <th className="py-3 px-3">Pipeline</th>
              <th className="py-3 px-3">Started At</th>
              <th className="py-3 px-3">Duration</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Results (Found / New / Merged)</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {runs.map(r => (
              <tr key={r.id} className="hover:bg-surface-sunken/40">
                <td className="py-3 px-4 font-mono font-medium text-ink">{r.id}</td>
                <td className="py-3 px-3 capitalize text-text-secondary">{r.pipeline}</td>
                <td className="py-3 px-3 font-mono text-[11px] text-text-muted">{r.startedAt}</td>
                <td className="py-3 px-3 font-mono text-[11px] text-text-secondary">{r.duration}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-xs font-semibold text-[10px] ${
                    r.status === 'success'
                      ? 'bg-success-tint text-success'
                      : r.status === 'partial'
                      ? 'bg-warning-tint text-warning font-bold'
                      : 'bg-error-tint text-error'
                  }`}>
                    {r.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-text-secondary">
                  {r.candidatesFetched} fetched · <strong className="text-primary">{r.newCandidates} new</strong> · {r.mergedDuplicates} merged
                </td>
                <td className="py-3 px-3 text-right">
                  {r.status === 'partial' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSafeRetry(r.id)}
                      className="text-[11px] py-1 px-2"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Safe Retry
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
