import React, { useState } from 'react';
import { Check, X, Shield, Clock, FileText } from 'lucide-react';

export const StoryScroll: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      num: '01',
      title: 'Discover & Ingest',
      subtitle: 'Polite crawl, zero third-party broker leak',
      summary: 'Targets Asian labels, sync houses and artists across official sites, regional registries, and streaming metadata.',
      miniUi: (
        <div className="p-4 rounded-lg bg-surface border border-border space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="font-semibold text-ink font-sans">Active Ingest Sources</span>
            <span className="text-[10px] text-success">Pacing 1 req/sec</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center p-1.5 rounded-xs bg-surface-sunken">
              <span>moonlitharbor.example.tw</span>
              <span className="text-success font-semibold">200 OK · 42ms</span>
            </div>
            <div className="flex justify-between items-center p-1.5 rounded-xs bg-surface-sunken">
              <span>streaming.example/label/042</span>
              <span className="text-success font-semibold">200 OK · 110ms</span>
            </div>
            <div className="flex justify-between items-center p-1.5 rounded-xs bg-surface-sunken">
              <span>search-provider.example</span>
              <span className="text-warning font-semibold">429 → Backoff 6s</span>
            </div>
          </div>
          <div className="text-[10px] text-text-muted font-sans">
            A broken or rate-limited page never discards the run. Successful candidates are kept.
          </div>
        </div>
      )
    },
    {
      num: '02',
      title: 'Extract & Normalise Evidence',
      subtitle: 'Citations preserved with timestamp and source URL',
      summary: 'Every claimed release, catalog size, or contact inbox is verified against primary source HTML and stored in SQLite.',
      miniUi: (
        <div className="p-4 rounded-lg bg-surface border border-border space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="font-mono text-primary font-semibold">ev_0002</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-success-tint text-success font-medium">Parse: OK</span>
          </div>
          <div className="font-sans font-medium text-ink">Single "Glass Tide" by Lio Chen</div>
          <div className="font-mono text-[11px] text-text-muted truncate">https://moonlitharbor.example.tw/releases/glass-tide</div>
          <div className="p-2 rounded-xs bg-surface-sunken text-[11px] text-text-secondary leading-relaxed font-sans">
            "Catalog #MH-042. Release date: September 19, 2026. Mastered and distributed by Moonlit Harbor Records."
          </div>
          <div className="text-[10px] text-text-muted flex justify-between">
            <span>Retrieved: 12 Oct 2026 12:03</span>
            <span>Supports: Recent Activity</span>
          </div>
        </div>
      )
    },
    {
      num: '03',
      title: 'Local Qualification (llama.cpp)',
      subtitle: 'Zero cloud cost, zero private data leakage',
      summary: 'Existing local Qwen/llama.cpp model evaluates 10 hard gates and scores 7 weighted dimensions. Unsupported claims score 0.',
      miniUi: (
        <div className="p-4 rounded-lg bg-surface border border-border space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border font-sans">
            <span className="font-semibold text-ink">Hard Gate Check</span>
            <span className="text-xs font-mono text-primary font-bold">Fit Score: 90</span>
          </div>
          <div className="space-y-1 text-[11px] font-sans">
            <div className="flex items-center gap-2 text-success">
              <Check className="w-3.5 h-3.5" /> G1 Not duplicate / not contacted
            </div>
            <div className="flex items-center gap-2 text-success">
              <Check className="w-3.5 h-3.5" /> G5 Active release within 30 days
            </div>
            <div className="flex items-center gap-2 text-success">
              <Check className="w-3.5 h-3.5" /> G7 Direct A&R contact verified
            </div>
            <div className="flex items-center gap-2 text-error">
              <X className="w-3.5 h-3.5" /> G10 Suppressed (Cedar Gate Sync: 80 pts blocked)
            </div>
          </div>
          <div className="pt-2 border-t border-border text-[10px] text-text-muted">
            Rule: A high score never overrides a hard gate.
          </div>
        </div>
      )
    },
    {
      num: '04',
      title: 'Build Shortlist',
      subtitle: 'Strict batch bounding, zero run-away loops',
      summary: 'Shortlists only candidates scoring ≥75 with all 10 gates passed. Capped to max 12 candidates per run to control cloud review budget.',
      miniUi: (
        <div className="p-4 rounded-lg bg-surface border border-border space-y-2.5 text-xs font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="font-semibold text-ink">Ranked Shortlist Queue</span>
            <span className="text-[11px] font-mono bg-primary-tint text-primary px-2 py-0.5 rounded-xs font-medium">
              Bounded: 7 / 12 Max
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center p-2 rounded-md bg-surface-sunken">
              <span className="font-medium text-ink">Dalgona Hill Entertainment</span>
              <span className="font-mono text-primary font-bold">88 pts</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-surface-sunken">
              <span className="font-medium text-ink">Lantern Cut Music Supervision</span>
              <span className="font-mono text-primary font-bold">87 pts</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-surface-sunken">
              <span className="font-medium text-ink">Crescent Frame Audio</span>
              <span className="font-mono text-primary font-bold">85 pts</span>
            </div>
          </div>
        </div>
      )
    },
    {
      num: '05',
      title: 'Cloud Final Review Gate',
      subtitle: 'Minimized payload, monthly budget caps',
      summary: 'Cloud model reviews only 3 facts and gates for pre-qualified candidates. No emails, no raw web pages, no secrets are ever sent.',
      miniUi: (
        <div className="p-4 rounded-lg bg-surface border border-border space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-border font-sans">
            <span className="font-semibold text-ink">Minimized Cloud Payload</span>
            <span className="text-[10px] text-text-muted">Not sent: Emails / Raw pages</span>
          </div>
          <pre className="p-2 rounded-xs bg-surface-sunken text-[11px] text-text-secondary overflow-x-auto leading-relaxed">
{`{
  "entity": "Moonlit Harbor Records",
  "category": "Record label",
  "market": "Taipei, TW",
  "verified_release": "19 Sep 2026",
  "roster_count": 5,
  "gates_passed": 10
}`}
          </pre>
          <div className="flex justify-between text-[10px] font-sans text-text-muted">
            <span>Estimated Cost: $0.00 (Mock client)</span>
            <span>Monthly Cap: 23 / 150</span>
          </div>
        </div>
      )
    },
    {
      num: '06',
      title: 'Controlled Outreach & Audit',
      subtitle: 'Dry-run first, live send OFF by default',
      summary: 'Personalized templates grounded to evidence IDs. Ambiguous timeouts marked Uncertain and never resent blindly.',
      miniUi: (
        <div className="p-4 rounded-lg bg-surface border border-border space-y-2.5 text-xs font-sans">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="font-semibold text-ink">Outreach Execution Result</span>
            <span className="text-[10px] font-semibold text-success bg-success-tint px-2 py-0.5 rounded-xs">
              Dry-run complete
            </span>
          </div>
          <div className="p-2.5 rounded-md bg-surface-sunken space-y-1">
            <div className="font-medium text-ink">Result: 0 messages sent</div>
            <div className="font-mono text-[11px] text-text-secondary">
              Idempotency key: <span className="text-primary">sv-2026-10-12-t3</span>
            </div>
            <div className="text-[11px] text-text-muted">
              Live-send switch is OFF. Operator test emails require deliberate confirmation.
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 border-b border-border">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="text-xs font-sans font-semibold text-accent uppercase tracking-wider mb-2">
            Execution Spine
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal">
            Six stages, one rule.
          </h2>
          <p className="text-text-secondary text-base max-w-2xl mt-2 leading-relaxed">
            Every prospect passes through a deterministic sequence. If a company lacks evidence or fails a hard gate, it is stopped immediately.
          </p>
        </div>

        {/* Interactive Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Stage Selector */}
          <div className="lg:col-span-5 space-y-2">
            {stages.map((stage, idx) => (
              <div
                key={stage.num}
                onClick={() => setActiveStage(idx)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  activeStage === idx
                    ? 'bg-surface-elevated border-primary border-l-4 shadow-2'
                    : 'bg-surface border-border hover:bg-surface-sunken'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-accent">{stage.num}</span>
                  <span className="text-[11px] text-text-muted font-sans font-medium">{stage.subtitle}</span>
                </div>
                <h3 className="font-sans font-semibold text-sm text-ink">{stage.title}</h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{stage.summary}</p>
              </div>
            ))}
          </div>

          {/* Right: Live Composed Mini-UI for Active Stage */}
          <div className="lg:col-span-7 sticky top-24">
            <div className="bg-surface-elevated rounded-xl border border-border-strong shadow-2 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-accent">
                    Stage {stages[activeStage].num}
                  </span>
                  <span className="font-sans font-semibold text-sm text-ink">
                    {stages[activeStage].title} Live Component
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-muted">
                  Interactive Preview
                </span>
              </div>

              {/* Rendered Live Fragment */}
              {stages[activeStage].miniUi}

              {/* Rule Banner */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="font-display italic text-base text-ink">
                  "If it isn't in the evidence, it scores zero."
                </span>
                <span className="text-xs font-mono text-text-muted">
                  Evidence Rule G3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
