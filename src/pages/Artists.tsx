import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Search, Play, Eye } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Prospect } from '../types';
import { getMonogram } from '../lib/monogram';
import { StatusBadge, ConfidenceBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { exportProspectsAsCSV } from '../lib/export';

export const Artists: React.FC = () => {
  const navigate = useNavigate();
  const { prospects, startRun } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'production' | 'mixing' | 'mastering' | 'songwriting'>('all');
  const [needFilter, setNeedFilter] = useState<'all' | 'explicit' | 'hypothesis'>('all');
  const [selectedArtist, setSelectedArtist] = useState<Prospect | null>(null);

  const artistList = useMemo(() => {
    return prospects.filter(p => p.type === 'artist');
  }, [prospects]);

  const filteredArtists = useMemo(() => {
    return artistList.filter(a => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = a.name.toLowerCase().includes(q);
        const matchHandle = a.handle?.toLowerCase().includes(q);
        const matchCity = a.city.toLowerCase().includes(q);
        const matchGenre = a.genres.some(g => g.toLowerCase().includes(q));
        if (!matchName && !matchHandle && !matchCity && !matchGenre) return false;
      }

      if (marketFilter !== 'all' && a.countryCode !== marketFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;

      if (serviceFilter !== 'all' && a.serviceFit) {
        const serviceScore = a.serviceFit[serviceFilter]?.score || 0;
        if (serviceScore < 75) return false;
      }

      if (needFilter !== 'all' && a.serviceFit) {
        const hasExplicit = Object.values(a.serviceFit).some(s => s.type === 'explicit');
        if (needFilter === 'explicit' && !hasExplicit) return false;
        if (needFilter === 'hypothesis' && hasExplicit) return false;
      }

      return true;
    });
  }, [artistList, searchQuery, marketFilter, statusFilter, serviceFilter, needFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-normal text-ink tracking-tight">Artists</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {artistList.length} independent prospects · 4 service fits evaluated · Manual Instagram queue
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportProspectsAsCSV(filteredArtists, 'cadence-artists.csv')}
          >
            <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              navigate('/app/jobs');
              startRun('artists', true);
            }}
          >
            <Play className="w-3.5 h-3.5 mr-1" /> Dry Run Artists
          </Button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artist, handle, city..."
            className="w-full pl-9 pr-3 py-2 rounded-md bg-surface border border-border text-xs text-ink placeholder-text-muted focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <select
          value={marketFilter}
          onChange={(e) => setMarketFilter(e.target.value)}
          className="p-2 rounded-md bg-surface border border-border text-ink text-xs focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Markets</option>
          <option value="PH">Philippines (PH)</option>
          <option value="ID">Indonesia (ID)</option>
          <option value="VN">Vietnam (VN)</option>
          <option value="JP">Japan (JP)</option>
          <option value="KR">South Korea (KR)</option>
          <option value="TW">Taiwan (TW)</option>
          <option value="TH">Thailand (TH)</option>
          <option value="MY">Malaysia (MY)</option>
          <option value="SG">Singapore (SG)</option>
          <option value="HK">Hong Kong (HK)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded-md bg-surface border border-border text-ink text-xs focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Statuses</option>
          <option value="qualified">Qualified (75–84)</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="replied">Replied (1 received)</option>
          <option value="needs_review">Needs Review</option>
          <option value="held">Held (Identity/Activity)</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Service fit filter */}
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value as any)}
          className="p-2 rounded-md bg-surface border border-border text-ink text-xs focus:ring-2 focus:ring-primary font-medium"
        >
          <option value="all">Any Service Fit</option>
          <option value="production">Production (≥75 pts)</option>
          <option value="mixing">Mixing (≥75 pts)</option>
          <option value="mastering">Mastering (≥75 pts)</option>
          <option value="songwriting">Songwriting (≥75 pts)</option>
        </select>

        {/* Need type filter */}
        <select
          value={needFilter}
          onChange={(e) => setNeedFilter(e.target.value as any)}
          className="p-2 rounded-md bg-surface border border-border text-ink text-xs focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Need Evidence</option>
          <option value="explicit">Explicit Statement Only</option>
          <option value="hypothesis">Hypothesis (Inferred) Only</option>
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-surface rounded-xl border border-border overflow-hidden shadow-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-sunken border-b border-border text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              <th className="py-3 px-4">Artist & Handle</th>
              <th className="py-3 px-3">Market</th>
              <th className="py-3 px-3">Genre</th>
              <th className="py-3 px-3">Total Score</th>
              <th className="py-3 px-3">Service Mini-Bars (P · M · Ma · S)</th>
              <th className="py-3 px-3">Confidence</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Channel</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredArtists.map((a) => {
              const monogram = getMonogram(a.name);
              const pScore = a.serviceFit?.production.score || 50;
              const mScore = a.serviceFit?.mixing.score || 50;
              const maScore = a.serviceFit?.mastering.score || 50;
              const sScore = a.serviceFit?.songwriting.score || 50;

              return (
                <tr
                  key={a.id}
                  onClick={() => setSelectedArtist(a)}
                  className="hover:bg-surface-sunken/60 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] font-semibold shrink-0 border border-border-strong"
                        style={{ backgroundColor: monogram.bg, color: monogram.text }}
                      >
                        {monogram.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-ink group-hover:text-primary transition-colors truncate">
                          {a.name}
                        </div>
                        <div className="font-mono text-[11px] text-primary truncate">
                          {a.handle || '—'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-text-secondary">
                    {a.city}, <span className="font-mono">{a.countryCode}</span>
                  </td>

                  <td className="py-3 px-3 text-text-secondary">
                    {a.genres[0]}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono font-semibold text-ink tnum">
                      {a.score}
                    </span>
                  </td>

                  {/* 4 Service Mini-Bars (P, M, Ma, S) */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5" title="Production / Mixing / Mastering / Songwriting">
                      <span className="text-[10px] font-mono text-text-muted">P:</span>
                      <div className="w-8 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                        <div
                          className={`h-full ${a.serviceFit?.production.type === 'explicit' ? 'bg-success' : 'bg-info'}`}
                          style={{ width: `${pScore}%` }}
                        />
                      </div>

                      <span className="text-[10px] font-mono text-text-muted ml-1">M:</span>
                      <div className="w-8 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                        <div
                          className={`h-full ${a.serviceFit?.mixing.type === 'explicit' ? 'bg-success' : 'bg-info'}`}
                          style={{ width: `${mScore}%` }}
                        />
                      </div>

                      <span className="text-[10px] font-mono text-text-muted ml-1">Ma:</span>
                      <div className="w-8 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary"
                          style={{ width: `${maScore}%` }}
                        />
                      </div>

                      <span className="text-[10px] font-mono text-text-muted ml-1">S:</span>
                      <div className="w-8 h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                        <div
                          className="h-full bg-border-strong"
                          style={{ width: `${sScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <ConfidenceBadge confidence={a.evidenceConfidence} />
                  </td>

                  <td className="py-3 px-3">
                    <StatusBadge status={a.status} size="sm" />
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] text-text-secondary">
                      {a.channel === 'ig_manual' ? 'IG Manual' : a.channel === 'email' ? 'Email' : 'None'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/artists/${a.id}`);
                      }}
                      className="text-text-muted hover:text-primary p-1 rounded-sm cursor-pointer"
                      title="Inspect full 4-service assessment"
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

      {/* Mobile Card List */}
      <div className="md:hidden space-y-2">
        {filteredArtists.map((a) => {
          const monogram = getMonogram(a.name);

          return (
            <div
              key={a.id}
              onClick={() => setSelectedArtist(a)}
              className="p-3.5 rounded-lg bg-surface border border-border shadow-1 space-y-2 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-semibold"
                    style={{ backgroundColor: monogram.bg, color: monogram.text }}
                  >
                    {monogram.initials}
                  </div>
                  <div>
                    <div className="font-medium text-xs text-ink">{a.name}</div>
                    <div className="font-mono text-[10px] text-primary">{a.handle}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-ink tnum">{a.score}</span>
                  <span className="text-[10px] text-text-muted"> / 100</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border text-[11px] text-text-secondary">
                <span>{a.city}, {a.countryCode} · {a.genres[0]}</span>
                <StatusBadge status={a.status} size="sm" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Drawer */}
      <Drawer
        isOpen={!!selectedArtist}
        onClose={() => setSelectedArtist(null)}
        title={selectedArtist?.name || 'Artist Inspector'}
        description={`${selectedArtist?.city}, ${selectedArtist?.country} · ${selectedArtist?.handle}`}
      >
        {selectedArtist && (
          <div className="space-y-6 text-xs font-sans">
            <div className="p-4 rounded-xl bg-surface-sunken border border-border flex items-center justify-between">
              <div>
                <div className="text-[11px] text-text-muted font-medium">Fit Score</div>
                <div className="font-display text-3xl font-normal text-ink tnum">
                  {selectedArtist.score} <span className="text-xs text-text-muted font-sans font-normal">/ 100</span>
                </div>
              </div>
              <StatusBadge status={selectedArtist.status} />
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">
                Qualification Rationale
              </div>
              <p className="text-xs text-ink leading-relaxed p-3 bg-surface rounded-md border border-border">
                {selectedArtist.localModelRationale}
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                const id = selectedArtist.id;
                setSelectedArtist(null);
                navigate(`/app/artists/${id}`);
              }}
              className="w-full"
            >
              Open Complete 4-Service Assessment →
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};
