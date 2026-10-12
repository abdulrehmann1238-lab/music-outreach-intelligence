import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Server,
  Database
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { FunnelStrip } from '../components/domain/FunnelStrip';
import { Button } from '../components/ui/Button';

export const Overview: React.FC = () => {
  const navigate = useNavigate();
  const {
    prospects,
    auditLogs,
    settings,
    startRun,
    emptyStateMode,
    demoClock
  } = useAppStore();

  const [runMenuOpen, setRunMenuOpen] = useState(false);

  // Derived counts
  const totalCount = prospects.length;
  const qualifiedCount = prospects.filter(p => p.score >= 75 && p.gates.every(g => g.passed)).length;
  const awaitingReviewCount = prospects.filter(p => p.status === 'needs_review' || p.status === 'held').length;
  const shortlistedCount = prospects.filter(p => p.status === 'shortlisted').length;
  const repliedCount = prospects.filter(p => p.status === 'replied').length;

  if (emptyStateMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-normal text-ink">Overview</h1>
            <p className="text-xs text-text-muted mt-1">First-run mode · No pipeline extractions recorded yet</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-dashed border-border-strong p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary-tint text-primary mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl text-ink font-normal">Welcome to Cadence Desk</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Your private music outreach intelligence system is connected to your local Ubuntu server. Start with a dry run to inspect the ingestion and qualification sequence.
          </p>
          <div className="pt-2">
            <Button variant="primary" onClick={() => startRun('companies', true)}>
              Start First Dry Run (Companies)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-normal text-ink tracking-tight">Overview</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {demoClock} · Pipelines idle · Next run at 17:00 UTC+8
          </p>
        </div>

        <div className="relative">
          <Button
            variant="primary"
            onClick={() => setRunMenuOpen(!runMenuOpen)}
            className="text-xs"
          >
            <Play className="w-3.5 h-3.5 mr-1" /> Run Now ▾
          </Button>

          {runMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-surface-elevated border border-border-strong rounded-lg shadow-3 p-1.5 z-popover text-xs font-sans animate-in fade-in-0 zoom-in-95">
              <button
                onClick={() => {
                  setRunMenuOpen(false);
                  navigate('/app/jobs');
                  startRun('companies', false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-surface-sunken text-ink font-medium cursor-pointer"
              >
                Run Companies Pipeline
              </button>
              <button
                onClick={() => {
                  setRunMenuOpen(false);
                  navigate('/app/jobs');
                  startRun('artists', false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-surface-sunken text-ink font-medium cursor-pointer"
              >
                Run Artists Pipeline
              </button>
              <div className="my-1 border-t border-border" />
              <button
                onClick={() => {
                  setRunMenuOpen(false);
                  navigate('/app/jobs');
                  startRun('companies', true);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-surface-sunken text-text-secondary cursor-pointer"
              >
                Execute Dry Run Only
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 1. "Needs You" Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card A: Shortlist ready */}
        <div
          onClick={() => navigate('/app/review')}
          className="p-4 rounded-xl bg-surface-elevated border border-border hover:border-primary/60 transition-all cursor-pointer shadow-1 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">Shortlist Review</span>
            <span className="font-mono text-xs font-bold text-primary bg-primary-tint px-2 py-0.5 rounded-xs">
              {shortlistedCount} records
            </span>
          </div>
          <div className="my-2">
            <div className="font-display text-3xl font-normal text-ink tnum group-hover:text-primary transition-colors">
              {shortlistedCount}
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Qualified candidates ready for cloud final review gate
            </p>
          </div>
          <div className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Inspect shortlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card B: Manual Decision needed */}
        <div
          onClick={() => navigate('/app/review')}
          className="p-4 rounded-xl bg-surface-elevated border border-border hover:border-warning/60 transition-all cursor-pointer shadow-1 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">Needs Decision</span>
            <span className="font-mono text-xs font-bold text-warning bg-warning-tint px-2 py-0.5 rounded-xs">
              {awaitingReviewCount} pending
            </span>
          </div>
          <div className="my-2">
            <div className="font-display text-3xl font-normal text-ink tnum group-hover:text-warning transition-colors">
              {awaitingReviewCount}
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Records requiring human review or held for uncertain activity
            </p>
          </div>
          <div className="text-xs font-medium text-warning flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Resolve decisions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card C: Replied Prospect */}
        <div
          onClick={() => navigate('/app/outreach')}
          className="p-4 rounded-xl bg-surface-elevated border border-border hover:border-accent/60 transition-all cursor-pointer shadow-1 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">Direct Replies</span>
            <span className="font-mono text-xs font-bold text-accent bg-accent-tint px-2 py-0.5 rounded-xs">
              1 new
            </span>
          </div>
          <div className="my-2">
            <div className="font-display text-3xl font-normal text-ink tnum group-hover:text-accent transition-colors">
              {repliedCount}
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Reply from Hoang Mirage: "Interested — can you send references?"
            </p>
          </div>
          <div className="text-xs font-medium text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View outreach history</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card D: Recent Run Partial status */}
        <div
          onClick={() => navigate('/app/jobs')}
          className="p-4 rounded-xl bg-surface-elevated border border-border hover:border-secondary transition-all cursor-pointer shadow-1 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">Run Timeline</span>
            <span className="font-mono text-xs font-bold text-text-secondary bg-surface-sunken px-2 py-0.5 rounded-xs">
              run_1230_ar
            </span>
          </div>
          <div className="my-2">
            <div className="font-display text-2xl font-normal text-ink flex items-center gap-2">
              <span className="text-warning">Partial</span>
              <span className="text-xs font-sans text-text-muted">429 backoff</span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              1 source deferred safely; 2 qualified prospects kept
            </p>
          </div>
          <div className="text-xs font-medium text-text-secondary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View run logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 2. Pipeline Funnel Strip */}
      <FunnelStrip
        rawCount={61}
        uniqueCount={totalCount}
        qualifiedCount={qualifiedCount}
        shortlistedCount={shortlistedCount}
        approvedCount={2}
        contactedCount={1}
      />

      {/* 3. Operational Grid: Activity Feed & Safety Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Recent Audit & Activity Feed */}
        <div className="lg:col-span-7 bg-surface rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-sans font-semibold text-sm text-ink">Recent Audit Trail</h3>
            <span className="text-xs font-mono text-text-muted">{auditLogs.length} total entries</span>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-2.5 rounded-md bg-surface-elevated border border-border text-xs gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{log.action}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-surface-sunken text-text-secondary">
                      {log.target}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-secondary leading-relaxed">
                    {log.after}
                  </div>
                </div>

                <div className="text-right text-[10px] text-text-muted whitespace-nowrap">
                  <div>{log.timestamp.split(', ')[1] || log.timestamp}</div>
                  <div>by {log.user}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => navigate('/app/system')}
              className="text-xs text-primary font-medium hover:underline cursor-pointer"
            >
              View complete system audit log →
            </button>
          </div>
        </div>

        {/* Right 5 cols: Safety & Health Panel */}
        <div className="lg:col-span-5 bg-surface rounded-xl border border-border p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-sans font-semibold text-sm text-ink">Operational Safety Status</h3>
              <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
              </span>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-md bg-surface-elevated border border-border">
                <span className="text-text-secondary">Live Sending Switch:</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded-xs ${
                  settings.safety.liveSendArmed
                    ? 'bg-accent-tint text-accent'
                    : 'bg-surface-sunken text-text-muted'
                }`}>
                  {settings.safety.liveSendArmed ? 'ARMED' : 'OFF (Default)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-surface-elevated border border-border">
                <span className="text-text-secondary">Cloud Model Review Gate:</span>
                <span className="font-mono text-primary bg-primary-tint px-2 py-0.5 rounded-xs font-semibold">
                  Mock Client (Capped)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-surface-elevated border border-border">
                <span className="text-text-secondary">Local Model Endpoint:</span>
                <span className="font-mono text-success bg-success-tint px-2 py-0.5 rounded-xs font-semibold">
                  llama.cpp / Qwen (Reachable)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-surface-elevated border border-border">
                <span className="text-text-secondary">Nightly SQLite Backup:</span>
                <span className="font-mono text-success bg-success-tint px-2 py-0.5 rounded-xs font-semibold">
                  Verified 11 Oct 03:10 ✓
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-surface-elevated border border-border">
                <span className="text-text-secondary">Scheduled Ingestion:</span>
                <span className="font-mono text-ink">5 runs/day (UTC+8)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border text-[11px] text-text-muted leading-relaxed">
            Hardware node: Ubuntu 22.04 LTS · SQLite database size: 4.2 MB · Zero unverified background calls.
          </div>
        </div>
      </div>
    </div>
  );
};
