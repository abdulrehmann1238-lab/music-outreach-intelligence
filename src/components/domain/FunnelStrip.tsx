import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FunnelStripProps {
  rawCount?: number;
  uniqueCount?: number;
  qualifiedCount?: number;
  shortlistedCount?: number;
  approvedCount?: number;
  contactedCount?: number;
}

export const FunnelStrip: React.FC<FunnelStripProps> = ({
  rawCount = 61,
  uniqueCount = 46,
  qualifiedCount = 22,
  shortlistedCount = 9,
  approvedCount = 2,
  contactedCount = 1
}) => {
  const navigate = useNavigate();

  const stages = [
    { label: 'Raw Discoveries', count: rawCount, note: '61 crawled in 30 days', color: 'bg-secondary', filter: 'all' },
    { label: 'Unique Prospects', count: uniqueCount, note: '−15 duplicates merged', color: 'bg-secondary', filter: 'all' },
    { label: 'Locally Qualified', count: qualifiedCount, note: 'Score ≥ 75, all gates ✓', color: 'bg-primary', filter: 'qualified' },
    { label: 'Shortlisted', count: shortlistedCount, note: 'Eligible for cloud gate', color: 'bg-primary', filter: 'shortlisted' },
    { label: 'Cloud Approved', count: approvedCount, note: 'Reviewed & verified', color: 'bg-success', filter: 'approved' },
    { label: 'Contacted', count: contactedCount, note: '1 manual send (1 reply)', color: 'bg-accent', filter: 'replied' },
  ];

  return (
    <div className="bg-surface rounded-lg border border-border p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-sans font-semibold text-sm text-ink">Outreach Funnel (Last 30 Days)</h3>
          <p className="text-xs text-text-muted mt-0.5">Strict qualification funnel: high precision over volume</p>
        </div>
        <div className="text-xs font-mono text-text-muted">
          Reconciliation: 61 → 46 → 22 → 9 → 2 → 1
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage, idx) => {
          const widthPercent = Math.max(10, Math.round((stage.count / rawCount) * 100));

          return (
            <div
              key={idx}
              onClick={() => {
                if (stage.filter === 'all') navigate('/app/companies');
                else navigate(`/app/companies?status=${stage.filter}`);
              }}
              className="p-3 rounded-md bg-surface-elevated border border-border hover:border-border-strong hover:bg-surface-sunken/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-sans text-text-muted font-medium mb-1 truncate">
                  {stage.label}
                </div>
                <div className="font-display text-2xl font-normal text-ink tnum group-hover:text-primary transition-colors">
                  {stage.count}
                </div>
              </div>

              <div className="mt-3">
                <div className="h-1.5 w-full bg-surface-sunken rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-text-muted mt-1.5 truncate">
                  {stage.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
