import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Download, Copy, Check, ShieldAlert, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { StatusBadge, ConfidenceBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { ScoreBreakdown } from '../components/domain/ScoreBreakdown';
import { EvidenceList } from '../components/domain/EvidenceList';
import { GateChecklist } from '../components/domain/GateChecklist';
import { Modal } from '../components/ui/Modal';
import { exportSingleProspectJSON } from '../lib/export';

export const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    prospects,
    evidence,
    updateProspectStatus,
    undoProspectStatus,
    toggleUnsupportedClaim,
    addToast
  } = useAppStore();

  const prospect = prospects.find(p => p.id === id);
  const companyEvidence = evidence.filter(e => e.prospectId === id);

  // Decision Modal State
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'hold' | 'reject' | 'suppress' | 'approve'>('hold');
  const [decisionReason, setDecisionReason] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [highlightedEvidenceIds, setHighlightedEvidenceIds] = useState<string[]>([]);

  if (!prospect) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="font-display text-2xl text-ink font-normal">Prospect Not Found</h2>
        <p className="text-xs text-text-muted">The requested company record could not be found in local SQLite storage.</p>
        <Button variant="outline" onClick={() => navigate('/app/companies')}>
          Back to Companies
        </Button>
      </div>
    );
  }

  // Gate safety check
  const failedGate = prospect.gates.find(g => !g.passed);
  const canApprove = !failedGate && prospect.status !== 'suppressed';

  const handleOpenDecisionModal = (type: 'hold' | 'reject' | 'suppress' | 'approve') => {
    if (type === 'approve') {
      if (!canApprove) {
        addToast({
          type: 'error',
          title: 'Cannot Approve',
          message: `Hard gate ${failedGate?.id} failed: "${failedGate?.reason}". Scores never override hard gates.`
        });
        return;
      }
      // Direct approve
      const { previousStatus } = updateProspectStatus(prospect.id, 'approved', 'Operator manual approval');
      addToast({
        type: 'success',
        title: 'Prospect Approved',
        message: `${prospect.name} approved for outreach dry-run.`,
        undoAction: () => undoProspectStatus(prospect.id, previousStatus)
      });
      return;
    }

    setDecisionType(type);
    setDecisionReason('');
    setDecisionModalOpen(true);
  };

  const handleConfirmDecision = () => {
    if (!decisionReason.trim()) return;

    const newStatus = decisionType === 'hold' ? 'held' : decisionType === 'reject' ? 'rejected' : 'suppressed';
    const { previousStatus } = updateProspectStatus(prospect.id, newStatus, decisionReason);

    setDecisionModalOpen(false);

    addToast({
      type: decisionType === 'suppress' ? 'error' : 'warning',
      title: `${decisionType.toUpperCase()} Recorded`,
      message: `${prospect.name} marked as ${newStatus}.`,
      undoAction: () => undoProspectStatus(prospect.id, previousStatus)
    });
  };

  const handleCopyUrl = () => {
    if (prospect.domain) {
      navigator.clipboard?.writeText(`https://${prospect.domain}`);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb and Actions */}
      <div className="space-y-3 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Link to="/app/companies" className="hover:text-ink transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Companies
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold">{prospect.name}</span>
          <span className="font-mono text-[11px] text-text-muted">({prospect.id})</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-normal text-ink tracking-tight">
                {prospect.name}
              </h1>
              <span className="text-xs font-sans px-2.5 py-0.5 rounded-xs bg-surface-sunken border border-border text-text-secondary capitalize font-medium">
                {prospect.type === 'label' ? 'Record Label' : 'Sync / Licensing'}
              </span>
              <StatusBadge status={prospect.status} />
            </div>

            <p className="text-xs text-text-muted mt-1">
              {prospect.city}, {prospect.country} ({prospect.countryCode}) · Genres: {prospect.genres.join(', ')}
            </p>
          </div>

          {/* Action Decision Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportSingleProspectJSON(prospect)}
              title="Download record JSON"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Export JSON
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleOpenDecisionModal('hold')}
            >
              Hold
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleOpenDecisionModal('reject')}
            >
              Reject
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleOpenDecisionModal('suppress')}
            >
              Suppress
            </Button>

            <Button
              size="sm"
              variant="primary"
              disabled={!canApprove}
              disabledReason={!canApprove ? `Gate ${failedGate?.id || 'G10'} failed: Cannot approve.` : undefined}
              onClick={() => handleOpenDecisionModal('approve')}
            >
              Approve Record
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-xl bg-surface border border-border">
        <div>
          <div className="text-[11px] text-text-muted font-medium">Fit Score</div>
          <div className="font-display text-2xl font-normal text-ink tnum">
            {prospect.score} <span className="text-xs text-text-muted font-sans font-normal">/ 100</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-text-muted font-medium">Evidence Confidence</div>
          <div className="mt-1">
            <ConfidenceBadge confidence={prospect.evidenceConfidence} />
          </div>
        </div>

        <div>
          <div className="text-[11px] text-text-muted font-medium">Contact Channel</div>
          <div className="font-mono text-xs text-ink mt-1 truncate">
            {prospect.contactValue || 'Contact Form'}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-text-muted font-medium">Last Activity</div>
          <div className="font-mono text-xs text-ink mt-1">
            {prospect.lastActivityDate}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-text-muted font-medium">Schema Status</div>
          <div className="text-xs font-semibold text-success mt-1">
            Validated ✓
          </div>
        </div>

        <div>
          <div className="text-[11px] text-text-muted font-medium">Canonical Domain</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-mono text-xs text-primary truncate">{prospect.domain}</span>
            <button
              onClick={handleCopyUrl}
              className="text-text-muted hover:text-ink cursor-pointer p-0.5"
              title="Copy canonical domain"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Pane Inspection Layout (60% Evidence / 40% Scorecard + Gates) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 60%: Traceable Evidence Repository */}
        <div className="lg:col-span-7 space-y-6">
          <EvidenceList
            evidence={companyEvidence}
            highlightedEvidenceIds={highlightedEvidenceIds}
          />

          {/* Model Rationale Card */}
          <div className="bg-surface rounded-lg border border-border p-5 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-sans font-semibold text-xs text-ink">
                Local Model Evaluation (Qwen / llama.cpp)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-success-tint text-success font-medium">
                Output validated ✓
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              "{prospect.localModelRationale}"
            </p>
            <div className="text-[10px] text-text-muted pt-1">
              Model output cannot override hard gates or fabricate citations.
            </div>
          </div>
        </div>

        {/* Right 40%: Scorecard & Hard Gates */}
        <div className="lg:col-span-5 space-y-6">
          <ScoreBreakdown
            score={prospect.score}
            components={prospect.scoreComponents}
            onHoverComponent={(evIds) => setHighlightedEvidenceIds(evIds)}
            onLeaveComponent={() => setHighlightedEvidenceIds([])}
            onToggleUnsupported={() => toggleUnsupportedClaim(prospect.id)}
            unsupportedClaimToggled={prospect.unsupportedClaimToggled}
          />

          <GateChecklist gates={prospect.gates} />

          {/* Decision Timeline History */}
          <div className="bg-surface rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-sans font-semibold text-xs text-ink">Decision & Status History</span>
              <span className="font-mono text-[10px] text-text-muted">{prospect.history.length} events</span>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {prospect.history.map((h, idx) => (
                <div key={idx} className="p-2 rounded-xs bg-surface-elevated border border-border text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-ink capitalize">{h.action}</span>
                    <span className="font-mono text-[10px] text-text-muted">{h.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{h.note}</div>
                  <div className="text-[10px] text-text-muted mt-1 font-mono">Operator: {h.user}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reason Decision Modal (Hold/Reject/Suppress) */}
      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        title={`Record Decision: ${decisionType.toUpperCase()}`}
        description={`A justified reason is required to ${decisionType} ${prospect.name}`}
      >
        <div className="space-y-4 text-xs font-sans">
          <div>
            <label className="font-medium text-ink block mb-1">
              Required Justification / Audit Reason
            </label>
            <textarea
              rows={3}
              required
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder={`State the defensible reason for this ${decisionType} decision...`}
              className="w-full p-2.5 rounded-md bg-surface border border-border-strong text-ink text-xs focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-2 border-t border-border flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDecisionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={decisionType === 'suppress' ? 'destructive' : 'primary'}
              disabled={!decisionReason.trim()}
              onClick={handleConfirmDecision}
            >
              Confirm {decisionType.toUpperCase()}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
