import React, { useState } from 'react';
import { Download, ChevronRight, ChevronDown, Shield, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SourceItem } from '../types';
import { Button } from '../components/ui/Button';

export const Sources: React.FC = () => {
  const { sources } = useAppStore();

  const [costFilter, setCostFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'Low' | 'Medium' | 'High'>('all');
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  const filteredSources = sources.filter(s => {
    if (costFilter === 'free' && s.recurringCost !== '$0' && !s.recurringCost.includes('$0')) return false;
    if (costFilter === 'paid' && s.recurringCost === '$0') return false;
    if (riskFilter !== 'all' && s.risk !== riskFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Used For', 'Access Credentials', 'Terms & Limits', 'Recurring Cost', 'Risk', 'Fallback', 'Credential Owner'];
    const rows = filteredSources.map(s => [
      s.id,
      `"${s.name}"`,
      s.usedFor,
      `"${s.accessCredentials}"`,
      `"${s.termsAndLimits}"`,
      `"${s.recurringCost}"`,
      s.risk,
      `"${s.fallback}"`,
      s.credentialOwner
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'source-feasibility-matrix.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-normal text-ink tracking-tight">Source Feasibility Matrix</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Planned data sources, terms, limits, and fallback strategies · To be empirically verified in Milestone 1
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={handleExportCSV}>
          <Download className="w-3.5 h-3.5 mr-1" /> Export Matrix (CSV)
        </Button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-md border border-border">
            <span className="text-[11px] text-text-muted px-1.5 font-medium">Cost:</span>
            {(['all', 'free', 'paid'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCostFilter(c)}
                className={`px-2.5 py-1 rounded-xs font-medium cursor-pointer capitalize ${
                  costFilter === c ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
                }`}
              >
                {c === 'all' ? 'All' : c === 'free' ? 'Free ($0)' : 'Paid / Needs Approval'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-md border border-border">
            <span className="text-[11px] text-text-muted px-1.5 font-medium">Risk:</span>
            {(['all', 'Low', 'Medium', 'High'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1 rounded-xs font-medium cursor-pointer capitalize ${
                  riskFilter === r ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <span className="font-mono text-text-muted text-[11px]">
          Showing {filteredSources.length} of {sources.length} sources
        </span>
      </div>

      {/* Feasibility Matrix Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-sunken border-b border-border text-[11px] font-semibold text-text-secondary uppercase">
              <th className="py-3 px-4">Source Name</th>
              <th className="py-3 px-3">Used For</th>
              <th className="py-3 px-3">Access / Credentials</th>
              <th className="py-3 px-3">Terms & Limits</th>
              <th className="py-3 px-3">Recurring Cost</th>
              <th className="py-3 px-3">Risk Level</th>
              <th className="py-3 px-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredSources.map(s => {
              const isExpanded = expandedSourceId === s.id;

              return (
                <React.Fragment key={s.id}>
                  <tr
                    onClick={() => setExpandedSourceId(isExpanded ? null : s.id)}
                    className="hover:bg-surface-sunken/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-ink flex items-center gap-2">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-text-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-text-muted" />}
                      <span>{s.name}</span>
                    </td>
                    <td className="py-3 px-3 font-sans text-text-secondary">{s.usedFor}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-text-muted">{s.accessCredentials}</td>
                    <td className="py-3 px-3 text-text-secondary max-w-xs truncate">{s.termsAndLimits}</td>
                    <td className="py-3 px-3 font-mono text-ink font-medium">{s.recurringCost}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-xs font-semibold text-[10px] ${
                        s.risk === 'Low'
                          ? 'bg-success-tint text-success'
                          : s.risk === 'Medium'
                          ? 'bg-warning-tint text-warning'
                          : 'bg-error-tint text-error font-bold'
                      }`}>
                        {s.risk.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-primary font-medium">
                      {isExpanded ? 'Hide' : 'Expand'}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-surface-sunken/50">
                      <td colSpan={7} className="p-4 space-y-3 border-b border-border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                          <div>
                            <div className="font-semibold text-text-secondary uppercase tracking-wider text-[11px] mb-1">
                              Fallback Strategy
                            </div>
                            <p className="text-ink">{s.fallback}</p>
                          </div>
                          <div>
                            <div className="font-semibold text-text-secondary uppercase tracking-wider text-[11px] mb-1">
                              Credential Custody
                            </div>
                            <p className="text-ink">
                              {s.credentialOwner === 'Owner'
                                ? 'Provided by Owner in protected runtime config'
                                : 'No developer secrets required'}
                            </p>
                          </div>
                          <div>
                            <div className="font-semibold text-text-secondary uppercase tracking-wider text-[11px] mb-1">
                              Technical Constraints
                            </div>
                            <p className="text-text-secondary leading-relaxed">{s.notes}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
