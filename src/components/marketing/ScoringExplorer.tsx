import React, { useState } from 'react';
import { ScoreBreakdown } from '../domain/ScoreBreakdown';
import { initialCompanies } from '../../data/seed/companies';
import { initialEvidence } from '../../data/seed/evidence';

export const ScoringExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'label' | 'sync' | 'artist'>('label');
  const [thresholdSlider, setThresholdSlider] = useState(78);
  const [unsupportedToggled, setUnsupportedToggled] = useState(false);

  // Sample hero record: Moonlit Harbor Records (co_0001)
  const heroRecord = initialCompanies[0];
  const heroEvidence = initialEvidence.filter(e => e.prospectId === 'co_0001');

  // Modified components if unsupported is toggled
  const displayedComponents = heroRecord.scoreComponents.map((c, i) => {
    if (i === 0 && unsupportedToggled) {
      return {
        ...c,
        isUnsupported: true,
        unsupportedNote: 'Struck through — unsupported claims earn 0 points'
      };
    }
    return c;
  });

  const totalScore = displayedComponents.reduce((acc, c) => {
    return acc + (c.isUnsupported ? 0 : Math.round(c.rawRatio * c.defaultWeight));
  }, 0);

  const getBandLabel = (val: number) => {
    if (val >= 85) return 'High priority band (85–100)';
    if (val >= 75) return 'Qualified band (75–84)';
    if (val >= 65) return 'Manual review band (65–74)';
    return 'Do not contact band (<65)';
  };

  return (
    <section id="scoring" className="py-20 border-b border-border bg-surface-sunken/30">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <div className="text-xs font-sans font-semibold text-accent uppercase tracking-wider mb-2">
            Mathematical Auditing
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal">
            Scoring you can audit.
          </h2>
          <p className="text-text-secondary text-base max-w-2xl mt-2 leading-relaxed">
            No black-box hallucinations. Every point is arithmetic, mapped to explicit retrieved evidence.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
          {(['label', 'sync', 'artist'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-xs font-sans font-medium transition-all cursor-pointer capitalize ${
                activeTab === tab
                  ? 'bg-surface-elevated text-primary font-semibold shadow-1 border border-border-strong'
                  : 'text-text-secondary hover:text-ink hover:bg-surface-sunken'
              }`}
            >
              {tab === 'label' ? 'Record Label Scorecard' : tab === 'sync' ? 'Sync / Licensing Scorecard' : 'Artist Scorecard'}
            </button>
          ))}
        </div>

        {/* 2-Column Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Scorecard Breakdown */}
          <div className="lg:col-span-7">
            <ScoreBreakdown
              score={totalScore}
              components={displayedComponents}
              onToggleUnsupported={() => setUnsupportedToggled(!unsupportedToggled)}
              unsupportedClaimToggled={unsupportedToggled}
            />
          </div>

          {/* Right: Linked Traceable Evidence */}
          <div className="lg:col-span-5 bg-surface rounded-lg border border-border p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h4 className="font-sans font-semibold text-sm text-ink">Linked Traceable Citations</h4>
                <p className="text-xs text-text-muted mt-0.5">Moonlit Harbor Records (Taipei, TW)</p>
              </div>
              <span className="font-mono text-xs text-primary font-semibold">6 Citations</span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {heroEvidence.map(ev => (
                <div key={ev.id} className="p-3 rounded-md bg-surface-elevated border border-border text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-primary font-semibold">{ev.id}</span>
                    <span className="text-[10px] text-text-muted">Activity: {ev.activityDate}</span>
                  </div>
                  <div className="font-medium text-ink">{ev.title}</div>
                  <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                    {ev.snippet}
                  </p>
                  <div className="text-[10px] text-text-muted truncate font-mono">
                    {ev.url}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Draggable Threshold Ruler */}
        <div className="mt-10 p-6 rounded-xl bg-surface border border-border space-y-4 shadow-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-sans font-semibold text-sm text-ink">Configurable Threshold Ruler (0–100)</h4>
              <p className="text-xs text-text-muted">Drag the marker to test classification bands</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-ink tnum">{thresholdSlider}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-xs bg-primary-tint text-primary border border-primary/30">
                {getBandLabel(thresholdSlider)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={thresholdSlider}
              onChange={(e) => setThresholdSlider(parseInt(e.target.value, 10))}
              className="w-full accent-primary cursor-pointer h-2 bg-surface-sunken rounded-lg"
              aria-label="Threshold marker slider"
            />

            {/* Bands representation */}
            <div className="grid grid-cols-4 text-center text-[11px] font-mono gap-1 pt-1">
              <div className="p-1 rounded-xs bg-error-tint text-error">
                &lt; 65 Do Not Contact
              </div>
              <div className="p-1 rounded-xs bg-warning-tint text-warning">
                65–74 Manual Review
              </div>
              <div className="p-1 rounded-xs bg-primary-tint text-primary">
                75–84 Qualified
              </div>
              <div className="p-1 rounded-xs bg-success-tint text-success font-semibold">
                85–100 High Priority
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Thresholds and weights are owner-configurable in Settings.</span>
            <span className="font-medium text-ink">Hard gates always beat scores.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
