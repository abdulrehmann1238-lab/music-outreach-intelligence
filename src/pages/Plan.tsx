import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Terminal, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface MilestoneItem {
  id: string;
  code: string;
  title: string;
  goal: string;
  deliverables: string[];
  passCriteria: string[];
  demoLinks: { label: string; path: string }[];
  risks: string;
}

const MILESTONES: MilestoneItem[] = [
  {
    id: 'm1',
    code: 'M1',
    title: 'Core Spine, Ingestion & Feasibility Matrix',
    goal: 'Establish the Python + SQLite local spine, run discovery on real targets, test local llama.cpp/Qwen inference, and validate external platform reality.',
    deliverables: [
      'SQLite database schema (v0001) with deduplication & idempotency constraints',
      'Config loader with local secrets isolation (non-readable by developer account)',
      'Single-target ingestion for 1 real label and 1 real artist',
      'Local model extraction client calling existing llama.cpp endpoint without modification',
      'Source feasibility matrix document covering rate limits, terms, and Instagram constraints'
    ],
    passCriteria: [
      'Demonstrate ingestion of 1 real Asian label and 1 real artist with full evidence preservation',
      'Local model produces strictly validated JSON rationale matching schema',
      'Re-running the extraction proves zero duplicates created (idempotency key matches)',
      'Instagram API reality audited: feasibility report delivered before automation claims'
    ],
    demoLinks: [
      { label: 'Sources Matrix', path: '/app/sources' },
      { label: 'Jobs & Pipeline Spine', path: '/app/jobs' }
    ],
    risks: 'Instagram anti-automation measures and Meta developer app approval requirements. Fallback: manual queue.'
  },
  {
    id: 'm2',
    code: 'M2',
    title: 'Company Pipeline (Labels & Sync) & Scorecard',
    goal: 'Scale discovery and qualification of Asian record labels and sync/licensing houses with verifiable 100-pt scorecard and hard gates.',
    deliverables: [
      'Discovery parsers for official company domains, catalogs, and directory databases',
      'Multi-source evidence store with date stamping, parse status, and URL normalisation',
      'Label & Sync 100-pt scorecard engine with arithmetic transparency',
      'Hard gates engine (G1–G10) overriding high scores on missing evidence or suppression'
    ],
    passCriteria: [
      'Discover and qualify at least 12 Asian record labels and 8 sync/licensing firms',
      'Every score point traceable to a stored, timestamped evidence snippet',
      'Unsupported claims visibly earn 0 points',
      'Hard gate rejection cleanly demonstrated (Bandcamp-only or suppressed records held)'
    ],
    demoLinks: [
      { label: 'Companies List', path: '/app/companies' },
      { label: 'Scoring Detail (co_0001)', path: '/app/companies/co_0001' },
      { label: 'Gate Demonstration (co_0024)', path: '/app/companies/co_0024' }
    ],
    risks: 'Regional website structural diversity (Japanese/Korean/Chinese character encoding and translation accuracy).'
  },
  {
    id: 'm3',
    code: 'M3',
    title: 'Artist Pipeline & 4-Service Fit Engine',
    goal: 'Surface independent artists needing production, songwriting, mixing, or mastering, distinguishing explicit requests from hypothetical inferred need.',
    deliverables: [
      'Artist discovery parsers across public streaming and video channels',
      'Independence verification check (repertoire release credits vs self-releases)',
      '4 separate service fit evaluations (Production, Songwriting, Mixing, Mastering)',
      'Rigorous Explicit vs Hypothesis labeling engine for ethical outreach'
    ],
    passCriteria: [
      'Process at least 20 independent artists across 3+ Asian markets',
      'Four separate service scores generated with independent evidence citations',
      'Hypothesis tags visibly appended to non-explicit claims with appropriate disclaimers',
      'Zero outreach permitted to artists without viable contact path or active releases'
    ],
    demoLinks: [
      { label: 'Artists List', path: '/app/artists' },
      { label: 'Artist Detail (ar_0001)', path: '/app/artists/ar_0001' }
    ],
    risks: 'Distinguishing hobbyist self-releases from artists with professional intent and budget capability.'
  },
  {
    id: 'm4',
    code: 'M4',
    title: 'Bounded Shortlist & Cloud Final Review Gate',
    goal: 'Establish the bounded review gate where only pre-qualified, gate-passing prospects reach a cloud model for final human-like verification.',
    deliverables: [
      'Shortlist builder with strict per-run capping (max 12 prospects) and monthly budget counters',
      'Payload minimiser stripping private emails and raw web scrapes before cloud dispatch',
      'Cloud model reviewer with structured schema validation and safe error fallback',
      'Immediate hardware kill-switch and zero-spend off toggle'
    ],
    passCriteria: [
      'Demonstrate cloud review on bounded batch of qualified candidates',
      'Zero model hallucinations approved; malformed responses default safely to Hold',
      'Cost logging verified under owner-defined monthly caps',
      'Off-switch halts all cloud calls immediately without pipeline failure'
    ],
    demoLinks: [
      { label: 'Review & Shortlist Gate', path: '/app/review' },
      { label: 'Settings: Safety Caps', path: '/app/settings' }
    ],
    risks: 'Cloud provider rate limits or latency spikes. Mitigation: asynchronous queue and idempotent retry.'
  },
  {
    id: 'm5',
    code: 'M5',
    title: 'Controlled Outreach & Delivery Safety',
    goal: 'Deploy safe email sending (Gmail OAuth) with dry-run mode, test recipient sandbox, and a manual operator queue for Instagram.',
    deliverables: [
      'Gmail OAuth provider integration with least-privilege token storage',
      'Evidence-grounded template compiler (tokens backed by evidence citations)',
      'Live-send safety interlock (OFF by default, requires explicit confirmation)',
      'Instagram manual operator queue with clipboard copying and outcome tracking',
      'Idempotency lock preventing duplicate contacts under all conditions'
    ],
    passCriteria: [
      'Dry-run execution confirms 0 external messages sent while proving message payload',
      'Test send delivers flawlessly to owner test inbox with provider ID logging',
      'Repeated send attempts blocked by idempotency key with transparent error audit',
      'Ambiguous timeout enters Uncertain state requiring reconciliation rather than blind resend'
    ],
    demoLinks: [
      { label: 'Outreach Console', path: '/app/outreach' },
      { label: 'Suppression & Dedup', path: '/app/suppression' }
    ],
    risks: 'Unintentional spam classification. Mitigation: conservative pacing (90s ± 30s) and strict daily caps.'
  },
  {
    id: 'm6',
    code: 'M6',
    title: 'Secure Dashboard, Hardening & Handover',
    goal: 'Package the system into a hardened, single-owner HTTPS dashboard running on the Ubuntu 22.04 server with automated backup and restore verification.',
    deliverables: [
      'Tailscale / local-only authenticated web console with role-free single-owner security',
      'Automated nightly SQLite snapshots with cryptographic SHA-256 integrity verification',
      'Full restore verification wizard testing prospect, evidence, and decision recovery',
      'Operator runbook covering service restart, log rotation, and emergency shutdown'
    ],
    passCriteria: [
      'Demonstrate end-to-end restore into clean location with 100% record match',
      'All credentials redacted from application logs and inaccessible to developer account',
      'Health check endpoint `/healthz` operational with continuous telemetry',
      'Complete operator runbook handed over with self-contained system ownership'
    ],
    demoLinks: [
      { label: 'System Health & Backups', path: '/app/system' },
      { label: 'Settings & Security', path: '/app/settings' }
    ],
    risks: 'Host environment dependency drift. Mitigation: fixed virtual environment and systemd service units.'
  }
];

