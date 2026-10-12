import React, { useState } from 'react';
import { Shield, Lock, Ban, Repeat, Gauge, Power, Check, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const SafeguardsGrid: React.FC = () => {
  // Micro-demo state 1: Idempotency
  const [idemSent, setIdemSent] = useState(false);
  const [idemError, setIdemError] = useState<string | null>(null);

  // Micro-demo state 2: Live-send typed confirm
  const [typedSwitch, setTypedSwitch] = useState(false);
  const [typedInput, setTypedInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Micro-demo state 3: Caps meter
  const [meterCount, setMeterCount] = useState(15);
  const meterMax = 25;

  const handleIdemSend = () => {
    if (idemSent) {
      setIdemError('Blocked: already sent (key sv-2026-10-12-t3). Duplicate sends are strictly blocked.');
    } else {
      setIdemSent(true);
      setIdemError(null);
    }
  };

  const handleSendMoreCap = () => {
    if (meterCount + 5 <= meterMax) {
      setMeterCount(meterCount + 5);
    }
  };

  return (
    <section id="safeguards" className="py-20 border-b border-border">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="text-xs font-sans font-semibold text-accent uppercase tracking-wider mb-2">
            Defensive Design
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal">
            Safeguards that default to off.
          </h2>
          <p className="text-text-secondary text-base max-w-2xl mt-2 leading-relaxed">
            The system assumes all automation is dangerous until verified. Built to eliminate double-contacting, spam, and API ban risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Idempotent Sends */}
          <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Repeat className="w-5 h-5" />
                <h3 className="font-sans font-semibold text-sm text-ink">Idempotent Sends</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Deterministic hash keys per prospect and template. Second send attempt is blocked with the exact collision key.
              </p>
            </div>

            <div className="p-3 bg-surface-sunken rounded-md space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Target: Sora Vale Music</span>
                <span className="font-mono text-[10px] text-text-muted">key: sv-2026-10-12-t3</span>
              </div>
              <Button size="sm" variant="secondary" onClick={handleIdemSend} className="w-full">
                {idemSent ? 'Send Again (Test Idempotency)' : 'Send to Sora Vale (demo)'}
              </Button>
              {idemSent && !idemError && (
                <div className="text-[11px] text-success flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> Initial send recorded.
                </div>
              )}
              {idemError && (
                <div className="text-[11px] text-error flex items-start gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{idemError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Live-Send Off by Default */}
          <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Lock className="w-5 h-5" />
                <h3 className="font-sans font-semibold text-sm text-ink">Live-Send Off by Default</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Scheduled runs never enable live sends. Activating live dispatch requires typing explicit confirmation text.
              </p>
            </div>

            <div className="p-3 bg-surface-sunken rounded-md space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Live Send Status:</span>
                <span className={`font-mono text-[11px] font-bold ${typedSwitch ? 'text-accent' : 'text-text-muted'}`}>
                  {typedSwitch ? 'ARMED' : 'OFF'}
                </span>
              </div>

              {!typedSwitch ? (
                <Button size="sm" variant="outline" onClick={() => setModalOpen(true)} className="w-full">
                  Attempt to Arm Switch...
                </Button>
              ) : (
                <Button size="sm" variant="destructive" onClick={() => setTypedSwitch(false)} className="w-full">
                  Disarm Switch (1-Click Off)
                </Button>
              )}

              {modalOpen && (
                <div className="pt-2 border-t border-border space-y-2">
                  <div className="text-[10px] text-text-muted">
                    Type <strong className="font-mono text-ink">ENABLE</strong> to confirm:
                  </div>
                  <input
                    type="text"
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    placeholder="ENABLE"
                    className="w-full p-1.5 text-xs bg-surface-elevated border border-border text-ink rounded-xs font-mono uppercase"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={typedInput.trim() !== 'ENABLE'}
                      onClick={() => {
                        setTypedSwitch(true);
                        setModalOpen(false);
                        setTypedInput('');
                      }}
                      className="w-full"
                    >
                      Confirm
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Daily Caps and Pacing */}
          <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-secondary">
                <Gauge className="w-5 h-5" />
                <h3 className="font-sans font-semibold text-sm text-ink">Caps & Hard Pacing</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Hardware limits: max 25 emails/day, 90s ± 30s jitter spacing to maintain pristine domain reputation.
              </p>
            </div>

            <div className="p-3 bg-surface-sunken rounded-md space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Daily Outbox Meter:</span>
                <span className="font-mono font-semibold text-ink">{meterCount} / {meterMax}</span>
              </div>
              <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    meterCount >= meterMax ? 'bg-error' : meterCount >= 20 ? 'bg-warning' : 'bg-primary'
                  }`}
                  style={{ width: `${(meterCount / meterMax) * 100}%` }}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSendMoreCap}
                  disabled={meterCount >= meterMax}
                  className="flex-1"
                >
                  Send +5
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setMeterCount(0)}>
                  Reset
                </Button>
              </div>
              {meterCount >= meterMax && (
                <div className="text-[10px] text-error font-medium">Daily cap hit. Pipeline pauses safely.</div>
              )}
            </div>
          </div>

          {/* Card 4: Dry-Run First */}
          <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                <h3 className="font-sans font-semibold text-sm text-ink">Dry-Run First</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Test full ingestion, parsing, scoring, and personalization without writing to outreach or calling APIs.
              </p>
            </div>
            <div className="p-3 bg-surface-sunken rounded-md text-xs space-y-1">
              <div className="font-semibold text-ink">Guaranteed Safety:</div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Dry-run results are stamped and tagged in history with "0 live messages sent".
              </p>
            </div>
          </div>

          {/* Card 5: Permanent Suppression */}
          <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-error">
                <Ban className="w-5 h-5" />
                <h3 className="font-sans font-semibold text-sm text-ink">Suppression That Sticks</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Suppression records (email, domain, IG handle) lock all send buttons permanently across the UI.
              </p>
            </div>
            <div className="p-3 bg-surface-sunken rounded-md text-xs space-y-1">
              <div className="font-semibold text-ink">Tested Scenario:</div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Cedar Gate Sync scores 80/100, but Gate G10 fails due to an owner suppression. Approval is blocked.
              </p>
            </div>
          </div>

          {/* Card 6: One-Click Kill Switches */}
          <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-warning">
                <Power className="w-5 h-5" />
                <h3 className="font-sans font-semibold text-sm text-ink">Instant Kill Switches</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Pause scheduler processing or freeze cloud review with a single click. Asymmetric safety: turning off needs no confirmation.
              </p>
            </div>
            <div className="p-3 bg-surface-sunken rounded-md text-xs space-y-1">
              <div className="font-semibold text-ink">Owner Protection:</div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Cloud model review can be stopped at any moment; shortlist freezes without auto-approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
