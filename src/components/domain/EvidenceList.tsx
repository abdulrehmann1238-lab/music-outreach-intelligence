import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Globe, Newspaper, Disc3, Users, Music2, Mail, Video, Share2 } from 'lucide-react';
import { Evidence } from '../../types';

interface EvidenceListProps {
  evidence: Evidence[];
  highlightedEvidenceIds?: string[];
  onHoverEvidence?: (id: string) => void;
  onLeaveEvidence?: () => void;
}

export const EvidenceList: React.FC<EvidenceListProps> = ({
  evidence,
  highlightedEvidenceIds = [],
  onHoverEvidence,
  onLeaveEvidence
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'activity' | 'contact' | 'press'>('all');
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleTranslation = (id: string) => {
    setShowTranslations(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvidence = evidence.filter(ev => {
    if (filter === 'activity') return ev.type === 'release' || ev.type === 'social_post';
    if (filter === 'contact') return ev.type === 'contact';
    if (filter === 'press') return ev.type === 'press';
    return true;
  });

  const getSourceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'website': return Globe;
      case 'press': return Newspaper;
      case 'release': return Disc3;
      case 'roster': return Users;
      case 'streaming': return Music2;
      case 'contact': return Mail;
      case 'video': return Video;
      case 'social_post': return Share2;
      default: return Globe;
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
        <div>
          <h3 className="font-sans font-semibold text-sm text-ink">Preserved Evidence Repository</h3>
          <p className="text-xs text-text-muted mt-0.5">Traceable citations verified with timestamps & URLs</p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'activity', 'contact', 'press'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`text-xs px-2.5 py-1 rounded-xs transition-colors cursor-pointer capitalize font-sans ${
                filter === tab
                  ? 'bg-primary-tint text-primary font-medium border border-primary/30'
                  : 'bg-surface-sunken text-text-secondary hover:text-ink border border-border'
              }`}
            >
              {tab === 'all' ? `All (${evidence.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {filteredEvidence.length === 0 ? (
        <div className="py-8 text-center text-xs text-text-muted">
          No evidence records match the selected category.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvidence.map(item => {
            const Icon = getSourceIcon(item.type);
            const isHighlighted = highlightedEvidenceIds.includes(item.id);
            const isTranslating = showTranslations[item.id];

            return (
              <div
                key={item.id}
                onMouseEnter={() => onHoverEvidence?.(item.id)}
                onMouseLeave={() => onLeaveEvidence?.()}
                className={`p-3.5 rounded-md border transition-all duration-150 ${
                  isHighlighted
                    ? 'border-primary bg-primary-tint/30 shadow-1'
                    : 'border-border bg-surface-elevated hover:border-border-strong'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-xs bg-surface-sunken text-text-secondary">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-mono text-xs font-semibold text-primary">{item.id}</span>
                    <span className="text-xs font-medium text-ink">{item.title}</span>
                  </div>

                  <span
                    className={`text-[10px] font-sans px-1.5 py-0.5 rounded-xs border font-medium ${
                      item.parseStatus === 'ok'
                        ? 'bg-success-tint text-success border-success/30'
                        : item.parseStatus === 'partial'
                        ? 'bg-warning-tint text-warning border-warning/30'
                        : 'bg-error-tint text-error border-error/30'
                    }`}
                  >
                    Parse: {item.parseStatus.toUpperCase()}
                  </span>
                </div>

                {/* URL and metadata line */}
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-text-muted flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 truncate max-w-sm">
                    <span className="truncate">{item.url}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.id, item.url)}
                      className="p-0.5 hover:text-ink cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-text-muted">
                    <span>Retrieved: {item.retrievedAt}</span>
                    <span>Activity Date: {item.activityDate}</span>
                  </div>
                </div>

                {/* Snippet */}
                <div className="mt-2.5 p-2 rounded-xs bg-surface-sunken text-xs text-text-secondary leading-relaxed font-sans">
                  {item.isOriginal && item.translation ? (
                    <div>
                      <div className="flex items-center justify-between mb-1 pb-1 border-b border-border text-[10px]">
                        <span className="text-text-muted">
                          {isTranslating ? 'Original text (Japanese/CJK)' : 'Local model translated view'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleTranslation(item.id)}
                          className="text-primary hover:underline font-medium cursor-pointer"
                        >
                          {isTranslating ? 'Show translation' : 'Show original text'}
                        </button>
                      </div>
                      <p>{isTranslating ? item.originalText : item.translation}</p>
                    </div>
                  ) : (
                    <p>{item.snippet}</p>
                  )}
                </div>

                {/* Supports tags */}
                {item.supports.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-text-muted">Supports:</span>
                    {item.supports.map((dim, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium text-text-secondary bg-surface-sunken px-1.5 py-0.5 rounded-xs border border-border"
                      >
                        {dim}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
