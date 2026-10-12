import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    prospects,
    settings,
    setProcessingPaused,
    setLiveSendArmed,
    startRun,
    resetDemoData,
    addToast
  } = useAppStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  // Search items:
  // 1. Pages
  const pages = [
    { title: 'Overview (Command Centre)', path: '/app', category: 'Navigation' },
    { title: 'Companies (Labels & Sync)', path: '/app/companies', category: 'Navigation' },
    { title: 'Artists (Talent & Services)', path: '/app/artists', category: 'Navigation' },
    { title: 'Review & Cloud Gate', path: '/app/review', category: 'Navigation' },
    { title: 'Outreach & History', path: '/app/outreach', category: 'Navigation' },
    { title: 'Jobs & 5-Slot Schedule', path: '/app/jobs', category: 'Navigation' },
    { title: 'Suppression & Dedup', path: '/app/suppression', category: 'Navigation' },
    { title: 'Source Feasibility Matrix', path: '/app/sources', category: 'Navigation' },
    { title: 'Settings (Weights & Safety)', path: '/app/settings', category: 'Navigation' },
    { title: 'System Health & Backups', path: '/app/system', category: 'Navigation' },
    { title: 'Delivery Plan (M1–M6 Gates)', path: '/app/plan', category: 'Navigation' },
    { title: 'Cover Tour (Public Landing)', path: '/', category: 'Navigation' },
  ];

  // 2. Actions
  const actions = [
    {
      title: settings.safety.processingPaused ? 'Resume all processing' : 'Pause all processing',
      action: () => {
        setProcessingPaused(!settings.safety.processingPaused);
        addToast({
          type: 'info',
          title: !settings.safety.processingPaused ? 'Processing Paused' : 'Processing Resumed',
          message: 'Scheduler state updated'
        });
      },
      category: 'Actions'
    },
    {
      title: 'Run dry run for Companies',
      action: () => {
        navigate('/app/jobs');
        startRun('companies', true);
      },
      category: 'Actions'
    },
    {
      title: 'Run dry run for Artists',
      action: () => {
        navigate('/app/jobs');
        startRun('artists', true);
      },
      category: 'Actions'
    },
    {
      title: 'Reset demo data to pristine state',
      action: () => resetDemoData(),
      category: 'Actions'
    }
  ];

  // 3. Prospects
  const matchingProspects = prospects
    .filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.city.toLowerCase().includes(query.toLowerCase()) ||
      p.genres.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
      (p.domain && p.domain.toLowerCase().includes(query.toLowerCase())) ||
      (p.handle && p.handle.toLowerCase().includes(query.toLowerCase()))
    )
    .slice(0, 5)
    .map(p => ({
      title: `${p.name} (${p.city}, ${p.countryCode} · Score ${p.score})`,
      path: p.type === 'artist' ? `/app/artists/${p.id}` : `/app/companies/${p.id}`,
      category: p.type === 'artist' ? 'Artists' : 'Companies'
    }));

  const matchingPages = pages.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
  const matchingActions = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  const allResults = [
    ...matchingPages.map(p => ({ ...p, isAction: false })),
    ...matchingActions.map(a => ({ ...a, isAction: true })),
    ...matchingProspects.map(p => ({ ...p, isAction: false }))
  ];

  const handleSelect = (index: number) => {
    const item = allResults[index];
    if (!item) return;
    setCommandPaletteOpen(false);
    if (item.isAction && 'action' in item) {
      (item as any).action();
    } else if ('path' in item) {
      navigate((item as any).path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((selectedIndex + 1) % Math.max(1, allResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((selectedIndex - 1 + allResults.length) % Math.max(1, allResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  return (
    <div className="fixed inset-0 z-modal flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-ink/40 transition-opacity duration-200"
        onClick={() => setCommandPaletteOpen(false)}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-xl bg-surface-elevated rounded-xl border border-border-strong shadow-3 overflow-hidden z-10 animate-in fade-in-0 zoom-in-95"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center px-4 py-3 border-b border-border gap-3 bg-surface">
          <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, page name, or prospect..."
            className="w-full bg-transparent text-sm text-ink placeholder-text-muted focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-surface-sunken border border-border-strong rounded-xs">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {allResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">
              No matching prospects, pages, or actions found.
            </div>
          ) : (
            allResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer transition-colors ${
                  idx === selectedIndex ? 'bg-primary-tint text-primary font-medium' : 'text-ink hover:bg-surface-sunken'
                }`}
              >
                <span>{item.title}</span>
                <span className="text-[10px] text-text-muted px-1.5 py-0.5 rounded-xs bg-surface-sunken border border-border">
                  {item.category}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-surface-sunken text-[11px] text-text-muted">
          <span>Navigation: <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd> to move, <kbd className="font-mono">Enter</kbd> to select</span>
          <span>Cadence Desk ⌘K</span>
        </div>
      </div>
    </div>
  );
};