export const Plan: React.FC = () => {
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    m1: true,
    m2: false,
    m3: false,
    m4: false,
    m5: false,
    m6: false
  });
  const [copiedProposalMarkdown, setCopiedProposalMarkdown] = useState(false);
  const addToast = useAppStore(state => state.addToast);

  const toggleMilestone = (id: string) => {
    setExpandedMilestones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyMarkdown = () => {
    const md = MILESTONES.map(m => `
### ${m.code}: ${m.title}
**Goal:** ${m.goal}
**Deliverables:**
${m.deliverables.map(d => `- ${d}`).join('\n')}
**Pass Criteria:**
${m.passCriteria.map(p => `- [ ] ${p}`).join('\n')}
**Risk & Mitigation:** ${m.risks}
`).join('\n---\n');

    navigator.clipboard.writeText(md);
    setCopiedProposalMarkdown(true);
    addToast({
      title: 'Copied to clipboard',
      message: 'Delivery plan markdown ready to paste into proposal',
      type: 'info'
    });
    setTimeout(() => setCopiedProposalMarkdown(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-mono font-medium mb-1">
            System Implementation Roadmap
          </div>
          <h1 className="font-display text-3xl font-normal text-[var(--ink)]">
            Delivery Plan
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Six milestones with objective pass/fail gates. Prices and timeline commitments are in the written proposal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyMarkdown}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-sunken)] transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copiedProposalMarkdown ? 'Copied Markdown' : 'Copy as Proposal Text'}
          </button>
        </div>
      </div>

      {/* Main Grid: Milestones + Sticky M1 Demo Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Milestones Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
            <span>Milestone Gates (M1 – M6)</span>
            <span>Click to inspect deliverables & pass criteria</span>
          </div>

          <div className="space-y-4">
            {MILESTONES.map((m, idx) => {
              const isExpanded = !!expandedMilestones[m.id];
              return (
                <div 
                  key={m.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-1)] overflow-hidden transition-all"
                >
                  {/* Milestone Header */}
                  <div 
                    onClick={() => toggleMilestone(m.id)}
                    className="p-5 flex items-start justify-between cursor-pointer hover:bg-[var(--surface-sunken)]/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-lg bg-[var(--primary-tint)] border border-[var(--primary)]/20 text-[var(--primary)] font-mono text-sm font-semibold flex items-center justify-center shrink-0">
                        {m.code}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-[var(--ink)]">
                            {m.title}
                          </h3>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-sunken)] text-[var(--text-secondary)] font-mono">
                            Gate {idx + 1}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                          {m.goal}
                        </p>
                      </div>
                    </div>

                    <button 
                      type="button"
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors mt-0.5"
                      aria-label={isExpanded ? 'Collapse milestone' : 'Expand milestone'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-[var(--border)]/60 bg-[var(--surface)] space-y-5 text-xs animate-fadeIn">
                      {/* Deliverables */}
                      <div>
                        <div className="font-semibold text-[var(--ink)] uppercase tracking-wider text-[11px] mb-2 font-mono">
                          Deliverables
                        </div>
                        <ul className="space-y-1.5 pl-4 list-disc text-[var(--text-secondary)]">
                          {m.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pass Criteria */}
                      <div className="p-3.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)]">
                        <div className="font-semibold text-[var(--ink)] flex items-center gap-1.5 text-xs mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
                          <span>Objective Pass / Fail Criteria</span>
                        </div>
                        <div className="space-y-2">
                          {m.passCriteria.map((crit, cIdx) => (
                            <div key={cIdx} className="flex items-start gap-2">
                              <span className="font-mono text-[var(--success)] text-xs mt-0.5">✓</span>
                              <span className="text-[var(--text-secondary)] leading-relaxed font-sans">{crit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Demo Deep Links */}
                      <div>
                        <div className="font-semibold text-[var(--ink)] uppercase tracking-wider text-[11px] mb-2 font-mono">
                          Previewed in This Interactive Demo
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.demoLinks.map((link, lIdx) => (
                            <Link
                              key={lIdx}
                              to={link.path}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--primary-tint)]/60 text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--primary-tint)] transition-colors font-medium text-xs"
                            >
                              <span>{link.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Risks */}
                      <div className="flex items-start gap-2 text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border)]/40">
                        <AlertTriangle className="w-3.5 h-3.5 text-[var(--warning)] shrink-0 mt-0.5" />
                        <span><strong>Risk focus:</strong> {m.risks}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sticky M1 Plan + Four Core Answers */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* M1 Demonstration Spec Box */}
          <div className="rounded-xl border border-[var(--primary)]/30 bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--primary)] uppercase tracking-wider mb-2">
              <Terminal className="w-4 h-4" />
              <span>Milestone 1 Working Proof</span>
            </div>
            <h3 className="font-display text-lg font-normal text-[var(--ink)] mb-2">
              First Demonstration Spec
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Milestone 1 does not present mockups. It demonstrates live code executing on your server:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)]">
                <div className="font-semibold text-[var(--ink)] mb-1">1. Live Single-Target Ingestion</div>
                <p className="text-[var(--text-muted)]">
                  Ingests 1 real Asian record label website and 1 real independent artist profile into the local SQLite store.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)]">
                <div className="font-semibold text-[var(--ink)] mb-1">2. Zero Model Server Modification</div>
                <p className="text-[var(--text-muted)]">
                  Connects via REST directly to your existing llama.cpp / Qwen local endpoint as-is. No rebuilds, no container tampering.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)]">
                <div className="font-semibold text-[var(--ink)] mb-1">3. Idempotency Proof</div>
                <p className="text-[var(--text-muted)]">
                  Running ingestion a second time creates zero duplicate rows, outputting the exact deduplication match key.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)]">
                <div className="font-semibold text-[var(--ink)] mb-1">4. Feasibility Matrix Handover</div>
                <p className="text-[var(--text-muted)]">
                  Full technical risk report detailing rate limits, terms of service, and realistic Instagram outbound parameters.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" />
              <span>Pass gate must be met before Milestone 2 begins.</span>
            </div>
          </div>

          {/* AI Disclosure Note */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)]/60 p-4 text-xs text-[var(--text-secondary)] space-y-2">
            <div className="font-mono uppercase tracking-wider text-[10px] text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              Mandatory Proposal Disclosure
            </div>
            <p className="italic font-serif text-[13px] text-[var(--ink)] leading-snug">
              "AI-assisted response: I used an AI system to help prepare this reply."
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Included verbatim in the submitted proposal per the exact brief requirement.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Four Core Questions from the Brief */}
      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <div className="max-w-2xl mb-6">
          <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-mono font-medium mb-1">
            Brief Alignment
          </div>
          <h2 className="font-display text-2xl font-normal text-[var(--ink)]">
            Four Direct Answers to the Client Brief
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Concise, transparent engineering decisions addressing the client's explicit questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-1)] space-y-2">
            <div className="font-mono text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
              1. Biggest Technical & Platform Risk
            </div>
            <h4 className="text-sm font-semibold text-[var(--ink)]">
              Outbound Instagram Messaging Viability & Scraping Fragility
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Automated unsolicited direct messaging via Instagram API is severely restricted by Meta terms and app review. Unofficial browser automation risks account termination. 
              <strong> The strategy:</strong> Treat automation as unverified until audited in M1. Build the system around an ergonomic <em>manual operator queue</em> (prepared message, profile link, 1-click clipboard, outcome logging). If automation is verified feasible later, it is an upgrade; the system is already 100% operational without it.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-1)] space-y-2">
            <div className="font-mono text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
              2. Production Credential & Secret Protection
            </div>
            <h4 className="text-sm font-semibold text-[var(--ink)]">
              Strict Non-Readable Isolation from Restricted SSH
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Developer SSH accounts never have read access to live production credentials. Secrets (Gmail OAuth refresh tokens, Cloud API keys) reside in a root-owned runtime file (e.g. <code>/etc/cadence-desk/secrets.env</code> mode 0600) accessible exclusively by the isolated systemd daemon user. 
              The Cloud API key is not provisioned until Milestone 4. Application logs redact all authorization tokens with regex masking.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-1)] space-y-2">
            <div className="font-mono text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
              3. Milestone 1 Demonstration Scope
            </div>
            <h4 className="text-sm font-semibold text-[var(--ink)]">
              End-to-End Spine with 1 Real Label & 1 Real Artist
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              M1 proves the complete pipeline spine with live code: fetches 1 real label website and 1 real artist profile, calls your local Qwen/llama.cpp server to extract structured facts, saves timestamped evidence to SQLite, and prints the auditable scorecard. Re-running the command proves idempotent deduplication. No live emails or DMs are sent.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-1)] space-y-2">
            <div className="font-mono text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
              4. Verification Required Before Promising Instagram Automation
            </div>
            <h4 className="text-sm font-semibold text-[var(--ink)]">
              Four Non-Negotiable API & Platform Gates
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Before promising any automated Instagram outbound messaging, four realities must be verified: 
              (a) Whether Meta Graph API <code>instagram_manage_messages</code> permission allows messaging users without prior inbound interaction, 
              (b) App Review approval feasibility for single-tenant private tools, 
              (c) Account tier requirements (Professional/Creator account linking to Facebook Page), and 
              (d) Anti-spam velocity thresholds to safeguard your personal brand profile from shadowbanning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
