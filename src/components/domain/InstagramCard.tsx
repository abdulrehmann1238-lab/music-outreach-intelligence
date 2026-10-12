import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { Prospect } from '../../types';
import { getMonogram } from '../../lib/monogram';
import { StatusBadge, NeedTypeChip } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';

interface InstagramCardProps {
  prospect: Prospect;
}

export const InstagramCard: React.FC<InstagramCardProps> = ({ prospect }) => {
  const { recordManualSend, recordOutcome, demoClock, addToast } = useAppStore();
  const monogram = getMonogram(prospect.name);

  const defaultMsg = `Hey ${prospect.name.split(' ')[0]}! Came across your music via Instagram and loved your recent tracks.

I produce and mix pop/dance tracks. If you're exploring production or mixing partners for your upcoming project, I'd be glad to share two private reference tracks. You can check my calendar here if you ever want to chat: https://booking.example/owner/intro-call`;

  const [messageText, setMessageText] = useState(defaultMsg);
  const [copied, setCopied] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [outcomeModalOpen, setOutcomeModalOpen] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<'no_reply' | 'replied' | 'booked' | 'declined'>('replied');
  const [outcomeNote, setOutcomeNote] = useState('');

  const isSent = prospect.status === 'replied' || prospect.history.some(h => h.action.toLowerCase().includes('sent'));

  const handleCopy = () => {
    navigator.clipboard?.writeText(messageText);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Message copied to clipboard',
      message: 'Ready to paste into Instagram Direct message.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkSent = () => {
    recordManualSend(prospect.id, demoClock);
    addToast({
      type: 'success',
      title: 'Outreach Recorded',
      message: `Marked sent to ${prospect.handle}. Awaiting artist response.`
    });
  };

  const handleSaveOutcome = () => {
    recordOutcome(prospect.id, selectedOutcome, outcomeNote);
    setOutcomeModalOpen(false);
    addToast({
      type: 'info',
      title: 'Outcome Recorded',
      message: `Updated status for ${prospect.name} to ${selectedOutcome}.`
    });
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-5 space-y-4 shadow-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center font-mono text-xs font-semibold shrink-0 border border-border-strong"
            style={{ backgroundColor: monogram.bg, color: monogram.text }}
          >
            {monogram.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-sans font-semibold text-sm text-ink">{prospect.name}</h4>
              <span className="font-mono text-xs text-primary">{prospect.handle}</span>
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              {prospect.city}, {prospect.country} · {prospect.genres.join(', ')} · Score {prospect.score}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={prospect.status} size="sm" />
          <Button
            size="sm"
            variant="outline"
            onClick={() => setProfileModalOpen(true)}
            title="Inspect simulated profile"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Profile
          </Button>
        </div>
      </div>

      {/* Service need highlight */}
      {prospect.serviceFit && (
        <div className="flex items-center gap-2 text-xs text-text-secondary bg-surface-sunken p-2.5 rounded-md border border-border">
          <span className="font-medium text-ink">Highest Service Fit:</span>
          <span className="capitalize font-semibold text-primary">Production (82 pts)</span>
          <NeedTypeChip type="explicit" />
        </div>
      )}

      {/* Prepared Message Editor */}
      <div>
        <div className="flex items-center justify-between text-xs text-text-secondary mb-1.5">
          <label htmlFor={`msg-${prospect.id}`} className="font-medium">
            Prepared Instagram Message (artist_ig_intro v1)
          </label>
          <span className="font-mono text-[11px] text-text-muted">
            {messageText.length} characters
          </span>
        </div>
        <textarea
          id={`msg-${prospect.id}`}
          rows={5}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="w-full text-xs font-sans p-3 rounded-md bg-surface-elevated border border-border-strong text-ink focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
        />
      </div>

      {/* Safety Checks Strip */}
      <div className="flex items-center gap-4 text-xs text-text-muted pt-1">
        <span className="flex items-center gap-1 text-success">
          <Check className="w-3.5 h-3.5" /> Suppression clean
        </span>
        <span className="flex items-center gap-1 text-success">
          <Check className="w-3.5 h-3.5" /> No previous contact
        </span>
        <span className="text-[11px]">
          Target booking URL: <span className="font-mono text-primary">booking.example</span>
        </span>
      </div>

      {/* Action Buttons Row */}
      <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            {copied ? <Check className="w-3 h-3 text-success mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? 'Copied' : 'Copy Message'}
          </Button>

          <Button
            size="sm"
            variant={isSent ? 'outline' : 'primary'}
            onClick={handleMarkSent}
            disabled={isSent}
            disabledReason={isSent ? 'Already marked as sent' : undefined}
          >
            <Calendar className="w-3 h-3 mr-1" />
            {isSent ? 'Sent (Awaiting outcome)' : 'Mark as Sent'}
          </Button>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setOutcomeModalOpen(true)}
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Record Outcome
        </Button>
      </div>

      {/* Simulated Instagram Profile Modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title={`Simulated Profile: ${prospect.name}`}
        description="Real profile links disabled in demo mode to prevent scraping or 404s"
        maxWidth="sm"
      >
        <div className="space-y-4 font-sans text-xs">
          <div className="p-4 rounded-lg bg-surface-sunken border border-border flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold border border-border-strong"
              style={{ backgroundColor: monogram.bg, color: monogram.text }}
            >
              {monogram.initials}
            </div>
            <div>
              <div className="font-semibold text-sm text-ink">{prospect.name}</div>
              <div className="font-mono text-primary">{prospect.handle}</div>
              <div className="text-text-muted text-[11px] mt-0.5">Verified Independent Artist Profile</div>
            </div>
          </div>

          <div className="p-3 bg-surface rounded-md border border-border space-y-1">
            <div className="font-medium text-ink">Bio summary:</div>
            <p className="text-text-secondary leading-relaxed">
              Singer / Songwriter based in {prospect.city}. Self-funded releases. Stream my newest single now.
            </p>
          </div>

          <div className="pt-2 text-text-muted text-[11px] italic">
            Honest constraint: Milestone 1 validates API access reality. Manual review guarantees account safety and respects platform rules.
          </div>
        </div>
      </Modal>

      {/* Record Outcome Modal */}
      <Modal
        isOpen={outcomeModalOpen}
        onClose={() => setOutcomeModalOpen(false)}
        title="Record Outreach Outcome"
        description={`Log response outcome for ${prospect.name}`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs font-sans">
          <div>
            <label className="font-medium text-ink block mb-1">Outcome Status</label>
            <select
              value={selectedOutcome}
              onChange={(e) => setSelectedOutcome(e.target.value as any)}
              className="w-full p-2.5 rounded-md bg-surface border border-border-strong text-ink text-xs focus:ring-2 focus:ring-primary"
            >
              <option value="replied">Replied (Interested in references)</option>
              <option value="booked">Booked (Intro call scheduled)</option>
              <option value="declined">Declined (Not looking right now)</option>
              <option value="no_reply">No reply (Pending follow-up)</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-ink block mb-1">Operator Notes (Optional)</label>
            <textarea
              rows={3}
              value={outcomeNote}
              onChange={(e) => setOutcomeNote(e.target.value)}
              placeholder="e.g. Artist asked for two reference mixes before scheduling a call..."
              className="w-full p-2.5 rounded-md bg-surface border border-border-strong text-ink text-xs focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" onClick={() => setOutcomeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveOutcome}>
              Save Outcome
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
