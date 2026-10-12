import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Prospect,
  Evidence,
  Run,
  SuppressionEntry,
  DuplicateMerge,
  OutreachItem,
  AuditEntry,
  SourceItem,
  SettingsState,
  ProspectStatus
} from '../types';

import { initialCompanies } from '../data/seed/companies';
import { initialArtists } from '../data/seed/artists';
import { initialEvidence } from '../data/seed/evidence';
import { initialRuns } from '../data/seed/runs';
import { initialSuppression, initialDuplicateMerges } from '../data/seed/suppression';
import { initialSources } from '../data/seed/sources';
import { initialAuditLogs } from '../data/seed/audit';
import { failureManager } from '../mock/failures';
import { calculateScore } from '../mock/engine';

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  undoAction?: () => void;
  duration?: number;
}

interface ActiveRunState {
  id: string;
  pipeline: 'companies' | 'artists';
  isDryRun: boolean;
  stage: number;
  stageName: string;
  logs: string[];
  candidatesFound: number;
  duplicatesMerged: number;
  newQualified: number;
  isFinished: boolean;
  isPartial: boolean;
}

interface AppState {
  // Session
  session: {
    authenticated: boolean;
    user: { name: string; email: string };
    deviceTrust: string;
  };

  // Data
  prospects: Prospect[];
  evidence: Evidence[];
  runs: Run[];
  activeRun: ActiveRunState | null;
  outreachHistory: OutreachItem[];
  suppressionList: SuppressionEntry[];
  duplicateMerges: DuplicateMerge[];
  sources: SourceItem[];
  auditLogs: AuditEntry[];

  // Settings
  settings: SettingsState;

  // UI state
  demoClock: string;
  demoClockHour: number;
  demoClockMinute: number;
  demoControlsOpen: boolean;
  commandPaletteOpen: boolean;
  emptyStateMode: boolean;
  bannerDismissed: boolean;
  toasts: ToastItem[];

  // Actions
  login: (email?: string) => void;
  logout: () => void;
  setBannerDismissed: (val: boolean) => void;
  setDemoControlsOpen: (val: boolean) => void;
  setCommandPaletteOpen: (val: boolean) => void;
  setEmptyStateMode: (val: boolean) => void;
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;

  // Prospect & Review actions
  updateProspectStatus: (
    id: string,
    status: ProspectStatus,
    reason: string,
    note?: string
  ) => { previousStatus: ProspectStatus };
  undoProspectStatus: (id: string, previousStatus: ProspectStatus) => void;
  toggleUnsupportedClaim: (prospectId: string) => void;

  // Cloud review action
  runCloudReviewBatch: (targetIds: string[]) => Promise<{ approvedCount: number; deferredCount: number; rejectedCount: number }>;
  stopCloudReview: () => void;

  // Outreach actions
  recordManualSend: (prospectId: string, timestamp?: string) => void;
  recordOutcome: (prospectId: string, outcome: 'no_reply' | 'replied' | 'booked' | 'declined', note?: string) => void;
  sendEmailDryRun: (prospectId: string) => Promise<{ idempotencyKey: string }>;
  sendEmailTest: (prospectId: string) => Promise<{ success: boolean; providerId?: string; error?: string }>;
  sendEmailLive: (prospectId: string) => Promise<{ success: boolean; providerId?: string; error?: string }>;
  reconcileUncertainOutreach: (outreachId: string) => Promise<{ resolvedStatus: 'delivered' | 'failed'; providerId?: string }>;

  // Safety & Settings actions
  setLiveSendArmed: (armed: boolean) => void;
  setProcessingPaused: (paused: boolean) => void;
  updateWeights: (category: 'label' | 'sync' | 'artist', weights: Record<string, number>) => void;
  updateThresholds: (thresholds: SettingsState['thresholds']) => void;
  updateOutreachSettings: (partial: Partial<SettingsState['outreach']>) => void;
  resetWeightsToDefaults: () => void;

  // Jobs actions
  startRun: (pipeline: 'companies' | 'artists', isDryRun?: boolean) => void;
  cancelRun: () => void;
  fastForwardClock: () => void;

  // Suppression actions
  addSuppressionEntry: (entry: Omit<SuppressionEntry, 'id' | 'addedAt'>) => boolean;
  removeSuppressionEntry: (id: string, reason: string) => void;

  // Global reset
  resetDemoData: () => void;
}

