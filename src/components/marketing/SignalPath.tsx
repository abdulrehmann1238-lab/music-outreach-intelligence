import React, { useState } from 'react';

interface StageInfo {
  id: string;
  name: string;
  count: number;
  runtime: string;
  whatItDoes: string;
  whatItStores: string;
  whatCanGoWrong: string;
  deltaLabel?: string;
}

export const SignalPath: React.FC = () => {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const stages: StageInfo[] = [
    {
      id: 's1',
      name: 'Discover',
      count: 61,
      runtime: 'Python',
      whatItDoes: 'Crawls official company web directories, streaming metadata, and video feeds with strict polite rate-limits.',
      whatItStores: 'Raw URLs, source engine ID, retrieval HTTP status, discovery timestamp.',
      whatCanGoWrong: 'Source 429 rate limit or 403. Handled via exponential backoff (2s, 6s, 18s) without crashing the pipeline.',
      deltaLabel: '−15 duplicates merged'
    },
    {
      id: 's2',
      name: 'Extract & Normalise',
      count: 46,
      runtime: 'Python',
      whatItDoes: 'Normalises domain URLs and social handles. Extracts release dates, catalog size, and corporate registration.',
      whatItStores: 'Primary domain key, canonical handle, parsed text snippets, ISO activity dates.',
      whatCanGoWrong: 'Malformed HTML or unexpected layout. Parsed as Partial; raw HTML preserved for manual inspection.',
      deltaLabel: '−24 hard gates fail'
    },
    {
      id: 's3',
      name: 'Local Qualification',
      count: 22,
      runtime: 'Local Model',
      whatItDoes: 'Local llama.cpp/Qwen evaluates 10 hard gates and 7 weighted scorecard dimensions. Unsupported claims score 0.',
      whatItStores: 'Scores 0–100, dimension breakdowns, gate pass/fail flags, model rationale paragraph.',
      whatCanGoWrong: 'Local endpoint timeout (>45s) or invalid JSON. Discarded safely to hold; never approves on error.',
      deltaLabel: '−13 below threshold'
    },
    {
      id: 's4',
      name: 'Build Shortlist',
      count: 9,
      runtime: 'Python',
      whatItDoes: 'Filters strictly to candidates passing all 10 hard gates with score ≥75. Enforces hard batch size caps (max 12).',
      whatItStores: 'Bounded candidate queue, rank position, minimization payload package.',
      whatCanGoWrong: 'Queue exceeds budget cap. Excess candidates deferred safely to next run.',
      deltaLabel: '−7 cloud gate rejections'
    },
    {
      id: 's5',
      name: 'Cloud Final Review',
      count: 2,
      runtime: 'Cloud (Capped)',
      whatItDoes: 'Cloud model reviews minimized summary (3 facts + gates) for final safety gate before human outreach queue.',
      whatItStores: 'Cloud review outcome (Contact / No Contact / Defer), confidence stamp, token cost log.',
      whatCanGoWrong: 'API failure or quota limit reached. Shortlist freezes; safe default hold prevents automatic sends.',
      deltaLabel: '−1 pending response'
    },
    {
      id: 's6',
      name: 'Outreach & Audit',
      count: 1,
      runtime: 'Gmail / Manual',
      whatItDoes: 'Generates grounded personalized emails and manual Instagram DM queue cards. Strict idempotency enforcement.',
      whatItStores: 'Idempotency keys, provider message IDs, operator timestamps, reply logs.',
      whatCanGoWrong: 'Send timeout. Record enters Uncertain state; reconciliation required before any retry.',
      deltaLabel: '1 verified reply'
    }
  ];

  return (
    <div className="relative bg-surface rounded-xl border border-border p-6 shadow-1 select-none overflow-hidden">
      {/* Background waveform subtle line */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 800 200"
      >
        <path d="M0 100 Q 200 40, 400 100 T 800 100" stroke="var(--ink)" strokeWidth="2" fill="none" />
      </svg>

      <div className="flex items-center justify-between mb-6 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-sans font-semibold text-xs text-ink uppercase tracking-wider">
              The Signal Path (Architecture Pipeline)
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Hover any stage to inspect execution layer, preserved artifacts, and failure handling
          </p>
        </div>
        <span className="text-[11px] font-mono text-text-muted">
          Local-first · Cloud-last
        </span>
      </div>

      {/* Horizontal Visual for Desktop */}
      <div className="hidden lg:block relative py-6">
        {/* Continuous horizontal connection line */}
        <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-border-strong -translate-y-1/2 z-0">
          {/* Animated pulsing travelling dots */}
          <div className="absolute inset-0 flex justify-between items-center overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-accent animate-ping opacity-60 ml-12" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-24" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-36" />
          </div>
        </div>

        {/* Six Stage Nodes Grid */}
        <div className="grid grid-cols-6 gap-2 relative z-10">
          {stages.map((stage, idx) => {
            const isHovered = activeNode === idx;

            return (
              <div
                key={stage.id}
                onMouseEnter={() => setActiveNode(idx)}
                onMouseLeave={() => setActiveNode(null)}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                {/* Node Ring */}
                <div
                  className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-200 bg-surface-elevated shadow-1 ${
                    isHovered
                      ? 'border-accent scale-110 shadow-2 bg-accent-tint/30'
                      : 'border-primary group-hover:border-primary-hover'
                  }`}
                >
                  <span className="font-display text-sm font-semibold text-ink tnum">
                    {stage.count}
                  </span>
                </div>

                {/* Stage Title */}
                <div className="mt-3 font-sans font-semibold text-xs text-ink group-hover:text-primary transition-colors">
                  {stage.name}
                </div>

                {/* Runtime Chip */}
                <div className="mt-1.5 px-2 py-0.5 rounded-xs text-[10px] font-mono font-medium bg-surface-sunken border border-border text-text-secondary">
                  {stage.runtime}
                </div>

                {/* Funnel delta label */}
                {stage.deltaLabel && (
                  <div className="mt-2 text-[10px] text-text-muted leading-tight">
                    {stage.deltaLabel}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical Signal Path for Mobile / Tablet */}
      <div className="lg:hidden space-y-4 py-2">
        {stages.map((stage, idx) => (
          <div
            key={stage.id}
            onClick={() => setActiveNode(activeNode === idx ? null : idx)}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
              activeNode === idx ? 'border-primary bg-primary-tint/20' : 'border-border bg-surface-elevated'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center font-display font-semibold text-xs text-ink bg-surface">
                  {stage.count}
                </div>
                <div>
                  <div className="font-semibold text-xs text-ink">{stage.name}</div>
                  <div className="text-[10px] text-text-muted">{stage.deltaLabel}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-surface-sunken border border-border text-text-secondary">
                {stage.runtime}
              </span>
            </div>

            {activeNode === idx && (
              <div className="mt-3 pt-3 border-t border-border text-xs space-y-2 text-text-secondary">
                <div><strong className="text-ink">Execution:</strong> {stage.whatItDoes}</div>
                <div><strong className="text-ink">Storage:</strong> {stage.whatItStores}</div>
                <div><strong className="text-ink">Resilience:</strong> {stage.whatCanGoWrong}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Popover Card for Focused Node on Desktop */}
      {activeNode !== null && (
        <div className="hidden lg:block mt-6 p-4 rounded-lg bg-surface-elevated border border-border-strong shadow-2 animate-in fade-in-50">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-ink">
                Stage {activeNode + 1}: {stages[activeNode].name}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-primary-tint text-primary font-medium">
                {stages[activeNode].runtime}
              </span>
            </div>
            <span className="text-[11px] text-text-muted">
              Count: <strong className="text-ink font-mono">{stages[activeNode].count} prospects</strong>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">
                What this stage does
              </div>
              <p className="text-text-secondary leading-relaxed">
                {stages[activeNode].whatItDoes}
              </p>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1">
                What is persisted in SQLite
              </div>
              <p className="text-text-secondary leading-relaxed font-mono text-[11px]">
                {stages[activeNode].whatItStores}
              </p>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-1">
                Failure handling (Defensive)
              </div>
              <p className="text-text-secondary leading-relaxed">
                {stages[activeNode].whatCanGoWrong}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
