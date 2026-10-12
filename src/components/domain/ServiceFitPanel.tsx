import React, { useState } from 'react';
import { ServiceFitScore } from '../../types';
import { NeedTypeChip } from '../ui/StatusBadge';

interface ServiceFitPanelProps {
  services: Record<'production' | 'songwriting' | 'mixing' | 'mastering', ServiceFitScore>;
}

export const ServiceFitPanel: React.FC<ServiceFitPanelProps> = ({ services }) => {
  const [activeTab, setActiveTab] = useState<'production' | 'mixing' | 'mastering' | 'songwriting'>('production');

  const currentService = services[activeTab];

  const tabs = [
    { key: 'production', label: 'Production', score: services.production.score, type: services.production.type },
    { key: 'mixing', label: 'Mixing', score: services.mixing.score, type: services.mixing.type },
    { key: 'mastering', label: 'Mastering', score: services.mastering.score, type: services.mastering.type },
    { key: 'songwriting', label: 'Songwriting', score: services.songwriting.score, type: services.songwriting.type },
  ] as const;

  return (
    <div className="bg-surface rounded-lg border border-border p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
        <div>
          <h3 className="font-sans font-semibold text-sm text-ink">Service-Fit Assessment</h3>
          <p className="text-xs text-text-muted mt-0.5">Four independent evaluations with explicit-vs-inferred uncertainty gating</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-md border border-border flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-sans font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-surface-elevated text-ink shadow-1 border border-border-strong font-semibold'
                  : 'text-text-secondary hover:text-ink'
              }`}
            >
              <span>{tab.label}</span>
              <span className="font-mono text-[11px] tnum px-1 py-0.2 rounded-xs bg-surface-sunken">
                {tab.score}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  tab.type === 'explicit' ? 'bg-success' : 'bg-info'
                }`}
                title={tab.type === 'explicit' ? 'Explicit need statement' : 'Hypothesis (inferred)'}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Selected Service Content */}
      <div className="bg-surface-elevated rounded-md border border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-normal text-ink tnum">
              {currentService.score}
            </span>
            <div>
              <div className="text-xs font-semibold text-ink capitalize">
                {currentService.service} Fit Score
              </div>
              <div className="mt-0.5">
                <NeedTypeChip type={currentService.type} />
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-text-muted">
            Status: <span className="font-medium text-ink">{currentService.score >= 75 ? 'Strong Fit' : 'Marginal/Review'}</span>
          </div>
        </div>

        {/* Basis summary */}
        <div className="p-3 rounded-md bg-surface-sunken border border-border">
          <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Audit Basis
          </div>
          <p className="text-xs text-ink leading-relaxed">
            "{currentService.basis}"
          </p>
        </div>

        {/* 3-Column Inspection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-md bg-surface border border-border">
            <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">
              What We Saw
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {currentService.whatWeSaw}
            </p>
          </div>

          <div className="p-3 rounded-md bg-surface border border-border">
            <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
              Why It Might Matter
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {currentService.whyItMatters}
            </p>
          </div>

          <div className="p-3 rounded-md bg-surface border border-border">
            <div className="text-[11px] font-semibold text-warning uppercase tracking-wider mb-1">
              What We Don't Know
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {currentService.whatWeDontKnow}
            </p>
          </div>
        </div>

        {/* Mandatory Honesty Caption */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <span>Inferred need is a hypothesis. It does not imply willingness or ability to pay.</span>
          <span className="font-mono text-text-muted">Service Fit Engine · M3 Specification</span>
        </div>
      </div>
    </div>
  );
};
