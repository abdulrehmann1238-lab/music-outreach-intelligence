import React, { useState } from 'react';
import { Sliders, Shield, Send, DollarSign, Key, Check, RotateCcw, Save, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
  const {
    settings,
    updateWeights,
    updateThresholds,
    updateOutreachSettings,
    resetWeightsToDefaults,
    setLiveSendArmed,
    setProcessingPaused,
    addToast
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'scoring' | 'safety' | 'outreach' | 'costs' | 'access'>('scoring');
  const [selectedScorecard, setSelectedScorecard] = useState<'label' | 'sync' | 'artist'>('label');

  // Weights state
  const [currentWeights, setCurrentWeights] = useState({ ...settings.weights[selectedScorecard] });
  const [thresholds, setThresholds] = useState({ ...settings.thresholds });
  const [bookingUrl, setBookingUrl] = useState(settings.outreach.bookingUrl);
  const [dailyCap, setDailyCap] = useState(settings.outreach.dailyEmailCap);
  const [devRevoked, setDevRevoked] = useState(false);

  // Switch scorecard tabs
  const handleScorecardChange = (cat: 'label' | 'sync' | 'artist') => {
    setSelectedScorecard(cat);
    setCurrentWeights({ ...settings.weights[cat] });
  };

  const handleWeightChange = (key: string, val: number) => {
    setCurrentWeights(prev => ({ ...prev, [key]: Math.max(0, val) }));
  };

  const totalWeights = Object.values(currentWeights).reduce((a, b) => a + b, 0);
  const weightsValid = totalWeights === 100;

  const handleSaveWeights = () => {
    if (!weightsValid) {
      addToast({
        type: 'error',
        title: 'Invalid Weights Total',
        message: `Weights total ${totalWeights} — must equal exactly 100.`
      });
      return;
    }
    updateWeights(selectedScorecard, currentWeights);
    addToast({
      type: 'success',
      title: 'Scoring Weights Updated',
      message: `Re-scored all records based on updated ${selectedScorecard.toUpperCase()} weights.`
    });
  };

  const handleSaveOutreach = () => {
    updateOutreachSettings({
      bookingUrl,
      dailyEmailCap: dailyCap
    });
    addToast({
      type: 'success',
      title: 'Outreach Settings Saved',
      message: 'Booking URL and caps updated.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-normal text-ink tracking-tight">Settings</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Configurable criteria, safety guardrails, outreach limits, and secret protection
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-md border border-border w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('scoring')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'scoring' ? 'bg-surface-elevated text-primary font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Scoring Criteria</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'safety' ? 'bg-surface-elevated text-accent font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Safety & Switches</span>
        </button>

        <button
          onClick={() => setActiveTab('outreach')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'outreach' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Outreach & Booking</span>
        </button>

        <button
          onClick={() => setActiveTab('costs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'costs' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Recurring Costs</span>
        </button>

        <button
          onClick={() => setActiveTab('access')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'access' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Access & Secrets</span>
        </button>
      </div>

      {/* TAB 1: SCORING SETTINGS */}
      {activeTab === 'scoring' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
              <div>
                <h3 className="font-sans font-semibold text-sm text-ink">Scorecard Weights Editor</h3>
                <p className="text-xs text-text-muted mt-0.5">Weights must sum to exactly 100 points</p>
              </div>

              {/* Selector */}
              <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-md border border-border">
                <button
                  onClick={() => handleScorecardChange('label')}
                  className={`px-2.5 py-1 text-xs rounded-sm cursor-pointer ${
                    selectedScorecard === 'label' ? 'bg-surface-elevated text-primary font-semibold' : 'text-text-secondary'
                  }`}
                >
                  Record Label
                </button>
                <button
                  onClick={() => handleScorecardChange('sync')}
                  className={`px-2.5 py-1 text-xs rounded-sm cursor-pointer ${
                    selectedScorecard === 'sync' ? 'bg-surface-elevated text-primary font-semibold' : 'text-text-secondary'
                  }`}
                >
                  Sync / Licensing
                </button>
                <button
                  onClick={() => handleScorecardChange('artist')}
                  className={`px-2.5 py-1 text-xs rounded-sm cursor-pointer ${
                    selectedScorecard === 'artist' ? 'bg-surface-elevated text-primary font-semibold' : 'text-text-secondary'
                  }`}
                >
                  Artist
                </button>
              </div>
            </div>

            {/* Steppers table */}
            <div className="space-y-2.5 text-xs">
              {Object.entries(currentWeights).map(([k, weight]) => (
                <div key={k} className="flex items-center justify-between p-2.5 rounded-md bg-surface-elevated border border-border">
                  <span className="font-medium text-ink uppercase">{k} Dimension</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleWeightChange(k, weight - 1)}
                      className="w-6 h-6 rounded-xs bg-surface-sunken hover:bg-border text-ink font-bold flex items-center justify-center cursor-pointer"
                    >
                      −
                    </button>
                    <span className="font-mono text-sm font-semibold w-8 text-center tnum">{weight}</span>
                    <button
                      onClick={() => handleWeightChange(k, weight + 1)}
                      className="w-6 h-6 rounded-xs bg-surface-sunken hover:bg-border text-ink font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-[11px] text-text-muted w-8 text-right">pts</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer total and save */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">Total:</span>
                <span className={`font-mono text-sm font-bold ${weightsValid ? 'text-success' : 'text-error'}`}>
                  {totalWeights} / 100 {weightsValid ? '✓' : '✗'}
                </span>
                {!weightsValid && (
                  <span className="text-xs text-error font-medium">(Must equal 100)</span>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={resetWeightsToDefaults}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Defaults
                </Button>
                <Button size="sm" variant="primary" disabled={!weightsValid} onClick={handleSaveWeights}>
                  <Save className="w-3.5 h-3.5 mr-1" /> Save & Re-score
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAFETY & SWITCHES */}
      {activeTab === 'safety' && (
        <div className="space-y-4 text-xs font-sans">
          <div className="p-5 rounded-xl bg-surface border border-border space-y-4 shadow-1">
            <h3 className="font-semibold text-sm text-ink pb-2 border-b border-border">
              Safety Control Switches
            </h3>

            <div className="flex items-center justify-between p-3 rounded-md bg-surface-elevated border border-border">
              <div>
                <div className="font-medium text-ink">Live Dispatch Permitted</div>
                <div className="text-[11px] text-text-muted">Requires typed confirmation to arm. Disarms instantly.</div>
              </div>
              <Button
                size="sm"
                variant={settings.safety.liveSendArmed ? 'destructive' : 'outline'}
                onClick={() => setLiveSendArmed(!settings.safety.liveSendArmed)}
              >
                {settings.safety.liveSendArmed ? 'Disarm (OFF)' : 'Arm Live Send...'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-surface-elevated border border-border">
              <div>
                <div className="font-medium text-ink">Autonomous Scheduled Runs</div>
                <div className="text-[11px] text-text-muted">Pause or resume the 5 daily runs. Scheduled runs never enable live sends.</div>
              </div>
              <Button
                size="sm"
                variant={settings.safety.processingPaused ? 'primary' : 'outline'}
                onClick={() => setProcessingPaused(!settings.safety.processingPaused)}
              >
                {settings.safety.processingPaused ? 'Resume Processing' : 'Pause Processing'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OUTREACH & BOOKING */}
      {activeTab === 'outreach' && (
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1 text-xs font-sans">
          <h3 className="font-semibold text-sm text-ink pb-2 border-b border-border">
            Outreach Configuration
          </h3>

          <div className="space-y-3">
            <div>
              <label className="font-medium text-ink block mb-1">
                Owner Booking URL (TidyCal / Calendar Link)
              </label>
              <input
                type="url"
                value={bookingUrl}
                onChange={(e) => setBookingUrl(e.target.value)}
                className="w-full p-2.5 rounded-md bg-surface-elevated border border-border-strong text-ink font-mono text-xs focus:ring-2 focus:ring-primary"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                Replaces token &#123;booking_url&#125; in outreach email & DM templates. Not hard-coded.
              </span>
            </div>

            <div>
              <label className="font-medium text-ink block mb-1">Daily Email Dispatch Cap</label>
              <input
                type="number"
                value={dailyCap}
                onChange={(e) => setDailyCap(parseInt(e.target.value, 10))}
                className="w-32 p-2 rounded-md bg-surface-elevated border border-border-strong text-ink font-mono text-xs focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="pt-2">
              <Button size="sm" variant="primary" onClick={handleSaveOutreach}>
                Save Outreach Configuration
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RECURRING COSTS */}
      {activeTab === 'costs' && (
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1 text-xs font-sans">
          <div className="pb-2 border-b border-border">
            <h3 className="font-semibold text-sm text-ink">Transparent Recurring Cost Matrix</h3>
            <p className="text-xs text-text-muted mt-0.5">Nothing paid is activated without your explicit approval.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between p-2.5 rounded-md bg-surface-elevated border border-border">
              <span>Local Model Inference (llama.cpp on your RTX 3090)</span>
              <strong className="font-mono text-success">$0 / month</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-md bg-surface-elevated border border-border">
              <span>Gmail API (OAuth personal developer account)</span>
              <strong className="font-mono text-success">$0 / month</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-md bg-surface-elevated border border-border">
              <span>Cloud Model Final Review (Bounded Shortlist Only)</span>
              <strong className="font-mono text-text-secondary">Per-use (Capped, Owner Approval Required)</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-md bg-surface-elevated border border-border">
              <span>Commercial Search API Fallback</span>
              <strong className="font-mono text-warning">Requires Explicit Approval</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ACCESS & SECRETS */}
      {activeTab === 'access' && (
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1 text-xs font-sans">
          <div className="pb-2 border-b border-border">
            <h3 className="font-semibold text-sm text-ink">Access Custody & Secrets Protection</h3>
            <p className="text-xs text-text-muted mt-0.5">Secrets are never visible to the developer SSH account.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-md bg-surface-elevated border border-border">
              <div>
                <div className="font-medium text-ink">Developer SSH Access</div>
                <div className="text-[11px] text-text-muted">Restricted user · No root permissions · No read access to /etc/cadence-secrets</div>
              </div>
              <Button
                size="sm"
                variant={devRevoked ? 'outline' : 'destructive'}
                onClick={() => setDevRevoked(!devRevoked)}
              >
                {devRevoked ? 'Re-enable Access' : 'Revoke Developer Key'}
              </Button>
            </div>

            <div className="space-y-2 pt-2">
              <div className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">
                Runtime Secrets Custody
              </div>
              <div className="p-2.5 rounded-md bg-surface-sunken border border-border space-y-1">
                <div className="flex justify-between font-mono">
                  <span>GMAIL_OAUTH_CLIENT_SECRET:</span>
                  <span className="text-text-muted">Protected in runtime config (Not readable by developer)</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span>CLOUD_GATE_API_KEY:</span>
                  <span className="text-accent">Not provisioned — arrives at Milestone 4 via protected runtime config</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
