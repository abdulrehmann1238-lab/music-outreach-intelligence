import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, Bell, ShieldAlert, Cpu, Radio, LogOut, Command, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    settings,
    activeRun,
    setCommandPaletteOpen,
    setDemoControlsOpen,
    logout
  } = useAppStore();

  const [bellOpen, setBellOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Derive breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumb = pathParts.length > 1
    ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1)
    : 'Overview';

  const isPaused = settings.safety.processingPaused;
  const isRunning = !!activeRun && !activeRun.isFinished;
  const liveSendArmed = settings.safety.liveSendArmed;
  const cloudEnabled = settings.safety.cloudReviewEnabled;

  const notifications = [
    { id: 1, title: 'Hoang Mirage replied to manual IG inquiry', time: '11 Oct 10:15', unread: true },
    { id: 2, title: 'Run run_20261012_1230_ar completed Partial (429 backoff)', time: '12 Oct 12:31', unread: true },
    { id: 3, title: '3 new records require review decision', time: '12 Oct 12:15', unread: false },
    { id: 4, title: 'Nightly backup verified in clean location', time: '11 Oct 03:10', unread: false }
  ];

  return (
    <header className="h-14 bg-surface border-b border-border px-4 flex items-center justify-between shrink-0 select-none z-nav">
      {/* Left: Breadcrumbs & Page indicator */}
      <div className="flex items-center gap-2 text-xs font-sans">
        <Link to="/app" className="text-text-muted hover:text-ink font-medium transition-colors">
          Cadence Desk
        </Link>
        <span className="text-text-muted">/</span>
        <span className="text-ink font-semibold">{breadcrumb}</span>
      </div>

      {/* Centre: Global Search Bar (Cmd+K) */}
      <div className="hidden sm:flex items-center flex-1 max-w-xs mx-6">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full h-8 px-2.5 rounded-md bg-surface-sunken hover:bg-border/60 border border-border text-text-muted hover:text-ink text-xs flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search or command...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border-strong rounded-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Operational Status Pills & Controls */}
      <div className="flex items-center gap-2">
        {/* Processing State Pill */}
        <div
          className={`px-2 py-1 rounded-xs text-[11px] font-sans font-medium flex items-center gap-1.5 border ${
            isPaused
              ? 'bg-warning-tint text-warning border-warning/30'
              : isRunning
              ? 'bg-primary-tint text-primary border-primary/30 animate-pulse'
              : 'bg-surface-sunken text-text-secondary border-border'
          }`}
          title={isPaused ? 'Processing is paused by operator' : isRunning ? 'Pipeline run active' : 'Scheduler idle'}
        >
          <Radio className="w-3 h-3" />
          <span>{isPaused ? 'Paused' : isRunning ? 'Running' : 'Idle'}</span>
        </div>

        {/* Live Send Pill */}
        <div
          className={`hidden xs:flex px-2 py-1 rounded-xs text-[11px] font-sans font-medium items-center gap-1.5 border ${
            liveSendArmed
              ? 'bg-accent-tint text-accent border-accent/40 font-semibold'
              : 'bg-surface-sunken text-text-muted border-border'
          }`}
          title={liveSendArmed ? 'Live sending is Armed (simulated)' : 'Live sending is OFF by default'}
        >
          <ShieldAlert className="w-3 h-3" />
          <span>Live send: {liveSendArmed ? 'Armed' : 'OFF'}</span>
        </div>

        {/* Cloud Review Pill */}
        <div
          className={`hidden md:flex px-2 py-1 rounded-xs text-[11px] font-sans font-medium items-center gap-1.5 border ${
            cloudEnabled
              ? 'bg-surface-sunken text-text-secondary border-border'
              : 'bg-error-tint text-error border-error/30'
          }`}
          title={cloudEnabled ? 'Cloud review client active (mock, capped)' : 'Cloud review disabled'}
        >
          <Cpu className="w-3 h-3" />
          <span>Cloud: {cloudEnabled ? 'Mock' : 'Off'}</span>
        </div>

        <div className="h-4 w-px bg-border mx-1" />

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setBellOpen(!bellOpen)}
            className="p-1.5 text-text-muted hover:text-ink hover:bg-surface-sunken rounded-md transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-elevated border border-border-strong rounded-lg shadow-3 p-3 z-popover animate-in fade-in-0 zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                <span className="text-xs font-semibold text-ink">Notifications</span>
                <span className="text-[10px] text-text-muted">4 alerts</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded-md hover:bg-surface-sunken text-xs transition-colors">
                    <div className="font-medium text-ink flex items-start gap-1.5">
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />}
                      <span>{n.title}</span>
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User / Settings dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-7 h-7 rounded-full bg-primary-tint text-primary text-xs font-semibold flex items-center justify-center hover:bg-primary hover:text-bg transition-colors cursor-pointer border border-primary/20"
            aria-label="User menu"
          >
            O
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-surface-elevated border border-border-strong rounded-lg shadow-3 p-1.5 z-popover text-xs font-sans animate-in fade-in-0 zoom-in-95">
              <div className="px-2.5 py-1.5 border-b border-border mb-1">
                <div className="font-semibold text-ink">Owner Account</div>
                <div className="text-[10px] text-text-muted">Tailscale Authenticated</div>
              </div>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  setCommandPaletteOpen(true);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-surface-sunken text-ink flex items-center gap-2 cursor-pointer"
              >
                <Command className="w-3.5 h-3.5 text-text-muted" />
                <span>Command Palette (⌘K)</span>
              </button>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  setDemoControlsOpen(true);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-surface-sunken text-ink flex items-center gap-2 cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-text-muted" />
                <span>Demo Controls Dock</span>
              </button>
              <div className="my-1 border-t border-border" />
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-error-tint text-error flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
