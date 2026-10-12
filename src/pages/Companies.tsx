import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Search, Play, ArrowUpDown, Filter, Eye } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Prospect, ProspectStatus, EvidenceConfidence } from '../types';
import { getMonogram } from '../lib/monogram';
import { StatusBadge, ConfidenceBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { exportProspectsAsCSV, exportProspectsAsJSON } from '../lib/export';

export const Companies: React.FC = () => {
  const navigate = useNavigate();
  const { prospects, startRun } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'label' | 'sync'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'activity' | 'name'>('score');
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  // Filter only companies
  const companyList = useMemo(() => {
    return prospects.filter(p => p.type === 'label' || p.type === 'sync');
  }, [prospects]);

  const filteredCompanies = useMemo(() => {
    return companyList
      .filter(p => {
        if (activeTab === 'label' && p.type !== 'label') return false;
        if (activeTab === 'sync' && p.type !== 'sync') return false;

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          const matchDomain = p.domain?.toLowerCase().includes(q);
          const matchGenre = p.genres.some(g => g.toLowerCase().includes(q));
          if (!matchName && !matchCity && !matchDomain && !matchGenre) return false;
        }

        if (marketFilter !== 'all' && p.countryCode !== marketFilter) return false;
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        if (confidenceFilter !== 'all' && p.evidenceConfidence !== confidenceFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.score - a.score;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.lastActivityDate.localeCompare(a.lastActivityDate);
      });
  }, [companyList, activeTab, searchQuery, marketFilter, statusFilter, confidenceFilter, sortBy]);

  const labelsCount = companyList.filter(p => p.type === 'label').length;
  const syncCount = companyList.filter(p => p.type === 'sync').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-normal text-ink tracking-tight">Companies</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {companyList.length} prospects · {labelsCount} record labels · {syncCount} sync & licensing houses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportProspectsAsCSV(filteredCompanies, 'cadence-companies.csv')}
          >
            <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              navigate('/app/jobs');
              startRun('companies', true);
            }}
          >
            <Play className="w-3.5 h-3.5 mr-1" /> Dry Run Companies
          </Button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="space-y-3">
        {/* Segmented Filter */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-md border border-border">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'all' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
              }`}
            >
              All Companies ({companyList.length})
            </button>
            <button
              onClick={() => setActiveTab('label')}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'label' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
              }`}
            >
              Record Labels ({labelsCount})
            </button>
            <button
              onClick={() => setActiveTab('sync')}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
                activeTab === 'sync' ? 'bg-surface-elevated text-ink font-semibold shadow-1' : 'text-text-secondary hover:text-ink'
              }`}
            >
              Sync & Licensing ({syncCount})
            </button>
          </div>

          <div className="text-xs text-text-muted font-mono">
            Showing {filteredCompanies.length} of {companyList.length}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, city, genre..."
              className="w-full pl-9 pr-3 py-2 rounded-md bg-surface border border-border text-xs text-ink placeholder-text-muted focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Market filter */}
          <select
            value={marketFilter}
            onChange={(e) => setMarketFilter(e.target.value)}
            className="p-2 rounded-md bg-surface border border-border text-ink text-xs focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Markets</option>
            <option value="JP">Japan (JP)</option>
            <option value="KR">South Korea (KR)</option>
            <option value="TW">Taiwan (TW)</option>
            <option value="HK">Hong Kong (HK)</option>
            <option value="SG">Singapore (SG)</option>
            <option value="TH">Thailand (TH)</option>
            <option value="VN">Vietnam (VN)</option>
            <option value="MY">Malaysia (MY)</option>
            <option value="ID">Indonesia (ID)</option>
            <option value="PH">Philippines (PH)</option>
            <option value="CN">China (CN)</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-md bg-surface border border-border text-ink text-xs focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="qualified">Qualified (75–84)</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="approved">Approved</option>
            <option value="needs_review">Needs Review (65–74)</option>
            <option value="rejected">Rejected (&lt;65 / Gate fail)</option>
            <option value="suppressed">Suppressed</option>
          </select>

          {/* Confidence filter */}
          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value)}
            className="p-2 rounded-md bg-surface border border-border text-ink text-xs focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Confidence</option>
            <option value="high">High Confidence</option>
            <option value="medium">Medium Confidence</option>
            <option value="low">Low Confidence</option>
          </select>

          {/* Sort order */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 rounded-md bg-surface border border-border text-ink text-xs focus:ring-2 focus:ring-primary"
          >
            <option value="score">Sort: Highest Score ↓</option>
            <option value="activity">Sort: Recent Activity</option>
            <option value="name">Sort: Company Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-surface rounded-xl border border-border overflow-hidden shadow-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-sunken border-b border-border text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              <th className="py-3 px-4">Company & Domain</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Market</th>
              <th className="py-3 px-3">Primary Genres</th>
              <th className="py-3 px-3">Fit Score</th>
              <th className="py-3 px-3">Confidence</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Last Active</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCompanies.map((c) => {
              const monogram = getMonogram(c.name);

              return (
                <tr
                  key={c.id}
                  onClick={() => setSelectedProspect(c)}
                  className="hover:bg-surface-sunken/60 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-sm flex items-center justify-center font-mono text-[11px] font-semibold shrink-0 border border-border-strong"
                        style={{ backgroundColor: monogram.bg, color: monogram.text }}
                      >
                        {monogram.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-ink group-hover:text-primary transition-colors truncate">
                          {c.name}
                        </div>
                        <div className="font-mono text-[11px] text-text-muted truncate">
                          {c.domain}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="capitalize text-text-secondary">
                      {c.type === 'label' ? 'Label' : 'Sync'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-text-secondary">
                    {c.city}, <span className="font-mono">{c.countryCode}</span>
                  </td>

                  <td className="py-3 px-3 text-text-secondary">
                    {c.genres.slice(0, 2).join(', ')}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-ink tnum w-6">
                        {c.score}
                      </span>
                      <div className="w-16 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.score >= 85 ? 'bg-primary' : c.score >= 75 ? 'bg-secondary' : 'bg-warning'
                          }`}
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <ConfidenceBadge confidence={c.evidenceConfidence} />
                  </td>

                  <td className="py-3 px-3">
                    <StatusBadge status={c.status} size="sm" />
                  </td>

                  <td className="py-3 px-3 text-text-muted font-mono text-[11px]">
                    {c.lastActivityDate}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/companies/${c.id}`);
                      }}
                      className="text-text-muted hover:text-primary p-1 rounded-sm cursor-pointer"
                      title="Inspect full auditable record"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (<768) */}
      <div className="md:hidden space-y-2">
        {filteredCompanies.map((c) => {
          const monogram = getMonogram(c.name);

          return (
            <div
              key={c.id}
              onClick={() => setSelectedProspect(c)}
              className="p-3.5 rounded-lg bg-surface border border-border shadow-1 space-y-2 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-sm flex items-center justify-center font-mono text-[10px] font-semibold"
                    style={{ backgroundColor: monogram.bg, color: monogram.text }}
                  >
                    {monogram.initials}
                  </div>
                  <div>
                    <div className="font-medium text-xs text-ink">{c.name}</div>
                    <div className="font-mono text-[10px] text-text-muted">{c.domain}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-ink tnum">{c.score}</span>
                  <span className="text-[10px] text-text-muted"> / 100</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border text-[11px] text-text-secondary">
                <span>{c.city}, {c.countryCode} · {c.type}</span>
                <StatusBadge status={c.status} size="sm" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Drawer */}
      <Drawer
        isOpen={!!selectedProspect}
        onClose={() => setSelectedProspect(null)}
        title={selectedProspect?.name || 'Prospect Inspector'}
        description={`${selectedProspect?.city}, ${selectedProspect?.country} · ${selectedProspect?.type === 'label' ? 'Record Label' : 'Sync House'}`}
      >
        {selectedProspect && (
          <div className="space-y-6 text-xs font-sans">
            {/* Score & Status Summary Banner */}
            <div className="p-4 rounded-xl bg-surface-sunken border border-border flex items-center justify-between">
              <div>
                <div className="text-[11px] text-text-muted font-medium">Fit Score (Weighted)</div>
                <div className="font-display text-3xl font-normal text-ink tnum">
                  {selectedProspect.score} <span className="text-xs text-text-muted font-sans font-normal">/ 100</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <StatusBadge status={selectedProspect.status} />
                <div>
                  <ConfidenceBadge confidence={selectedProspect.evidenceConfidence} />
                </div>
              </div>
            </div>

            {/* Model Rationale */}
            <div className="space-y-1">
              <div className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">
                Local Model Evaluation
              </div>
              <p className="text-xs text-ink leading-relaxed p-3 bg-surface rounded-md border border-border">
                {selectedProspect.localModelRationale}
              </p>
            </div>

            {/* Hard Gates Summary */}
            <div className="space-y-2">
              <div className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">
                Hard Gates Verification
              </div>
              <div className="p-3 bg-surface rounded-md border border-border space-y-1.5 text-[11px]">
                {selectedProspect.gates.slice(0, 4).map(g => (
                  <div key={g.id} className="flex items-center justify-between">
                    <span className="text-text-secondary">{g.name}</span>
                    <span className={g.passed ? 'text-success font-semibold' : 'text-error font-bold'}>
                      {g.passed ? 'Passed ✓' : 'Failed ✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-border flex gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  const id = selectedProspect.id;
                  setSelectedProspect(null);
                  navigate(`/app/companies/${id}`);
                }}
                className="w-full"
              >
                Open Full Auditable Record →
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
