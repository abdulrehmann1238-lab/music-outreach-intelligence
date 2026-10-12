import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, AlertTriangle, Send, ExternalLink, Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { StatusBadge, ConfidenceBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { ScoreBreakdown } from '../components/domain/ScoreBreakdown';
import { EvidenceList } from '../components/domain/EvidenceList';
import { GateChecklist } from '../components/domain/GateChecklist';
import { ServiceFitPanel } from '../components/domain/ServiceFitPanel';
import { Modal } from '../components/ui/Modal';
import { exportSingleProspectJSON } from '../lib/export';

export const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    prospects,
    evidence,
    updateProspectStatus,
    undoProspectStatus,
    addToast
  } = useAppStore();

  const artist = prospects.find(p => p.id === id);
  const artistEvidence = evidence.filter(e => e.prospectId === id);

  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'hold' | 'reject' | 'suppress' | 'approve'>('hold');
  const [decisionReason, setDecisionReason] = useState('');

  if (!artist) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="font-display text-2xl text-ink font-normal">Artist Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/app/artists')}>
          Back to Artists
        </Button>
      </div>
    );
  }

  const failedGate = artist.gates.find(g => !g.passed);
  const canApprove = !failedGate && artist.status !== 'suppressed';

  const handleOpenDecisionModal = (type: 'hold' | 'reject' | 'suppress' | 'approve') => {
    if (type === 'approve') {
      if (!canApprove) {
        addToast({
          type: 'error',
          title: 'Cannot Approve',
          message: `Hard gate ${failedGate?.id} failed. Cannot approve.`
        });
        return;
      }
      const { previousStatus } = updateProspectStatus(artist.id, 'approved', 'Operator manual approval');
      addToast({
        type: 'success',
        title: 'Artist Approved',
        message: `${artist.name} queued for manual Instagram outreach.`,
        undoAction: () => undoProspectStatus(artist.id, previousStatus)
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
    const { previousStatus } = updateProspectStatus(artist.id, newStatus, decisionReason);
    setDecisionModalOpen(false);

    addToast({
      type: 'warning',
      title: `${decisionType.toUpperCase()} Recorded`,
      message: `${artist.name} marked as ${newStatus}.`,
      undoAction: () => undoProspectStatus(artist.id, previousStatus)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Link to="/app/artists" className="hover:text-ink transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Artists
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold">{artist.name}</span>
          <span className="font-mono text-primary">{artist.handle}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-normal text-ink tracking-tight">
                {artist.name}
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-xs bg-primary-tint text-primary font-medium">
                {artist.handle}
              </span>
              <StatusBadge status={artist.status} />
            </div>

            <p className="text-xs text-text-muted mt-1">
              {artist.city}, {artist.country} · {artist.genres.join(', ')} · Score {artist.score}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportSingleProspectJSON(artist)}
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
              variant="primary"
              disabled={!canApprove}
              disabledReason={!canApprove ? 'Hard gate failed' : undefined}
              onClick={() => handleOpenDecisionModal('approve')}
            >
              Approve Record
            </Button>
          </div>
        </div>
      </div>

      {/* Held Banner if status is held */}
      {artist.status === 'held' && (
        <div className="p-4 rounded-xl bg-warning-tint border border-warning/40 text-xs text-ink flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-warning">Held — Verification Uncertain</div>
            <div className="mt-0.5 leading-relaxed text-text-secondary">
              No outreach claims are made until identity or recency is manually confirmed.
            </div>
          </div>
        </div>
      )}

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-xl bg-surface border border-border">
        <div>
          <div className="text-[11px] text-text-muted font-medium">Artist Fit Score</div>
          <div className="font-display text-2xl font-normal text-ink tnum">
            {artist.score} <span className="text-xs text-text-muted font-sans font-normal">/ 100</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-text-muted font-medium">Evidence Confidence</div>
          <div className="mt-1">
            <ConfidenceBadge confidence={artist.evidenceConfidence} />
          </div>
        </div>

        <div>
          <div className="text-[11px] text-text-muted font-medium">Outreach Channel</div>
          <div className="font-mono text-xs text-primary mt-1">
            {artist.channel === 'ig_manual' ? 'Instagram (Manual)' : 'Email'}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-text-muted font-medium">Last Post Date</div>
          <div className="font-mono text-xs text-ink mt-1">
            {artist.lastActivityDate}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-text-muted font-medium">Independence</div>
          <div className="text-xs font-semibold text-success mt-1">
            Verified Self-Released
          </div>
        </div>

        <div>
          <div className="text-[11px] text-text-muted font-medium">Outreach Queue</div>
          <div className="mt-1">
            <button
              onClick={() => navigate('/app/outreach')}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" /> Go to queue →
            </button>
          </div>
        </div>
      </div>

      {/* 2-Pane Inspection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 60%: Verification & Activity */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-sans font-semibold text-sm text-ink">Identity & Activity Checks</h3>
              <span className="text-xs text-success font-semibold">Verified Original Artist ✓</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-success">
                <Check className="w-4 h-4" /> Original music songwriting credits verified
              </div>
              <div className="flex items-center gap-2 text-success">
                <Check className="w-4 h-4" /> Active streaming release links confirmed
              </div>
              <div className="flex items-center gap-2 text-success">
                <Check className="w-4 h-4" /> Performance audio & vocal stems analyzed
              </div>
            </div>
          </div>

          <EvidenceList evidence={artistEvidence} />
        </div>

        {/* Right 40%: Artist Scorecard & Hard Gates */}
        <div className="lg:col-span-5 space-y-6">
          <ScoreBreakdown
            score={artist.score}
            components={artist.scoreComponents}
          />

          <GateChecklist gates={artist.gates} />
        </div>
      </div>

      {/* Full-Width Below: 4 Service-Fit Evaluation Panel */}
      {artist.serviceFit && (
        <ServiceFitPanel services={artist.serviceFit} />
      )}

      {/* Decision Modal */}
      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        title={`Record Decision: ${decisionType.toUpperCase()}`}
        description={`Record required audit rationale for ${artist.name}`}
      >
        <div className="space-y-4 text-xs font-sans">
          <div>
            <label className="font-medium text-ink block mb-1">
              Required Justification Reason
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
