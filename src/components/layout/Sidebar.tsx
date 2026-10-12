import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users2,
  ClipboardCheck,
  Send,
  CalendarClock,
  ShieldBan,
  Network,
  Settings2,
  Server,
  FileCheck2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { demoClock, settings } = useAppStore();

  const navGroups = [
    {
      label: 'Workspace',
      items: [
        { label: 'Overview', to: '/app', icon: LayoutDashboard },
        { label: 'Review', to: '/app/review', icon: ClipboardCheck },
        { label: 'Companies', to: '/app/companies', icon: Building2 },
        { label: 'Artists', to: '/app/artists', icon: Users2 },
        { label: 'Outreach', to: '/app/outreach', icon: Send },
      ]
    },
    {
      label: 'Operations',
      items: [
        { label: 'Jobs & Schedule', to: '/app/jobs', icon: CalendarClock },
        { label: 'Suppression', to: '/app/suppression', icon: ShieldBan },
        { label: 'Sources', to: '/app/sources', icon: Network },
      ]
    },
    {
      label: 'Control',
      items: [
        { label: 'Settings', to: '/app/settings', icon: Settings2 },
        { label: 'System', to: '/app/system', icon: Server },
      ]
    },
    {
      label: 'Project',
      items: [
        { label: 'Delivery Plan', to: '/app/plan', icon: FileCheck2 },
      ]
    }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-surface border-r border-border shrink-0 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-[232px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center px-4 border-b border-border gap-2.5">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          {/* Logo mark */}
          <div className="w-6 h-6 rounded-xs bg-ink flex items-center justify-center shrink-0 shadow-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-bg" fill="none">
              <path d="M3 12h3l2-3 2 6 2-4 2 2 2-1h5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="6" y="6" width="2" height="12" rx="1" fill="currentColor" />
              <rect x="10" y="6" width="5" height="2" rx="1" fill="currentColor" />
              <rect x="10" y="16" width="5" height="2" rx="1" fill="currentColor" />
            </svg>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-medium text-[16px] text-ink leading-tight tracking-tight">
                Cadence Desk
              </span>
              <span className="text-[10px] text-text-muted font-sans font-medium uppercase tracking-wider">
                Single-Owner Intelligence
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            {!collapsed && (
              <div className="px-2.5 py-1 text-[11px] font-sans font-semibold text-text-muted uppercase tracking-wider">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/app'}
                  className={({ isActive }) => `
                    flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-sans font-medium transition-colors select-none
                    ${
                      isActive
                        ? 'bg-primary-tint text-primary font-semibold border-l-2 border-primary shadow-1'
                        : 'text-text-secondary hover:text-ink hover:bg-surface-sunken'
                    }
                    ${collapsed ? 'justify-center px-0' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-border bg-surface-sunken/40 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-primary text-bg font-sans text-xs font-semibold flex items-center justify-center shrink-0">
          O
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink truncate">Owner</span>
              <span className="w-2 h-2 rounded-full bg-success" title="Local node active" />
            </div>
            <div className="text-[10px] text-text-muted truncate">
              Ubuntu · {demoClock.split(', ')[1] || '14:12'}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
