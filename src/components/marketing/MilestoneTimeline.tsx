import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const MilestoneTimeline: React.FC = () => {
  const [expandedM, setExpandedM] = useState<number | null>(0);
  const navigate = useNavigate();

  const milestones = [
    {
      id: 'M1',
      title: 'Pipeline Spine & Feasibility Proof',
      goal: 'Connect to existing local model endpoint, retrieve 1 real label and 1 real artist, prove zero hallucinations, and establish the source feasibility matrix.',
      deliverables: 'Base Python app, SQLite schema, local endpoint client, CLI runner, source matrix.',
      passCriteria: [
        'Local llama.cpp/Qwen endpoint called as-is without rebuilding server',
        '1 real Asian company and 1 real artist ingested with traceable evidence',
        'Re-run on same input produces zero duplicate records',
        'Instagram outbound messaging constraints documented with manual fallback'
      ]
    },
    {
      id: 'M2',
      title: 'Company Pipeline (Labels & Sync)',
      goal: 'Ingest and qualify at least 12 real Asian record labels and 8 sync/licensing houses across >= 3 Asian markets.',
      deliverables: 'Label scorecard, Sync scorecard, gate evaluation engine, dedup store.',
      passCriteria: [
        'At least 12 labels and 8 sync companies qualified with scores and citations',
        'Every score point links to stored URL and retrieval timestamp',
        'Unsupported claims score 0 points and trigger gate failure',
        'Suppressed prospects cannot be approved'
      ]
    },
    {
      id: 'M3',
      title: 'Artist Pipeline & Service-Fit Engine',
      goal: 'Ingest and qualify at least 15 real independent artists with 4 discrete service-fit scores (production, songwriting, mixing, mastering).',
      deliverables: 'Artist scorecard, 4-dimension service fit evaluator, explicit vs inferred tagging.',
      passCriteria: [
        'At least 15 independent artists scored with verified original releases',
        '4 separate service-fit scores evaluated per artist with evidence rationale',
        'Inferred need explicitly labelled as hypothesis; explicit statements cited'
      ]
    },
    {
      id: 'M4',
      title: 'Shortlist Gate & Cloud Model Review',
      goal: 'Bounded shortlist engine and cloud review integration with per-run and monthly spend caps and emergency kill switch.',
      deliverables: 'Shortlist ranker, payload minimizer, cloud model client, cost meter.',
      passCriteria: [
        'Shortlist bounded to <= 12 candidates per run',
        'Cloud review payload minimizes data: no emails, no raw web text',
        'Emergency stop switch freezes shortlist instantly',
        'Malformed responses default safely to hold — never approves on error'
      ]
    },
    {
      id: 'M5',
      title: 'Outreach & Scheduling Daemons',
      goal: 'Gmail OAuth dry-run and pacing engine, manual Instagram queue, and 5-run-per-day scheduler with overlap locks.',
      deliverables: 'Email preview/dry-run, manual Instagram queue, cron scheduler, audit log.',
      passCriteria: [
        'Live-send switch is OFF by default; test email sends only to owner',
        'Second send blocked by idempotency key with zero duplicate contact',
        'Ambiguous provider timeout reconciles instead of blind resend',
        '5 scheduled runs per day respect overlap locks and never arm live sending'
      ]
    },
    {
      id: 'M6',
      title: 'Web Console, Hardening & Handover',
      goal: 'Secure HTTPS single-owner console, health check endpoint, proven backup and restore, and runbook handover.',
      deliverables: 'Tailscale/reverse-proxy protected dashboard, /healthz, backup verification, runbook.',
      passCriteria: [
        'Full HTTPS dashboard operational with audit trail of manual decisions',
        'Nightly SQLite backup verified into clean test directory',
        'Health check returns 200 OK with sub-second latency',
        'Complete operator runbook delivered'
      ]
    }
  ];

  return (
    <section id="milestones" className="py-20 border-b border-border">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-sans font-semibold text-accent uppercase tracking-wider mb-2">
              Delivery Roadmap
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal">
              Six gates, pass or fail.
            </h2>
            <p className="text-text-secondary text-base max-w-xl mt-2 leading-relaxed">
              Every milestone ends with an objective, pass/fail verification gate before the next milestone begins.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/app/plan')}
            className="self-start sm:self-auto"
          >
            Open Delivery Plan in Console <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>

        {/* Milestone Accordion List */}
        <div className="space-y-3">
          {milestones.map((m, idx) => {
            const isExpanded = expandedM === idx;

            return (
              <div
                key={m.id}
                className={`rounded-xl border transition-all ${
                  isExpanded ? 'bg-surface-elevated border-primary shadow-2' : 'bg-surface border-border hover:border-border-strong'
                }`}
              >
                <div
                  onClick={() => setExpandedM(isExpanded ? null : idx)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-accent bg-accent-tint/40 px-2.5 py-1 rounded-sm border border-accent/20">
                      {m.id}
                    </span>
                    <div>
                      <h3 className="font-sans font-semibold text-sm text-ink">{m.title}</h3>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{m.goal}</p>
                    </div>
                  </div>

                  <span className="text-text-muted text-sm font-mono ml-4">
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-border space-y-4 text-xs font-sans animate-in fade-in-50">
                    <div>
                      <div className="font-semibold text-text-secondary uppercase tracking-wider text-[11px] mb-1">
                        Goal
                      </div>
                      <p className="text-text-secondary leading-relaxed">{m.goal}</p>
                    </div>

                    <div>
                      <div className="font-semibold text-text-secondary uppercase tracking-wider text-[11px] mb-2">
                        Pass / Fail Verification Criteria
                      </div>
                      <div className="space-y-1.5">
                        {m.passCriteria.map((c, cIdx) => (
                          <div key={cIdx} className="flex items-start gap-2 text-ink">
                            <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-text-muted">
          Quote per milestone and timeline schedule are detailed in the formal proposal text.
        </div>
      </div>
    </section>
  );
};
