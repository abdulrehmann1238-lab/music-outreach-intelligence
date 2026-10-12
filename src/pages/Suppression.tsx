import React, { useState } from 'react';
import { ShieldBan, Plus, Trash2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';

export const Suppression: React.FC = () => {
  const {
    suppressionList,
    duplicateMerges,
    addSuppressionEntry,
    removeSuppressionEntry,
    addToast
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'suppressed' | 'duplicates'>('suppressed');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Form state
  const [type, setType] = useState<'domain' | 'email' | 'ig_handle'>('domain');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState<'owner_request' | 'unsubscribed' | 'bounced' | 'legal' | 'other'>('owner_request');
  const [note, setNote] = useState('');

  // Remove confirmation modal
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [removeReason, setRemoveReason] = useState('');

  const handleAddSuppression = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const ok = addSuppressionEntry({
      type,
      value: value.trim().toLowerCase(),
      reason,
      note: note.trim() || 'Manual suppression request',
      addedBy: 'Owner',
      source: 'Owner action'
    });

    if (ok) {
      setDrawerOpen(false);
      setValue('');
      setNote('');
    }
  };

  const handleConfirmRemove = () => {
    if (!removeId || !removeReason.trim()) return;
    removeSuppressionEntry(removeId, removeReason);
    setRemoveId(null);
    setRemoveReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-normal text-ink tracking-tight">Suppression & Dedup</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Permanent do-not-contact controls and auditable duplicate merging index
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={() => setDrawerOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Suppression
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-md border border-border w-fit">
        <button
          onClick={() => setActiveTab('suppressed')}
          className={`px-4 py-2 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'suppressed' ? 'bg-surface-elevated text-primary font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          Suppressed Entities ({suppressionList.length})
        </button>
        <button
          onClick={() => setActiveTab('duplicates')}
          className={`px-4 py-2 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'duplicates' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          Duplicates Merged ({duplicateMerges.length})
        </button>
      </div>

      {/* TAB 1: SUPPRESSION LIST */}
      {activeTab === 'suppressed' && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-1">
          <div className="p-4 border-b border-border bg-surface-sunken flex justify-between items-center text-xs">
            <span className="font-semibold text-ink">Active Suppression Directives</span>
            <span className="font-mono text-text-muted">{suppressionList.length} blocked</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border text-[11px] font-semibold text-text-secondary uppercase">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-3">Blocked Value</th>
                <th className="py-3 px-3">Linked Prospect</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3">Added Date</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {suppressionList.map(s => (
                <tr key={s.id} className="hover:bg-surface-sunken/40">
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] uppercase text-text-secondary bg-surface-sunken px-1.5 py-0.5 rounded-xs border border-border">
                      {s.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-ink">{s.value}</td>
                  <td className="py-3 px-3 text-text-secondary">
                    {s.prospectName || s.linkedProspectId || '—'}
                  </td>
                  <td className="py-3 px-3 text-text-secondary">
                    <span className="capitalize">{s.reason.replace('_', ' ')}</span>: {s.note}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-text-muted">{s.addedAt}</td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRemoveId(s.id)}
                      className="text-error hover:bg-error-tint p-1 h-7"
                      title="Remove suppression (requires explicit reason)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: DUPLICATES MERGED (15) */}
      {activeTab === 'duplicates' && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-1">
          <div className="p-4 border-b border-border bg-surface-sunken flex justify-between items-center text-xs">
            <span className="font-semibold text-ink">Deterministic Deduplication Events</span>
            <span className="font-mono text-text-muted">15 merges registered</span>
          </div>

          <div className="divide-y divide-border">
            {duplicateMerges.map(m => (
              <div key={m.id} className="p-4 hover:bg-surface-sunken/40 text-xs font-sans space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-text-muted text-[11px]">{m.sourceUrl}</span>
                  <span className="font-mono text-[10px] text-text-muted">{m.timestamp}</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-ink">
                  <span>Merged into: <strong className="text-primary">{m.prospectName}</strong> ({m.mergedIntoId})</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1">
                  <span>Identity key: <code className="font-mono bg-surface-sunken px-1 rounded-xs">{m.identityKey}</code></span>
                  <span className="text-text-muted">Rule: {m.normalisationRule}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Suppression Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add Permanent Suppression"
        description="Stop all contact attempts permanently for an address, domain, or handle"
      >
        <form onSubmit={handleAddSuppression} className="space-y-4 text-xs font-sans">
          <div>
            <label className="font-medium text-ink block mb-1">Target Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2.5 rounded-md bg-surface border border-border-strong text-ink text-xs focus:ring-2 focus:ring-primary"
            >
              <option value="domain">Domain (e.g. example.com)</option>
              <option value="email">Email address</option>
              <option value="ig_handle">Instagram handle (@handle)</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-ink block mb-1">Target Value</label>
            <input
              type="text"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'domain' ? 'company.example.com' : type === 'email' ? 'contact@example.com' : '@handle'}
              className="w-full p-2.5 rounded-md bg-surface border border-border-strong text-ink text-xs focus:ring-2 focus:ring-primary font-mono"
            />
          </div>

          <div>
            <label className="font-medium text-ink block mb-1">Suppression Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full p-2.5 rounded-md bg-surface border border-border-strong text-ink text-xs focus:ring-2 focus:ring-primary"
            >
              <option value="owner_request">Owner manual request</option>
              <option value="unsubscribed">Prospect unsubscribed / opted out</option>
              <option value="bounced">Hard bounce detected</option>
              <option value="legal">Legal or jurisdictional restriction</option>
              <option value="other">Other defensible reason</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-ink block mb-1">Operator Notes</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Context or citation for why this was suppressed..."
              className="w-full p-2.5 rounded-md bg-surface border border-border-strong text-ink text-xs focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Apply Suppression
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Remove Suppression Confirmation Modal */}
      <Modal
        isOpen={!!removeId}
        onClose={() => setRemoveId(null)}
        title="Remove Suppression Directive"
        description="Removing a suppression requires an audited explanation."
      >
        <div className="space-y-4 text-xs font-sans">
          <p className="text-text-secondary leading-relaxed">
            Suppression records are protective guardrails. Enter the audited reason why contact is now permitted:
          </p>

          <div>
            <label className="font-medium text-ink block mb-1">Audited Removal Reason</label>
            <textarea
              rows={3}
              required
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
              placeholder="e.g. Confirmed explicit inbound request from prospect via conference meeting..."
              className="w-full p-2.5 rounded-md bg-surface border border-border-strong text-ink text-xs focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-2 border-t border-border flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRemoveId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!removeReason.trim()}
              onClick={handleConfirmRemove}
            >
              Confirm Removal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
