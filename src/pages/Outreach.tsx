import React, { useState } from 'react';
import { Send, History, Mail, ShieldAlert, Check, AlertTriangle, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Prospect, OutreachItem } from '../types';
import { Button } from '../components/ui/Button';
import { InstagramCard } from '../components/domain/InstagramCard';
import { InstagramIcon } from '../components/ui/InstagramIcon';
import { Modal } from '../components/ui/Modal';

export const Outreach: React.FC = () => {
  const {
    prospects,
    outreachHistory,
    settings,
    setLiveSendArmed,
    sendEmailDryRun,
    sendEmailTest,
    sendEmailLive,
    reconcileUncertainOutreach,
    addToast
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'email' | 'instagram' | 'history'>('email');
  const [selectedProspectId, setSelectedProspectId] = useState<string>('co_0001');
  const [liveSendModalOpen, setLiveSendModalOpen] = useState(false);
  const [typedConfirm, setTypedConfirm] = useState('');
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);

  // Email targets: Approved companies & artists with email channel
  const emailProspects = prospects.filter(p => p.channel === 'email' && (p.status === 'approved' || p.status === 'qualified'));
  const selectedProspect = emailProspects.find(p => p.id === selectedProspectId) || emailProspects[0] || prospects[0];

  // Instagram targets
  const igProspects = prospects.filter(p => p.channel === 'ig_manual' && (p.status === 'approved' || p.status === 'qualified' || p.status === 'shortlisted' || p.status === 'replied'));

  const liveSendArmed = settings.safety.liveSendArmed;
  const bookingUrl = settings.outreach.bookingUrl;

  const handleArmLiveSend = () => {
    if (typedConfirm.trim() === 'ENABLE LIVE SEND') {
      setLiveSendArmed(true);
      setLiveSendModalOpen(false);
      setTypedConfirm('');
      addToast({
        type: 'warning',
        title: 'Live Sending Armed (Simulated)',
        message: 'Live dispatch permissions enabled. All sends still respect rate caps.'
      });
    }
  };

  const handleDryRun = async () => {
    const res = await sendEmailDryRun(selectedProspect.id);
    addToast({
      type: 'success',
      title: 'Dry-Run Complete: 0 Messages Sent',
      message: `Would send 1 email to ${selectedProspect.contactValue || selectedProspect.name}. Idempotency key: ${res.idempotencyKey}`
    });
  };

  const handleSendTest = async () => {
    const res = await sendEmailTest(selectedProspect.id);
    if (res.success) {
      addToast({
        type: 'success',
        title: 'Test Email Delivered (Simulated)',
        message: `Delivered to owner test inbox: owner@cadence.demo. Provider ID: ${res.providerId}`
      });
    } else {
      addToast({
        type: 'error',
        title: 'Test Send Error',
        message: res.error || 'Provider communication halted.'
      });
    }
  };

  const handleLiveSend = async () => {
    const res = await sendEmailLive(selectedProspect.id);
    if (res.success) {
      addToast({
        type: 'success',
        title: 'Live Email Dispatched',
        message: `Dispatched to ${selectedProspect.contactValue}. Provider ID: ${res.providerId}`
      });
    } else {
      addToast({
        type: 'error',
        title: 'Send Notice',
        message: res.error || 'Send operation blocked.'
      });
    }
  };

  const handleReconcile = async (outreachId: string) => {
    setReconcilingId(outreachId);
    setTimeout(async () => {
      const res = await reconcileUncertainOutreach(outreachId);
      setReconcilingId(null);
      addToast({
        type: res.resolvedStatus === 'delivered' ? 'success' : 'warning',
        title: 'Reconciliation Concluded',
        message: res.resolvedStatus === 'delivered'
          ? `Confirmed in Sent records (Provider ID: ${res.providerId}). Never resent.`
          : 'Submission was not received by provider. Safe to retry.'
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-normal text-ink tracking-tight">Outreach</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Controlled email delivery & manual Instagram queue · Zero duplicate contact guarantee
          </p>
        </div>

        {/* Live Send Safety Switch Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary">Live Sending Switch:</span>
            <button
              onClick={() => {
                if (liveSendArmed) {
                  setLiveSendArmed(false);
                  addToast({ type: 'info', title: 'Live Sending Disabled', message: 'Reverted to safe OFF default.' });
                } else {
                  setLiveSendModalOpen(true);
                }
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all cursor-pointer border ${
                liveSendArmed
                  ? 'bg-accent-tint text-accent border-accent/40 shadow-1 animate-pulse'
                  : 'bg-surface-sunken text-text-muted border-border hover:border-border-strong'
              }`}
            >
              {liveSendArmed ? 'ARMED (SIMULATED)' : 'OFF (SAFE DEFAULT)'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-md border border-border w-fit">
        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'email' ? 'bg-surface-elevated text-primary font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email Queue & Preview ({emailProspects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('instagram')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'instagram' ? 'bg-surface-elevated text-accent font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <InstagramIcon className="w-3.5 h-3.5" />
          <span>Instagram Manual Queue ({igProspects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'history' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Outreach History & Reconcile ({outreachHistory.length})</span>
        </button>
      </div>

      {/* TAB 1: EMAIL QUEUE & GROUNDING */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          {/* 4-Step Pipeline Stepper */}
          <div className="p-4 rounded-xl bg-surface border border-border shadow-1">
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-sans">
              <div className="p-2 rounded-md bg-success-tint text-success font-medium flex items-center justify-center gap-1">
                <Check className="w-3 h-3" /> 1. Qualify ✓
              </div>
              <div className="p-2 rounded-md bg-success-tint text-success font-medium flex items-center justify-center gap-1">
                <Check className="w-3 h-3" /> 2. Ground Tokens ✓
              </div>
              <div className="p-2 rounded-md bg-primary-tint text-primary font-semibold flex items-center justify-center gap-1 border border-primary/30">
                3. Dry-Run First ◐
              </div>
              <div className="p-2 rounded-md bg-surface-sunken text-text-secondary">
                4. Test to Owner
              </div>
              <div className="p-2 rounded-md bg-surface-sunken text-text-muted">
                5. Live Dispatch (Armed)
              </div>
            </div>
          </div>

          {/* 3-Pane Layout: Target List / Preview / Grounding Checks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 4 cols: Target Queue */}
            <div className="lg:col-span-4 bg-surface rounded-xl border border-border overflow-hidden shadow-1">
              <div className="p-3 border-b border-border bg-surface-sunken flex justify-between items-center text-xs">
                <span className="font-semibold text-ink">Approved Targets (Email)</span>
                <span className="font-mono text-text-muted">{emailProspects.length} ready</span>
              </div>

              <div className="divide-y divide-border">
                {emailProspects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProspectId(p.id)}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedProspect?.id === p.id ? 'bg-primary-tint/40 border-l-4 border-primary' : 'hover:bg-surface-sunken'
                    }`}
                  >
                    <div className="font-medium text-xs text-ink">{p.name}</div>
                    <div className="font-mono text-[11px] text-text-muted truncate">{p.contactValue}</div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-text-secondary">
                      <span>{p.city}, {p.countryCode}</span>
                      <span className="font-mono text-primary font-semibold">{p.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Centre 5 cols: Template Preview with Highlighted Tokens */}
            <div className="lg:col-span-5 bg-surface-elevated rounded-xl border border-border-strong p-5 shadow-2 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-sans font-semibold text-sm text-ink">Personalization Preview</h3>
                  <p className="text-xs text-text-muted mt-0.5">Template: label_intro v2 (Approved 06 Oct)</p>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-xs bg-success-tint text-success font-semibold">
                  All Tokens Grounded ✓
                </span>
              </div>

              {/* Rendered Email */}
              <div className="space-y-3 text-xs font-sans leading-relaxed">
                <div className="p-2.5 rounded-md bg-surface-sunken border border-border font-mono text-[11px]">
                  <span className="text-text-muted">Subject: </span>
                  <span className="text-ink font-semibold">
                    Single "Glass Tide" — a production collaboration idea
                  </span>
                </div>

                <div className="p-4 rounded-md bg-surface border border-border space-y-3 text-xs text-ink">
                  <p>Hello Marcus Lin (A&R Team),</p>
                  <p>
                    I came across <strong className="text-primary bg-primary-tint px-1 rounded-xs">{selectedProspect.name}</strong> through official registry records and noticed your recent release <strong className="text-primary bg-primary-tint px-1 rounded-xs">"Glass Tide" (dated 19 Sep 2026)</strong>.
                  </p>
                  <p>
                    I work as a producer, songwriter and mixing engineer, mostly in <strong className="text-primary bg-primary-tint px-1 rounded-xs">{selectedProspect.genres.join(', ')}</strong>.
                  </p>
                  <p>
                    If it would be useful, I'd be glad to share two reference tracks tailored for your upcoming roster releases. You can pick a time to talk here:{' '}
                    <span className="font-mono text-accent underline">{bookingUrl}</span>
                  </p>
                  <p>
                    Best regards,<br />
                    Studio Owner
                  </p>
                </div>

                <div className="text-[11px] text-text-muted italic">
                  Note: Open tracking is approximate and is not proof that anyone read an email.
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center gap-2">
                <Button size="sm" variant="primary" onClick={handleDryRun}>
                  Execute Dry-Run (0 Sent)
                </Button>
                <Button size="sm" variant="outline" onClick={handleSendTest}>
                  Send Test to Owner
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!liveSendArmed}
                  disabledReason={!liveSendArmed ? 'Live send switch is OFF by default' : undefined}
                  onClick={handleLiveSend}
                >
                  Live Send
                </Button>
              </div>
            </div>

            {/* Right 3 cols: Grounding & Caps Checks */}
            <div className="lg:col-span-3 space-y-4">
              {/* Grounding Citations Panel */}
              <div className="bg-surface rounded-xl border border-border p-4 space-y-3 shadow-1 text-xs">
                <div className="font-semibold text-ink text-xs pb-2 border-b border-border">
                  Evidence Grounding
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded-md bg-surface-sunken space-y-1">
                    <div className="font-medium text-ink">Claim: "Glass Tide" 19 Sep 2026</div>
                    <div className="font-mono text-primary flex items-center justify-between">
                      <span>ev_0002</span>
                      <span className="text-success">Verified ✓</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-md bg-surface-sunken space-y-1">
                    <div className="font-medium text-ink">Claim: Five signed roster artists</div>
                    <div className="font-mono text-primary flex items-center justify-between">
                      <span>ev_0003</span>
                      <span className="text-success">Verified ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Caps & Hardware Pacing Card */}
              <div className="bg-surface rounded-xl border border-border p-4 space-y-3 shadow-1 text-xs">
                <div className="font-semibold text-ink text-xs pb-2 border-b border-border">
                  Daily Caps & Pacing
                </div>

                <div className="space-y-2 text-[11px] text-text-secondary">
                  <div className="flex justify-between">
                    <span>Daily Emails:</span>
                    <span className="font-mono font-semibold text-ink">
                      {settings.outreach.emailsSentToday} / {settings.outreach.dailyEmailCap}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Per-Run Cap:</span>
                    <span className="font-mono font-semibold text-ink">
                      0 / {settings.outreach.runEmailCap}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pacing Jitter:</span>
                    <span className="font-mono text-ink">90s ± 30s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INSTAGRAM MANUAL QUEUE */}
      {activeTab === 'instagram' && (
        <div className="space-y-6">
          {/* Honest Feasibility Banner */}
          <div className="p-4 rounded-xl bg-surface-sunken border border-border text-xs leading-relaxed space-y-1">
            <div className="font-semibold text-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Automated Instagram DMs: <strong className="text-accent">Unverified</strong>
            </div>
            <p className="text-text-secondary">
              Milestone 1 will rigorously test Meta API access, account type constraints, and platform terms before anything is promised. The manual queue below is the guaranteed, account-safe operating mechanism.
            </p>
          </div>

          {/* Queue Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {igProspects.map(p => (
              <InstagramCard key={p.id} prospect={p} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OUTREACH HISTORY & RECONCILIATION */}
      {activeTab === 'history' && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-1">
          <div className="p-4 border-b border-border bg-surface-sunken flex justify-between items-center text-xs">
            <span className="font-semibold text-ink">Dispatched Outreach Log</span>
            <span className="font-mono text-text-muted">{outreachHistory.length} total events</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border text-[11px] font-semibold text-text-secondary uppercase">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-3">Prospect</th>
                <th className="py-3 px-3">Channel</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Result</th>
                <th className="py-3 px-3">Provider ID</th>
                <th className="py-3 px-3">Outcome</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {outreachHistory.map((item) => (
                <tr key={item.id} className="hover:bg-surface-sunken/40">
                  <td className="py-3 px-4 text-text-muted font-mono text-[11px] whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="py-3 px-3 font-medium text-ink">{item.prospectName}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] capitalize text-text-secondary">
                      {item.channel}
                    </span>
                  </td>
                  <td className="py-3 px-3 capitalize text-text-secondary">{item.action}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-xs font-semibold text-[10px] ${
                      item.result === 'delivered'
                        ? 'bg-success-tint text-success'
                        : item.result === 'replied'
                        ? 'bg-accent-tint text-accent font-bold'
                        : item.result === 'uncertain'
                        ? 'bg-warning-tint text-warning font-bold'
                        : 'bg-error-tint text-error'
                    }`}>
                      {item.result.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-text-muted max-w-xs truncate">
                    {item.providerId || '—'}
                  </td>
                  <td className="py-3 px-3">
                    {item.replyText ? (
                      <span className="font-medium text-accent">"{item.replyText}"</span>
                    ) : (
                      <span className="text-text-muted capitalize">{item.outcome || 'Pending'}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {item.result === 'uncertain' && (
                      <Button
                        size="sm"
                        variant="primary"
                        loading={reconcilingId === item.id}
                        onClick={() => handleReconcile(item.id)}
                        className="text-[11px] py-1 px-2"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" /> Reconcile
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enable Live Send Modal */}
      <Modal
        isOpen={liveSendModalOpen}
        onClose={() => setLiveSendModalOpen(false)}
        title="Enable Live Sending Mode?"
        description="This action arms the system to allow real dispatches when requested."
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="p-3 bg-warning-tint border border-warning/30 rounded-md text-ink leading-relaxed">
            <strong className="text-warning block mb-1">Safety Confirmation:</strong>
            Live dispatch will obey daily cap ({settings.outreach.dailyEmailCap}/day) and pacing jitter. To proceed, type the exact confirmation string:
          </div>

          <div>
            <label className="block text-text-secondary font-medium mb-1 font-mono">
              Type: ENABLE LIVE SEND
            </label>
            <input
              type="text"
              value={typedConfirm}
              onChange={(e) => setTypedConfirm(e.target.value)}
              placeholder="ENABLE LIVE SEND"
              className="w-full p-2.5 rounded-md bg-surface border border-border-strong text-ink font-mono uppercase text-xs focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-2 border-t border-border flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setLiveSendModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={typedConfirm.trim() !== 'ENABLE LIVE SEND'}
              onClick={handleArmLiveSend}
            >
              Arm Live Dispatch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
