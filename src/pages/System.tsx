import React, { useState } from 'react';
import { Server, Database, Shield, RefreshCw, CheckCircle2, AlertTriangle, FileText, Download, Play, Check, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { failureManager } from '../mock/failures';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const System: React.FC = () => {
  const { auditLogs, addToast, demoClock } = useAppStore();

  const [activeTab, setActiveTab] = useState<'health' | 'backups' | 'logs' | 'audit'>('backups');
  const [healthChecking, setHealthChecking] = useState(false);
  const [healthResult, setHealthResult] = useState<string | null>('200 OK — All local subsystems nominal');

  // Backups state
  const [backups, setBackups] = useState([
    { id: 'backup_20261011_0300.sqlite', size: '4.2 MB', hash: 'sha256:7f3a81...', time: '11 Oct 2026 03:10', status: 'verified' },
    { id: 'backup_20261010_0300.sqlite', size: '4.1 MB', hash: 'sha256:4c9b20...', time: '10 Oct 2026 03:10', status: 'verified' },
    { id: 'backup_20261009_0300.sqlite', size: '3.9 MB', hash: 'sha256:1a82d4...', time: '09 Oct 2026 03:10', status: 'verified' }
  ]);
  const [creatingBackup, setCreatingBackup] = useState(false);

  // Restore wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardRunning, setWizardRunning] = useState(false);
  const [wizardMismatch, setWizardMismatch] = useState(false);
  const [wizardCompleted, setWizardCompleted] = useState(false);

  const handleHealthCheck = () => {
    setHealthChecking(true);
    setTimeout(() => {
      setHealthChecking(false);
      setHealthResult('200 OK — SQLite (v0012, 4.2MB), Local llama.cpp (1.8s p50), HTTPS (Tailscale TLS 1.3)');
      addToast({
        type: 'success',
        title: 'Health Check Passed',
        message: 'Endpoint /healthz returned 200 OK in 42ms.'
      });
    }, 800);
  };

  const handleCreateBackup = () => {
    setCreatingBackup(true);
    setTimeout(() => {
      const newBackup = {
        id: `backup_${Date.now()}.sqlite`,
        size: '4.2 MB',
        hash: `sha256:${Math.random().toString(16).substring(2, 8)}...`,
        time: demoClock,
        status: 'created'
      };
      setBackups([newBackup, ...backups]);
      setCreatingBackup(false);
      addToast({
        type: 'success',
        title: 'Backup Created',
        message: `${newBackup.id} written to /var/backups/cadence.`
      });
    }, 1200);
  };

  const handleStartRestoreWizard = () => {
    setWizardOpen(true);
    setWizardStep(0);
    setWizardRunning(true);
    setWizardMismatch(false);
    setWizardCompleted(false);

    const hasMismatch = failureManager.consume('backup_mismatch');

    // Step-by-step verification animation
    setTimeout(() => setWizardStep(1), 600);
    setTimeout(() => setWizardStep(2), 1200);
    setTimeout(() => setWizardStep(3), 1800);
    setTimeout(() => {
      setWizardStep(4);
      if (hasMismatch) {
        setWizardMismatch(true);
        setWizardRunning(false);
        addToast({
          type: 'error',
          title: 'Backup Not Accepted',
          message: 'Mismatch detected in suppression state (12 vs 11). Integrity verification refused restore.'
        });
      }
    }, 2400);

    setTimeout(() => {
      if (!hasMismatch) {
        setWizardStep(5);
        setWizardRunning(false);
        setWizardCompleted(true);
        addToast({
          type: 'success',
          title: 'Restore Verified',
          message: 'All 5 integrity tables matched source database perfectly.'
        });
      }
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-normal text-ink tracking-tight">System & Operations</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Node health, verified database restore, bounded logs, and immutable permission audit
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-md border border-border w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'health' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Health Check (/healthz)</span>
        </button>

        <button
          onClick={() => setActiveTab('backups')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'backups' ? 'bg-surface-elevated text-primary font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Backups & Proven Restore</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'logs' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Bounded Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
            activeTab === 'audit' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: HEALTH */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">Dashboard HTTPS</span>
                <span className="text-success font-medium">Valid TLS</span>
              </div>
              <div className="text-[11px] text-text-secondary">Owner managed via reverse proxy (Tailscale)</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">Python Spine Daemon</span>
                <span className="text-success font-medium">Running (6d 4h)</span>
              </div>
              <div className="text-[11px] text-text-secondary">Memory: 142 MB · PID 1024 · systemd managed</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">SQLite Engine</span>
                <span className="text-success font-medium">OK (v0012)</span>
              </div>
              <div className="text-[11px] text-text-secondary">File size: 4.2 MB · WAL mode enabled</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">Local Model Endpoint</span>
                <span className="text-success font-medium">p50 1.8s</span>
              </div>
              <div className="text-[11px] text-text-secondary">Existing llama.cpp server on RTX 3090</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">Disk Space</span>
                <span className="text-success font-medium">38% Used</span>
              </div>
              <div className="text-[11px] text-text-secondary">Ubuntu root partition: 620 GB free</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">Scheduler Overlap Locks</span>
                <span className="text-success font-medium">Active</span>
              </div>
              <div className="text-[11px] text-text-secondary">Guarantees zero concurrent process collisions</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-xs font-semibold text-ink">Endpoint: GET /healthz</div>
              <p className="text-xs text-text-secondary mt-1">{healthResult}</p>
            </div>
            <Button size="sm" variant="primary" loading={healthChecking} onClick={handleHealthCheck}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Check Now
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: BACKUPS & PROVEN RESTORE */}
      {activeTab === 'backups' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-surface-sunken border border-border text-xs leading-relaxed flex items-start gap-3">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-ink font-semibold">Non-negotiable Acceptance Rule:</strong>
              <div className="text-text-secondary mt-0.5">
                "A backup is not accepted until restoration into a clean location is demonstrated." Nightly SQLite snapshots are verified across all 5 relational tables before acceptance.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-sans font-semibold text-sm text-ink">Nightly Snapshots</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" loading={creatingBackup} onClick={handleCreateBackup}>
                Create Snapshot Now
              </Button>
              <Button size="sm" variant="primary" onClick={handleStartRestoreWizard}>
                <Play className="w-3.5 h-3.5 mr-1" /> Restore Into Clean Location & Verify
              </Button>
            </div>
          </div>

          {/* Backups Table */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-sunken border-b border-border text-[11px] font-semibold text-text-secondary uppercase">
                  <th className="py-3 px-4">Backup Archive ID</th>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">SHA-256 Checksum</th>
                  <th className="py-3 px-3">Created Date</th>
                  <th className="py-3 px-3 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {backups.map(b => (
                  <tr key={b.id} className="hover:bg-surface-sunken/40">
                    <td className="py-3 px-4 font-mono font-medium text-ink">{b.id}</td>
                    <td className="py-3 px-3 font-mono text-text-secondary">{b.size}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-text-muted">{b.hash}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-text-muted">{b.time}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-xs font-semibold text-[10px] bg-success-tint text-success">
                        VERIFIED ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4 shadow-1 text-xs font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-semibold text-sm text-ink">Bounded & Rotated System Logs</h3>
              <p className="text-xs text-text-muted mt-0.5">Rotated at 10 MB · 14 files retained · Secret tokens automatically redacted</p>
            </div>
            <Button size="sm" variant="outline">
              <Download className="w-3.5 h-3.5 mr-1" /> Download Log
            </Button>
          </div>

          <div className="p-3 bg-surface-sunken rounded-md border border-border font-mono text-[11px] space-y-1 text-text-secondary max-h-80 overflow-y-auto">
            <div>[2026-10-12 12:00:01] [INFO] scheduler: Invoking run_20261012_1200_co for pipeline "companies"</div>
            <div>[2026-10-12 12:00:04] [INFO] ingest: 6 sources polled cleanly. Fetched 31 raw candidates.</div>
            <div>[2026-10-12 12:00:18] [INFO] dedup: Merged 2 duplicate domain variants. Preserved canonical identity.</div>
            <div>[2026-10-12 12:00:35] [INFO] qualification: Local Qwen endpoint evaluated 31 prospects against G1–G10.</div>
            <div>[2026-10-12 12:00:54] [INFO] scheduler: Run completed successfully. Overlap lock released.</div>
            <div>[2026-10-12 12:30:00] [INFO] scheduler: Invoking run_20261012_1230_ar for pipeline "artists"</div>
            <div>[2026-10-12 12:30:22] [WARN] source: Music-search provider returned HTTP 429. Initiating exponential backoff.</div>
            <div>[2026-10-12 12:30:48] [WARN] source: Retry 3/3 exhausted for music-search provider. Source deferred safely.</div>
            <div>[2026-10-12 12:31:42] [INFO] scheduler: Run completed as PARTIAL. Successful 2 records preserved.</div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT */}
      {activeTab === 'audit' && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-1">
          <div className="p-4 border-b border-border bg-surface-sunken flex justify-between items-center text-xs">
            <span className="font-semibold text-ink">Permission-Affecting Manual Audit Trail</span>
            <span className="font-mono text-text-muted">{auditLogs.length} audit records</span>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border text-[11px] font-semibold text-text-secondary uppercase">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">Operator</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Target</th>
                <th className="py-3 px-3">State Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs.map(a => (
                <tr key={a.id} className="hover:bg-surface-sunken/40">
                  <td className="py-3 px-4 font-mono text-[11px] text-text-muted whitespace-nowrap">{a.timestamp}</td>
                  <td className="py-3 px-3 font-semibold text-ink">{a.user}</td>
                  <td className="py-3 px-3 font-medium text-primary">{a.action}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-text-secondary">{a.target}</td>
                  <td className="py-3 px-3 text-text-secondary">
                    <span className="text-text-muted">{a.before}</span> → <strong className="text-ink">{a.after}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Restore Verification Wizard Modal */}
      <Modal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Restore Verification Wizard"
        description="Extracting snapshot into temporary sandboxed directory and verifying relational integrity"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="space-y-2">
            <div className={`p-3 rounded-md border flex items-center justify-between ${wizardStep >= 1 ? 'bg-surface-elevated border-success/40' : 'bg-surface-sunken opacity-60'}`}>
              <span>1. Prospects table records (46 of 46)</span>
              {wizardStep >= 1 && <span className="text-success font-semibold">Matched 46 / 46 ✓</span>}
            </div>

            <div className={`p-3 rounded-md border flex items-center justify-between ${wizardStep >= 2 ? 'bg-surface-elevated border-success/40' : 'bg-surface-sunken opacity-60'}`}>
              <span>2. Traceable evidence citations (212 of 212)</span>
              {wizardStep >= 2 && <span className="text-success font-semibold">Matched 212 / 212 ✓</span>}
            </div>

            <div className={`p-3 rounded-md border flex items-center justify-between ${wizardStep >= 3 ? 'bg-surface-elevated border-success/40' : 'bg-surface-sunken opacity-60'}`}>
              <span>3. Manual decisions & rationale (23 of 23)</span>
              {wizardStep >= 3 && <span className="text-success font-semibold">Matched 23 / 23 ✓</span>}
            </div>

            <div className={`p-3 rounded-md border flex items-center justify-between ${
              wizardMismatch ? 'bg-error-tint border-error text-error' : wizardStep >= 4 ? 'bg-surface-elevated border-success/40' : 'bg-surface-sunken opacity-60'
            }`}>
              <span>4. Suppression directives & hashes (1 of 1)</span>
              {wizardMismatch ? (
                <span className="text-error font-bold">MISMATCH (12 vs 11) ✗</span>
              ) : wizardStep >= 4 ? (
                <span className="text-success font-semibold">Matched 1 / 1 ✓</span>
              ) : null}
            </div>

            <div className={`p-3 rounded-md border flex items-center justify-between ${wizardStep >= 5 ? 'bg-surface-elevated border-success/40' : 'bg-surface-sunken opacity-60'}`}>
              <span>5. Outreach history & idempotency keys (5 of 5)</span>
              {wizardStep >= 5 && <span className="text-success font-semibold">Matched 5 / 5 ✓</span>}
            </div>
          </div>

          {wizardCompleted && (
            <div className="p-3 bg-success-tint/40 border border-success/40 rounded-md text-success font-medium text-center">
              Restore Verified Successfully · 12 Oct 14:31 · Acceptance Gate Passed
            </div>
          )}

          {wizardMismatch && (
            <div className="p-3 bg-error-tint border border-error/40 rounded-md text-error leading-relaxed">
              <strong>Verification Gate Failed:</strong> Backup is rejected due to count mismatch. The production database was untouched.
            </div>
          )}

          <div className="pt-2 border-t border-border flex justify-end">
            <Button variant="primary" disabled={wizardRunning} onClick={() => setWizardOpen(false)}>
              Close Wizard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
