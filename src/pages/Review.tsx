import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Power, Shield, Check, X, Clock, Play, AlertCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Prospect, ProspectStatus } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';

export const Review: React.FC = () => {
  const navigate = useNavigate();
  const {
    prospects,
    settings,
    updateProspectStatus,
    runCloudReviewBatch,
    stopCloudReview,
    addToast
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'needs_review' | 'shortlist' | 'decided'>('shortlist');
  const [selectedReviewId, setSelectedReviewId] = useState<string>('co_0004');
  const [reviewingBatch, setReviewingBatch] = useState(false);
  const [selectedPayloadId, setSelectedPayloadId] = useState<string>('co_0005');

  // Groups
  const needsReviewList = prospects.filter(p => p.status === 'needs_review' || p.status === 'held');
  const shortlistedList = prospects.filter(p => p.status === 'shortlisted');
  const decidedList = prospects.filter(p => p.cloudDecision !== undefined);

  const activeFocusedProspect = needsReviewList.find(p => p.id === selectedReviewId) || needsReviewList[0];
  const payloadProspect = prospects.find(p => p.id === selectedPayloadId) || shortlistedList[0] || prospects[0];

  const cloudEnabled = settings.safety.cloudReviewEnabled;
  const cloudRunCap = settings.safety.cloudRunCap;
  const cloudMonthlyCap = settings.safety.cloudMonthlyCap;
  const cloudReviewsThisMonth = settings.safety.cloudReviewsThisMonth;

  const handleDecision = (status: ProspectStatus, reason: string) => {
    if (!activeFocusedProspect) return;
    updateProspectStatus(activeFocusedProspect.id, status, reason);
    addToast({
      type: 'info',
      title: 'Decision Recorded',
      message: `${activeFocusedProspect.name} marked as ${status}.`
    });
    // Auto-advance to next item
    const remaining = needsReviewList.filter(p => p.id !== activeFocusedProspect.id);
    if (remaining.length > 0) {
      setSelectedReviewId(remaining[0].id);
    }
  };

  const handleRunCloudReview = async () => {
    if (!cloudEnabled) {
      addToast({
        type: 'error',
        title: 'Cloud Review Disabled',
        message: 'Cloud review gate is stopped. Re-enable in Safety settings.'
      });
      return;
    }

    if (shortlistedList.length === 0) {
      addToast({
        type: 'info',
        title: 'Shortlist Empty',
        message: 'All shortlisted candidates have already been evaluated.'
      });
      return;
    }

    setReviewingBatch(true);
    const targetIds = shortlistedList.map(p => p.id);

    try {
      const results = await runCloudReviewBatch(targetIds);
      setReviewingBatch(false);
      addToast({
        type: 'success',
        title: 'Batch Review Complete',
        message: `${results.approvedCount} approved for outreach dry-run, ${results.deferredCount} deferred, ${results.rejectedCount} rejected.`
      });
      setActiveTab('decided');
    } catch (err) {
      setReviewingBatch(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-normal text-ink tracking-tight">Review</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {needsReviewList.length} require human decision · {shortlistedList.length} shortlisted for final cloud review gate
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-md border border-border">
          <button
            onClick={() => setActiveTab('needs_review')}
            className={`px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'needs_review' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
            }`}
          >
            Needs Review ({needsReviewList.length})
          </button>
          <button
            onClick={() => setActiveTab('shortlist')}
            className={`px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'shortlist' ? 'bg-surface-elevated text-primary font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
            }`}
          >
            Shortlist Gate ({shortlistedList.length})
          </button>
          <button
            onClick={() => setActiveTab('decided')}
            className={`px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
              activeTab === 'decided' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
            }`}
          >
            Decided ({decidedList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: NEEDS REVIEW MASTER/DETAIL */}
      {activeTab === 'needs_review' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Master List */}
          <div className="lg:col-span-5 bg-surface rounded-xl border border-border overflow-hidden shadow-1">
            <div className="p-3 border-b border-border bg-surface-sunken flex justify-between items-center text-xs">
              <span className="font-semibold text-ink">Pending Decision Queue</span>
              <span className="font-mono text-text-muted">{needsReviewList.length} items</span>
            </div>

            <div className="divide-y divide-border max-h-[560px] overflow-y-auto">
              {needsReviewList.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted">
                  Nothing waiting. New qualified prospects appear after the next scheduled run at 17:00.
                </div>
              ) : (
                needsReviewList.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedReviewId(p.id)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      activeFocusedProspect?.id === p.id
                        ? 'bg-primary-tint/40 border-l-4 border-primary'
                        : 'hover:bg-surface-sunken'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-ink">{p.name}</span>
                      <span className="font-mono font-bold text-xs text-ink tnum">{p.score}</span>
                    </div>
                    <div className="text-[11px] text-text-muted flex justify-between items-center">
                      <span>{p.city}, {p.countryCode} · {p.type}</span>
                      <StatusBadge status={p.status} size="sm" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Detail Pane */}
          {activeFocusedProspect ? (
            <div className="lg:col-span-7 bg-surface-elevated rounded-xl border border-border-strong p-6 shadow-2 space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <h2 className="font-display text-2xl font-normal text-ink">{activeFocusedProspect.name}</h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    {activeFocusedProspect.city}, {activeFocusedProspect.country} · Score {activeFocusedProspect.score}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(activeFocusedProspect.type === 'artist' ? `/app/artists/${activeFocusedProspect.id}` : `/app/companies/${activeFocusedProspect.id}`)}
                >
                  Full Record →
                </Button>
              </div>

              {/* Reason card */}
              <div className="p-3.5 rounded-md bg-surface-sunken border border-border text-xs space-y-1">
                <span className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">
                  Local Model Qualification Note
                </span>
                <p className="text-ink leading-relaxed">
                  "{activeFocusedProspect.localModelRationale}"
                </p>
              </div>

              {/* Hard Gates Preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                  Hard Gates Status
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {activeFocusedProspect.gates.slice(0, 6).map(g => (
                    <div key={g.id} className="p-2 rounded-xs bg-surface border border-border flex justify-between">
                      <span className="text-text-secondary">{g.name}</span>
                      <span className={g.passed ? 'text-success font-semibold' : 'text-error font-bold'}>
                        {g.passed ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Decision Action Bar */}
              <div className="pt-4 border-t border-border space-y-2">
                <div className="text-[11px] font-medium text-text-muted">
                  Keyboard shortcuts: <kbd className="font-mono">Q</kbd> Qualify · <kbd className="font-mono">H</kbd> Hold · <kbd className="font-mono">R</kbd> Reject · <kbd className="font-mono">S</kbd> Suppress
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleDecision('shortlisted', 'Manual review: Qualified for cloud shortlist')}
                  >
                    Qualify (Shortlist)
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDecision('held', 'Manual review: Hold for further verification')}
                  >
                    Hold
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDecision('rejected', 'Manual review: Unsuitable candidate')}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDecision('suppressed', 'Manual review: Permanent suppression')}
                  >
                    Suppress
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-7 p-12 text-center text-xs text-text-muted bg-surface rounded-xl border border-border">
              Select a prospect from the queue to review evidence and record a decision.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SHORTLIST CLOUD GATE */}
      {activeTab === 'shortlist' && (
        <div className="space-y-6">
          {/* Top Cap Meter Bar */}
          <div className="p-4 rounded-xl bg-surface border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-1">
            <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
              <div>
                <span className="text-text-muted">This Run Batch:</span>{' '}
                <strong className="font-mono text-ink">{shortlistedList.length} / {cloudRunCap} Max</strong>
              </div>
              <div className="h-3 w-px bg-border" />
              <div>
                <span className="text-text-muted">Monthly Reviews:</span>{' '}
                <strong className="font-mono text-ink">{cloudReviewsThisMonth} / {cloudMonthlyCap}</strong>
              </div>
              <div className="h-3 w-px bg-border" />
              <div>
                <span className="text-text-muted">Est. Cost:</span>{' '}
                <strong className="font-mono text-success">$0.00 (Mock client)</strong>
              </div>
              <div className="h-3 w-px bg-border" />
              <span className="px-2 py-0.5 rounded-xs bg-primary-tint text-primary font-mono text-[11px] font-semibold">
                Client: Mock Endpoint
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={cloudEnabled ? 'destructive' : 'primary'}
                onClick={stopCloudReview}
                title="Immediately freeze cloud reviews"
              >
                <Power className="w-3.5 h-3.5 mr-1" />
                {cloudEnabled ? 'Stop Cloud Review' : 'Enable Cloud Review'}
              </Button>

              <Button
                size="sm"
                variant="primary"
                loading={reviewingBatch}
                disabled={!cloudEnabled || shortlistedList.length === 0}
                disabledReason={!cloudEnabled ? 'Cloud review is stopped' : shortlistedList.length === 0 ? 'No candidates in shortlist' : undefined}
                onClick={handleRunCloudReview}
              >
                <Play className="w-3.5 h-3.5 mr-1" /> Run Final Review (Batch of {shortlistedList.length})
              </Button>
            </div>
          </div>

          {!cloudEnabled && (
            <div className="p-3.5 rounded-lg bg-error-tint border border-error/40 text-xs text-error font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Cloud review is OFF. Shortlist is frozen. Nothing will be approved or sent to cloud model.</span>
            </div>
          )}

          {/* 2-Pane Shortlist & Payload Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 6 cols: Shortlist Table */}
            <div className="lg:col-span-6 bg-surface rounded-xl border border-border overflow-hidden shadow-1">
              <div className="p-3 border-b border-border bg-surface-sunken flex justify-between items-center text-xs">
                <span className="font-semibold text-ink">Shortlisted Prospects (Bounded)</span>
                <span className="font-mono text-text-muted">{shortlistedList.length} records</span>
              </div>

              <div className="divide-y divide-border">
                {shortlistedList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-text-muted">
                    No records in shortlist. All pre-qualified candidates have been evaluated.
                  </div>
                ) : (
                  shortlistedList.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPayloadId(p.id)}
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                        selectedPayloadId === p.id ? 'bg-primary-tint/40 border-l-4 border-primary' : 'hover:bg-surface-sunken'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs text-ink">{p.name}</div>
                        <div className="text-[11px] text-text-muted">
                          {p.city}, {p.countryCode} · {p.type === 'artist' ? 'Artist' : p.type}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-ink tnum">{p.score} pts</span>
                        <span className="text-[10px] font-semibold text-success bg-success-tint px-2 py-0.5 rounded-xs">
                          Gates: 10/10 ✓
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 6 cols: Payload Inspector "What the cloud model sees" */}
            <div className="lg:col-span-6 bg-surface-elevated rounded-xl border border-border-strong p-5 shadow-2 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-sans font-semibold text-sm text-ink">What the Cloud Model Will See</h3>
                  <p className="text-xs text-text-muted mt-0.5">Strictly minimised summary payload</p>
                </div>
                <span className="font-mono text-[11px] text-primary bg-primary-tint px-2 py-0.5 rounded-xs">
                  {payloadProspect.id}
                </span>
              </div>

              {/* Payload JSON display */}
              <div className="p-3 rounded-md bg-surface-sunken border border-border font-mono text-xs text-ink">
                <pre className="overflow-x-auto text-[11px] leading-relaxed">
{JSON.stringify({
  prospect_id: payloadProspect.id,
  entity_name: payloadProspect.name,
  category: payloadProspect.type,
  market: `${payloadProspect.city}, ${payloadProspect.countryCode}`,
  verified_recent_activity: payloadProspect.lastActivityDate,
  top_evidence_facts: [
    "Corporate registration or independent master rights verified",
    "Active streaming release catalog confirmed",
    "Direct contact channel present"
  ],
  hard_gates_status: "ALL_PASSED_10_OF_10"
}, null, 2)}
                </pre>
              </div>

              <div className="space-y-1.5 text-xs text-text-muted pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Shield className="w-3.5 h-3.5 text-success" />
                  <span><strong>Never transmitted:</strong> Email addresses, raw page texts, or secret API credentials.</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span><strong>Safe fallback:</strong> Injected malformed responses default to hold; never auto-approved.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DECIDED HISTORY */}
      {activeTab === 'decided' && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-1">
          <div className="p-4 border-b border-border bg-surface-sunken flex justify-between items-center text-xs">
            <span className="font-semibold text-ink">Cloud & Manual Decision History</span>
            <span className="font-mono text-text-muted">{decidedList.length} total reviewed</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border text-[11px] font-semibold text-text-secondary uppercase">
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Review Outcome</th>
                <th className="py-3 px-3">Rationale</th>
                <th className="py-3 px-3">Reviewed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {decidedList.map(p => (
                <tr key={p.id} className="hover:bg-surface-sunken/40">
                  <td className="py-3 px-4 font-medium text-ink">{p.name}</td>
                  <td className="py-3 px-3 capitalize text-text-secondary">{p.type}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-xs font-semibold text-[11px] ${
                      p.cloudDecision?.outcome === 'contact'
                        ? 'bg-success-tint text-success border border-success/30'
                        : p.cloudDecision?.outcome === 'no_contact'
                        ? 'bg-error-tint text-error border border-error/30'
                        : 'bg-warning-tint text-warning border border-warning/30'
                    }`}>
                      {p.cloudDecision?.outcome.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-text-secondary max-w-sm truncate">
                    {p.cloudDecision?.rationale}
                  </td>
                  <td className="py-3 px-3 text-text-muted font-mono text-[11px]">
                    {p.cloudDecision?.timestamp || 'Recently'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