const defaultWeights: SettingsState['weights'] = {
  label: { c1: 20, c2: 20, c3: 15, c4: 15, c5: 10, c6: 10, c7: 10 },
  sync: { s1: 20, s2: 25, s3: 15, s4: 15, s5: 10, s6: 10, s7: 5 },
  artist: { a1: 25, a2: 20, a3: 15, a4: 25, a5: 10, a6: 5 }
};

const defaultThresholds: SettingsState['thresholds'] = {
  highPriority: 85,
  qualified: 75,
  manualReview: 65
};

const initialOutreachItems: OutreachItem[] = [
  {
    id: 'out_0001',
    timestamp: '11 Oct 2026 16:42',
    prospectId: 'co_0001',
    prospectName: 'Moonlit Harbor Records',
    channel: 'email',
    templateVersion: 'label_intro v2',
    action: 'test',
    result: 'delivered',
    providerId: 'gmail-demo-4c91a7',
    idempotencyKey: 'idem_test_20261011_co0001',
    outcome: 'no_reply',
    notes: 'Delivered to verified owner test address owner@cadence.demo'
  },
  {
    id: 'out_0002',
    timestamp: '09 Oct 2026 16:20',
    prospectId: 'ar_0022',
    prospectName: 'Hoang Mirage',
    channel: 'ig_manual',
    templateVersion: 'artist_ig_intro v1',
    action: 'manual_send',
    result: 'replied',
    idempotencyKey: 'idem_ig_20261009_ar0022',
    outcome: 'replied',
    replyText: 'Interested — can you send two reference mixes?',
    notes: 'Operator confirmed manual send via Instagram mobile app.'
  },
  {
    id: 'out_0003',
    timestamp: '12 Oct 2026 09:15',
    prospectId: 'co_0001',
    prospectName: 'Moonlit Harbor Records',
    channel: 'email',
    templateVersion: 'label_intro v2',
    action: 'dry_run',
    result: 'delivered',
    idempotencyKey: 'idem_dry_20261012_co0001',
    notes: 'Dry-run preview completed. 0 live emails dispatched.'
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      session: {
        authenticated: true, // pre-authenticated for seamless demo exploration
        user: { name: 'Owner', email: 'owner@cadence.demo' },
        deviceTrust: 'Verified on this device (Tailscale)'
      },

      prospects: [...initialCompanies, ...initialArtists],
      evidence: [...initialEvidence],
      runs: [...initialRuns],
      activeRun: null,
      outreachHistory: [...initialOutreachItems],
      suppressionList: [...initialSuppression],
      duplicateMerges: [...initialDuplicateMerges],
      sources: [...initialSources],
      auditLogs: [...initialAuditLogs],

      settings: {
        weights: defaultWeights,
        thresholds: defaultThresholds,
        safety: {
          liveSendArmed: false,
          cloudReviewEnabled: true,
          cloudMonthlyCap: 150,
          cloudRunCap: 12,
          cloudReviewsThisMonth: 23,
          processingPaused: false
        },
        outreach: {
          dailyEmailCap: 25,
          runEmailCap: 10,
          emailsSentToday: 0,
          pacingSeconds: 90,
          bookingUrl: 'https://booking.example/owner/intro-call',
          ownerEmail: 'owner@cadence.demo',
          ownerTimezone: 'Asia/Singapore (UTC+8)'
        }
      },

      demoClock: 'Mon 12 Oct 2026, 14:12',
      demoClockHour: 14,
      demoClockMinute: 12,
      demoControlsOpen: false,
      commandPaletteOpen: false,
      emptyStateMode: false,
      bannerDismissed: false,
      toasts: [],

      login: (email = 'owner@cadence.demo') => {
        set({
          session: {
            authenticated: true,
            user: { name: 'Owner', email },
            deviceTrust: 'Verified on this device (Tailscale)'
          }
        });
      },

      logout: () => {
        set(state => ({
          session: {
            ...state.session,
            authenticated: false
          }
        }));
      },

      setBannerDismissed: (val: boolean) => set({ bannerDismissed: val }),
      setDemoControlsOpen: (val: boolean) => set({ demoControlsOpen: val }),
      setCommandPaletteOpen: (val: boolean) => set({ commandPaletteOpen: val }),
      setEmptyStateMode: (val: boolean) => set({ emptyStateMode: val }),

      addToast: (toast) => {
        const id = 'toast_' + Math.random().toString(36).substring(2, 9);
        const newToast: ToastItem = { ...toast, id };
        set(state => ({
          toasts: [newToast, ...state.toasts].slice(0, 3) // max 3 toasts
        }));
        if (toast.type !== 'error') {
          setTimeout(() => {
            get().removeToast(id);
          }, toast.duration || 4000);
        }
        return id;
      },

      removeToast: (id: string) => {
        set(state => ({
          toasts: state.toasts.filter(t => t.id !== id)
        }));
      },

      updateProspectStatus: (id, newStatus, reason, note = '') => {
        const prospect = get().prospects.find(p => p.id === id);
        if (!prospect) return { previousStatus: 'needs_review' };

        const previousStatus = prospect.status;
        const now = get().demoClock;

        const auditEntry: AuditEntry = {
          id: 'aud_' + Date.now(),
          timestamp: now,
          user: 'Owner',
          action: `Decision: ${newStatus.toUpperCase()}`,
          target: `${prospect.id} (${prospect.name})`,
          before: previousStatus,
          after: `${newStatus} (${reason})`
        };

        const updatedHistory = [
          { timestamp: now, action: newStatus, note: `${reason}${note ? ' — ' + note : ''}`, user: 'Owner' },
          ...prospect.history
        ];

        set(state => ({
          prospects: state.prospects.map(p =>
            p.id === id ? { ...p, status: newStatus, history: updatedHistory } : p
          ),
          auditLogs: [auditEntry, ...state.auditLogs]
        }));

        return { previousStatus };
      },

      undoProspectStatus: (id, previousStatus) => {
        const now = get().demoClock;
        set(state => ({
          prospects: state.prospects.map(p =>
            p.id === id ? { ...p, status: previousStatus } : p
          ),
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: now,
              user: 'Owner',
              action: 'Undo Decision',
              target: id,
              before: 'Changed',
              after: `Reverted to ${previousStatus}`
            },
            ...state.auditLogs
          ]
        }));
      },

      toggleUnsupportedClaim: (prospectId) => {
        set(state => ({
          prospects: state.prospects.map(p => {
            if (p.id !== prospectId) return p;
            const isCurrentlyToggled = !!p.unsupportedClaimToggled;
            const newToggled = !isCurrentlyToggled;

            // Target first component to strike through and set earned to 0
            const updatedComponents = p.scoreComponents.map((c, i) => {
              if (i === 0) {
                return {
                  ...c,
                  isUnsupported: newToggled,
                  unsupportedNote: newToggled ? 'Simulated unsupported claim (0 pts)' : undefined
                };
              }
              return c;
            });

            // Recompute total score
            const { score } = calculateScore({ ...p, scoreComponents: updatedComponents });

            return {
              ...p,
              score,
              scoreComponents: updatedComponents,
              unsupportedClaimToggled: newToggled
            };
          })
        }));
      },

      runCloudReviewBatch: async (targetIds: string[]) => {
        const isMalformed = failureManager.consume('model_malformed');

        if (isMalformed) {
          // Injection: cloud returned malformed output -> All held safely!
          set(state => ({
            prospects: state.prospects.map(p => {
              if (targetIds.includes(p.id)) {
                return {
                  ...p,
                  status: 'held',
                  cloudDecision: {
                    outcome: 'defer',
                    rationale: 'Held — model output schema mismatch. Re-review scheduled.',
                    timestamp: state.demoClock
                  }
                };
              }
              return p;
            })
          }));
          return { approvedCount: 0, deferredCount: targetIds.length, rejectedCount: 0 };
        }

        // Scripted outcomes:
        // co_0005, co_0016, co_0019, ar_0002, ar_0005 -> Contact (approved)
        // co_0010 -> No contact (rejected)
        // ar_0009 -> Defer
        let approved = 0;
        let rejected = 0;
        let deferred = 0;

        const updatedProspects = get().prospects.map(p => {
          if (!targetIds.includes(p.id)) return p;

          if (p.id === 'co_0010') {
            rejected++;
            return {
              ...p,
              status: 'rejected' as ProspectStatus,
              cloudDecision: {
                outcome: 'no_contact' as const,
                rationale: 'Recent roster activity unclear; no commercial release in last 90 days.',
                timestamp: get().demoClock
              }
            };
          }

          if (p.id === 'ar_0009') {
            deferred++;
            return {
              ...p,
              status: 'needs_review' as ProspectStatus,
              cloudDecision: {
                outcome: 'defer' as const,
                rationale: 'Evidence of paid external mixing need is hypothetical; request further manual review.',
                timestamp: get().demoClock
              }
            };
          }

          approved++;
          return {
            ...p,
            status: 'approved' as ProspectStatus,
            cloudDecision: {
              outcome: 'contact' as const,
              rationale: 'Verified active release and available business outreach path. Strong production fit.',
              timestamp: get().demoClock
            }
          };
        });

        set(state => ({
          prospects: updatedProspects,
          settings: {
            ...state.settings,
            safety: {
              ...state.settings.safety,
              cloudReviewsThisMonth: state.settings.safety.cloudReviewsThisMonth + targetIds.length
            }
          },
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: state.demoClock,
              user: 'Cloud Gate (Mock)',
              action: 'Batch Review Completed',
              target: `${targetIds.length} records reviewed`,
              before: 'Shortlisted',
              after: `${approved} Approved, ${rejected} No Contact, ${deferred} Deferred`
            },
            ...state.auditLogs
          ]
        }));

        return { approvedCount: approved, deferredCount: deferred, rejectedCount: rejected };
      },

      stopCloudReview: () => {
        set(state => ({
          settings: {
            ...state.settings,
            safety: {
              ...state.settings.safety,
              cloudReviewEnabled: false
            }
          },
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: state.demoClock,
              user: 'Owner',
              action: 'Stop Cloud Review',
              target: 'Cloud Gate',
              before: 'Enabled',
              after: 'Disabled (Frozen)'
            },
            ...state.auditLogs
          ]
        }));
      },

      recordManualSend: (prospectId, timestamp) => {
        const prospect = get().prospects.find(p => p.id === prospectId);
        if (!prospect) return;

        const sentTime = timestamp || get().demoClock;
        const newItem: OutreachItem = {
          id: 'out_' + Date.now(),
          timestamp: sentTime,
          prospectId,
          prospectName: prospect.name,
          channel: 'ig_manual',
          templateVersion: 'artist_ig_intro v1',
          action: 'manual_send',
          result: 'delivered',
          idempotencyKey: `idem_ig_${Date.now()}_${prospectId}`,
          outcome: 'no_reply',
          notes: 'Operator confirmed manual send via Instagram mobile app.'
        };

        set(state => ({
          outreachHistory: [newItem, ...state.outreachHistory],
          prospects: state.prospects.map(p =>
            p.id === prospectId ? { ...p, status: 'approved' } : p
          ),
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: sentTime,
              user: 'Owner',
              action: 'Manual Instagram Send',
              target: `${prospect.id} (${prospect.name})`,
              before: 'Approved / Queued',
              after: 'Sent (Awaiting outcome)'
            },
            ...state.auditLogs
          ]
        }));
      },

      recordOutcome: (prospectId, outcome, note = '') => {
        const prospect = get().prospects.find(p => p.id === prospectId);
        if (!prospect) return;

        const now = get().demoClock;
        const newStatus: ProspectStatus = outcome === 'replied' || outcome === 'booked' ? 'replied' : 'approved';

        set(state => ({
          prospects: state.prospects.map(p =>
            p.id === prospectId ? { ...p, status: newStatus } : p
          ),
          outreachHistory: state.outreachHistory.map(item =>
            item.prospectId === prospectId ? { ...item, outcome, notes: note || item.notes } : item
          ),
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: now,
              user: 'Owner',
              action: 'Record Outcome',
              target: `${prospect.id} (${prospect.name})`,
              before: 'Sent',
              after: `${outcome.toUpperCase()}${note ? ' — ' + note : ''}`
            },
            ...state.auditLogs
          ]
        }));
      },

      sendEmailDryRun: async (prospectId) => {
        const prospect = get().prospects.find(p => p.id === prospectId);
        const idempotencyKey = `idem_dry_${Date.now()}_${prospectId}`;

        const newItem: OutreachItem = {
          id: 'out_' + Date.now(),
          timestamp: get().demoClock,
          prospectId,
          prospectName: prospect?.name || 'Prospect',
          channel: 'email',
          templateVersion: 'label_intro v2',
          action: 'dry_run',
          result: 'delivered',
          idempotencyKey,
          notes: 'Dry-run preview: 0 messages sent. Idempotency key verified.'
        };

        set(state => ({
          outreachHistory: [newItem, ...state.outreachHistory]
        }));

        return { idempotencyKey };
      },

      sendEmailTest: async (prospectId) => {
        const prospect = get().prospects.find(p => p.id === prospectId);
        const providerId = `gmail-demo-${Math.random().toString(16).substring(2, 8)}`;
        const idempotencyKey = `idem_test_${Date.now()}_${prospectId}`;

        // Check injected Gmail failure
        if (failureManager.consume('gmail_429')) {
          return { success: false, error: 'Gmail API rate-limited (HTTP 429). Held safely; not retried blindly.' };
        }
        if (failureManager.consume('gmail_auth')) {
          return { success: false, error: 'Gmail OAuth authorization expired. Sending halted safely until token renewal.' };
        }

        const newItem: OutreachItem = {
          id: 'out_' + Date.now(),
          timestamp: get().demoClock,
          prospectId,
          prospectName: prospect?.name || 'Prospect',
          channel: 'email',
          templateVersion: 'label_intro v2',
          action: 'test',
          result: 'delivered',
          providerId,
          idempotencyKey,
          notes: 'Delivered to test recipient owner@cadence.demo'
        };

        set(state => ({
          outreachHistory: [newItem, ...state.outreachHistory],
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: state.demoClock,
              user: 'Owner',
              action: 'Test Email Dispatched',
              target: `${prospectId} to owner@cadence.demo`,
              before: 'Ready',
              after: `Delivered (provider: ${providerId})`
            },
            ...state.auditLogs
          ]
        }));

        return { success: true, providerId };
      },

      sendEmailLive: async (prospectId) => {
        const { liveSendArmed } = get().settings.safety;
        if (!liveSendArmed) {
          return { success: false, error: 'Live sending is OFF by default. Arm live sending in Safety settings first.' };
        }

        // Check send timeout injection
        if (failureManager.consume('send_timeout')) {
          const newItem: OutreachItem = {
            id: 'out_' + Date.now(),
            timestamp: get().demoClock,
            prospectId,
            prospectName: get().prospects.find(p => p.id === prospectId)?.name || 'Prospect',
            channel: 'email',
            templateVersion: 'label_intro v2',
            action: 'live_send',
            result: 'uncertain',
            idempotencyKey: `idem_live_${Date.now()}_${prospectId}`,
            notes: 'Provider timeout after submission. Status uncertain: reconciliation required.'
          };
          set(state => ({
            outreachHistory: [newItem, ...state.outreachHistory]
          }));
          return { success: false, error: 'Result unknown: Request timed out after submission. Marked Uncertain. Do not blindly resend.' };
        }

        const providerId = `gmail-demo-${Math.random().toString(16).substring(2, 8)}`;
        const newItem: OutreachItem = {
          id: 'out_' + Date.now(),
          timestamp: get().demoClock,
          prospectId,
          prospectName: get().prospects.find(p => p.id === prospectId)?.name || 'Prospect',
          channel: 'email',
          templateVersion: 'label_intro v2',
          action: 'live_send',
          result: 'delivered',
          providerId,
          idempotencyKey: `idem_live_${Date.now()}_${prospectId}`,
          notes: 'Dispatched via Gmail API (simulated)'
        };

        set(state => ({
          outreachHistory: [newItem, ...state.outreachHistory],
          settings: {
            ...state.settings,
            outreach: {
              ...state.settings.outreach,
              emailsSentToday: state.settings.outreach.emailsSentToday + 1
            }
          }
        }));

        return { success: true, providerId };
      },

      reconcileUncertainOutreach: async (outreachId) => {
        const item = get().outreachHistory.find(o => o.id === outreachId);
        if (!item) return { resolvedStatus: 'failed' };

        // 70% chance found in sent history, 30% not found
        const found = Math.random() < 0.7;
        const resolvedStatus = found ? 'delivered' : 'failed';
        const providerId = found ? `gmail-demo-rec-${Math.random().toString(16).substring(2, 6)}` : undefined;

        set(state => ({
          outreachHistory: state.outreachHistory.map(o =>
            o.id === outreachId
              ? {
                  ...o,
                  result: resolvedStatus,
                  providerId: providerId || o.providerId,
                  notes: found
                    ? `Reconciliation succeeded: Message confirmed in sent logs (${providerId})`
                    : 'Reconciliation concluded: Message was not received by provider. Safe to retry.'
                }
              : o
          ),
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: state.demoClock,
              user: 'Owner',
              action: 'Reconcile Uncertain Send',
              target: outreachId,
              before: 'Uncertain',
              after: `Resolved: ${resolvedStatus.toUpperCase()}`
            },
            ...state.auditLogs
          ]
        }));

        return { resolvedStatus, providerId };
      },

      setLiveSendArmed: (armed) => {
        set(state => ({
          settings: {
            ...state.settings,
            safety: {
              ...state.settings.safety,
              liveSendArmed: armed
            }
          },
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: state.demoClock,
              user: 'Owner',
              action: armed ? 'Arm Live Sending' : 'Disarm Live Sending',
              target: 'Safety Switch',
              before: armed ? 'OFF' : 'Armed',
              after: armed ? 'Armed (Simulated)' : 'OFF'
            },
            ...state.auditLogs
          ]
        }));
      },

      setProcessingPaused: (paused) => {
        set(state => ({
          settings: {
            ...state.settings,
            safety: {
              ...state.settings.safety,
              processingPaused: paused
            }
          },
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: state.demoClock,
              user: 'Owner',
              action: paused ? 'Pause All Processing' : 'Resume Processing',
              target: 'Scheduler',
              before: paused ? 'Active' : 'Paused',
              after: paused ? 'Paused' : 'Active'
            },
            ...state.auditLogs
          ]
        }));
      },

      updateWeights: (category, newWeights) => {
        set(state => {
          const updatedSettings = {
            ...state.settings,
            weights: {
              ...state.settings.weights,
              [category]: newWeights
            }
          };

          // Re-score all relevant prospects live!
          const updatedProspects = state.prospects.map(p => {
            if (
              (category === 'label' && p.type === 'label') ||
              (category === 'sync' && p.type === 'sync') ||
              (category === 'artist' && p.type === 'artist')
            ) {
              const { score } = calculateScore(p, newWeights);
              return { ...p, score };
            }
            return p;
          });

          return {
            settings: updatedSettings,
            prospects: updatedProspects,
            auditLogs: [
              {
                id: 'aud_' + Date.now(),
                timestamp: state.demoClock,
                user: 'Owner',
                action: 'Update Scoring Weights',
                target: category.toUpperCase(),
                before: 'Previous weights',
                after: 'Re-scored 46 records'
              },
              ...state.auditLogs
            ]
          };
        });
      },

      updateThresholds: (thresholds) => {
        set(state => ({
          settings: {
            ...state.settings,
            thresholds
          }
        }));
      },

      updateOutreachSettings: (partial) => {
        set(state => ({
          settings: {
            ...state.settings,
            outreach: {
              ...state.settings.outreach,
              ...partial
            }
          }
        }));
      },

      resetWeightsToDefaults: () => {
        get().updateWeights('label', defaultWeights.label);
        get().updateWeights('sync', defaultWeights.sync);
        get().updateWeights('artist', defaultWeights.artist);
      },

      startRun: (pipeline, isDryRun = false) => {
        const currentActive = get().activeRun;
        if (currentActive && !currentActive.isFinished) {
          get().addToast({
            type: 'error',
            title: 'Overlap lock held',
            message: `Run ${currentActive.id} is currently active. Overlapping runs are rejected.`
          });
          return;
        }

        const runId = `run_${Date.now()}_${pipeline === 'companies' ? 'co' : 'ar'}`;
        const has429 = failureManager.consume('source_429');
        const has403 = failureManager.consume('source_403');
        const hasModelTimeout = failureManager.consume('local_model_timeout');

        set({
          activeRun: {
            id: runId,
            pipeline,
            isDryRun,
            stage: 1,
            stageName: 'Stage 1: Discover',
            logs: [
              `[${get().demoClock.split(', ')[1] || '14:12'}] Pipeline initiated for ${pipeline} (${isDryRun ? 'DRY RUN' : 'PRODUCTION'})`,
              `[${get().demoClock.split(', ')[1] || '14:12'}] Polling 5 registered data sources...`
            ],
            candidatesFound: 0,
            duplicatesMerged: 0,
            newQualified: 0,
            isFinished: false,
            isPartial: false
          }
        });

        // Scripted execution progression
        setTimeout(() => {
          if (!get().activeRun) return;
          set(state => ({
            activeRun: state.activeRun
              ? {
                  ...state.activeRun,
                  stage: 2,
                  stageName: 'Stage 2: Extract & Normalise',
                  candidatesFound: 14,
                  logs: [
                    ...state.activeRun.logs,
                    has429
                      ? '[14:12:04] Source "Music search provider" returned HTTP 429. Initiating exponential backoff (2s, 6s, 18s)...'
                      : '[14:12:04] 5 sources polled cleanly. 14 raw prospect candidates discovered.',
                    '[14:12:06] Normalising domains and handles against 30-day index...'
                  ]
                }
              : null
          }));
        }, 1800);

        setTimeout(() => {
          if (!get().activeRun) return;
          set(state => ({
            activeRun: state.activeRun
              ? {
                  ...state.activeRun,
                  stage: 3,
                  stageName: 'Stage 3: Local Qualification',
                  duplicatesMerged: 2,
                  logs: [
                    ...state.activeRun.logs,
                    '[14:12:08] 2 duplicates merged via canonical identity keys.',
                    hasModelTimeout
                      ? '[14:12:10] Local model timed out after 45s on 1 candidate. Candidate held for review.'
                      : '[14:12:10] Evaluating hard gates G1–G10 with local llama.cpp endpoint...'
                  ]
                }
              : null
          }));
        }, 3600);

        setTimeout(() => {
          if (!get().activeRun) return;
          const isPartial = has429 || has403 || hasModelTimeout;

          const completedRun: Run = {
            id: runId,
            pipeline,
            startedAt: get().demoClock,
            duration: '42s',
            status: isPartial ? 'partial' : 'success',
            isDryRun,
            sourcesCount: 5,
            candidatesFetched: 14,
            newCandidates: 2,
            mergedDuplicates: 2,
            failedSources: isPartial ? 1 : 0,
            logs: [
              ...(get().activeRun?.logs || []),
              isPartial
                ? '[14:12:14] Run finished as PARTIAL: 2 qualified records preserved; deferred 1 source.'
                : '[14:12:14] Run completed with SUCCESS: 2 new qualified prospects appended to Review queue.'
            ]
          };

          set(state => ({
            activeRun: state.activeRun
              ? {
                  ...state.activeRun,
                  stage: 4,
                  stageName: isPartial ? 'Completed (Partial)' : 'Completed (Success)',
                  newQualified: 2,
                  isFinished: true,
                  isPartial
                }
              : null,
            runs: [completedRun, ...state.runs],
            auditLogs: [
              {
                id: 'aud_' + Date.now(),
                timestamp: state.demoClock,
                user: 'System',
                action: isDryRun ? 'Dry Run Completed' : 'Pipeline Run Completed',
                target: runId,
                before: 'Running',
                after: isPartial ? 'Partial' : 'Success'
              },
              ...state.auditLogs
            ]
          }));

          get().addToast({
            type: isPartial ? 'warning' : 'success',
            title: isPartial ? 'Run completed (Partial)' : 'Run completed successfully',
            message: isPartial
              ? 'Source backoff deferred; 2 qualified records preserved.'
              : '2 new prospects ready for review.'
          });
        }, 5800);
      },

      cancelRun: () => {
        const active = get().activeRun;
        if (active) {
          set({
            activeRun: null,
            runs: [
              {
                id: active.id,
                pipeline: active.pipeline,
                startedAt: get().demoClock,
                duration: '12s',
                status: 'cancelled',
                sourcesCount: 5,
                candidatesFetched: active.candidatesFound,
                newCandidates: 0,
                mergedDuplicates: 0,
                failedSources: 0,
                logs: [...active.logs, '[Cancelled by operator]']
              },
              ...get().runs
            ]
          });
          get().addToast({
            type: 'info',
            title: 'Run cancelled',
            message: 'Active pipeline execution halted safely.'
          });
        }
      },

      fastForwardClock: () => {
        // Fast forward clock to 16:59:50 so the 17:00 run fires on screen
        set(state => ({
          demoClock: 'Mon 12 Oct 2026, 17:00',
          demoClockHour: 17,
          demoClockMinute: 0,
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: '12 Oct 2026 17:00',
              user: 'Demo Controls',
              action: 'Fast-forward clock',
              target: 'Scheduler',
              before: '14:12',
              after: '17:00 (Scheduled slot reached)'
            },
            ...state.auditLogs
          ]
        }));

        get().addToast({
          type: 'info',
          title: 'Scheduled Slot Reached: 17:00',
          message: 'Fast-forwarded to next scheduled Companies run.'
        });

        // Trigger the 17:00 run
        get().startRun('companies', false);
      },

      addSuppressionEntry: (entry) => {
        const existing = get().suppressionList.find(
          s => s.type === entry.type && s.value.toLowerCase() === entry.value.toLowerCase()
        );
        if (existing) {
          get().addToast({
            type: 'warning',
            title: 'Already suppressed',
            message: `${entry.value} is already on the suppression list.`
          });
          return false;
        }

        const newEntry: SuppressionEntry = {
          ...entry,
          id: 'sup_' + Date.now(),
          addedAt: get().demoClock
        };

        // Also update any matching prospect to suppressed status!
        const updatedProspects = get().prospects.map(p => {
          if (
            (entry.type === 'domain' && p.domain === entry.value) ||
            (entry.type === 'email' && p.contactValue === entry.value) ||
            (entry.type === 'ig_handle' && p.handle === entry.value)
          ) {
            return {
              ...p,
              status: 'suppressed' as ProspectStatus,
              gates: p.gates.map(g => (g.id === 'G10' ? { ...g, passed: false, reason: 'Suppressed: ' + entry.note } : g))
            };
          }
          return p;
        });

        set(state => ({
          suppressionList: [newEntry, ...state.suppressionList],
          prospects: updatedProspects,
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: state.demoClock,
              user: 'Owner',
              action: 'Add Suppression',
              target: entry.value,
              before: 'Allowed',
              after: `Suppressed (${entry.reason})`
            },
            ...state.auditLogs
          ]
        }));

        get().addToast({
          type: 'success',
          title: 'Suppression added',
          message: `${entry.value} has been permanently blocked from outreach.`
        });
        return true;
      },

      removeSuppressionEntry: (id, reason) => {
        const entry = get().suppressionList.find(s => s.id === id);
        if (!entry) return;

        set(state => ({
          suppressionList: state.suppressionList.filter(s => s.id !== id),
          auditLogs: [
            {
              id: 'aud_' + Date.now(),
              timestamp: state.demoClock,
              user: 'Owner',
              action: 'Remove Suppression',
              target: entry.value,
              before: 'Suppressed',
              after: `Removed: ${reason}`
            },
            ...state.auditLogs
          ]
        }));

        get().addToast({
          type: 'info',
          title: 'Suppression removed',
          message: `Suppression on ${entry.value} was removed.`
        });
      },

      resetDemoData: () => {
        failureManager.clear();
        set({
          prospects: [...initialCompanies, ...initialArtists],
          evidence: [...initialEvidence],
          runs: [...initialRuns],
          activeRun: null,
          outreachHistory: [...initialOutreachItems],
          suppressionList: [...initialSuppression],
          duplicateMerges: [...initialDuplicateMerges],
          sources: [...initialSources],
          auditLogs: [...initialAuditLogs],
          settings: {
            weights: defaultWeights,
            thresholds: defaultThresholds,
            safety: {
              liveSendArmed: false,
              cloudReviewEnabled: true,
              cloudMonthlyCap: 150,
              cloudRunCap: 12,
              cloudReviewsThisMonth: 23,
              processingPaused: false
            },
            outreach: {
              dailyEmailCap: 25,
              runEmailCap: 10,
              emailsSentToday: 0,
              pacingSeconds: 90,
              bookingUrl: 'https://booking.example/owner/intro-call',
              ownerEmail: 'owner@cadence.demo',
              ownerTimezone: 'Asia/Singapore (UTC+8)'
            }
          },
          demoClock: 'Mon 12 Oct 2026, 14:12',
          demoClockHour: 14,
          demoClockMinute: 12,
          emptyStateMode: false,
          toasts: []
        });

        get().addToast({
          type: 'success',
          title: 'Demo Data Reset',
          message: 'All 46 prospects, evidence, and audit logs restored to pristine state.'
        });
      }
    }),
    {
      name: 'cd_demo_v1',
      partialize: (state) => ({
        session: state.session,
        prospects: state.prospects,
        settings: state.settings,
        suppressionList: state.suppressionList,
        outreachHistory: state.outreachHistory,
        auditLogs: state.auditLogs
      })
    }
  )
);
