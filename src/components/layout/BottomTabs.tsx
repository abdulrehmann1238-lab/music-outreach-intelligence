import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, Building2, Users2, Send, MoreHorizontal } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

export const BottomTabs: React.FC = () => {
  const [moreOpen, setMoreOpen] = useState(false);

  const mainTabs = [
    { label: 'Overview', to: '/app', icon: LayoutDashboard },
    { label: 'Review', to: '/app/review', icon: ClipboardCheck },
    { label: 'Companies', to: '/app/companies', icon: Building2 },
    { label: 'Artists', to: '/app/artists', icon: Users2 },
    { label: 'Outreach', to: '/app/outreach', icon: Send },
  ];

  const moreItems = [
    { label: 'Jobs & Schedule', to: '/app/jobs' },
    { label: 'Suppression & Dedup', to: '/app/suppression' },
    { label: 'Source Feasibility Matrix', to: '/app/sources' },
    { label: 'Settings', to: '/app/settings' },
    { label: 'System Health & Backups', to: '/app/system' },
    { label: 'Delivery Plan (M1–M6)', to: '/app/plan' },
    { label: 'Public Cover Tour', to: '/' }
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface border-t border-border flex items-center justify-around z-nav px-2">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/app'}
              className={({ isActive }) => `
                flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-sans font-medium transition-colors
                ${isActive ? 'text-primary font-semibold' : 'text-text-muted hover:text-ink'}
              `}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-sans font-medium text-text-muted hover:text-ink"
        >
          <MoreHorizontal className="w-4 h-4 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* More Sheet */}
      <Drawer
        isOpen={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="Navigation & Operations"
        description="Access operations and system configuration"
      >
        <div className="space-y-1 py-2">
          {moreItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMoreOpen(false)}
              className="flex items-center justify-between p-3 rounded-md text-sm font-sans font-medium text-ink hover:bg-surface-sunken"
            >
              <span>{item.label}</span>
              <span>→</span>
            </NavLink>
          ))}
        </div>
      </Drawer>
    </>
  );
};
