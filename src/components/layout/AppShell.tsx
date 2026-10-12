import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomTabs } from './BottomTabs';
import { CommandPalette } from '../domain/CommandPalette';
import { DemoControls } from '../domain/DemoControls';
import { ToastContainer } from '../ui/ToastContainer';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-bg text-ink font-sans antialiased">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />

          {/* Quiet console footer */}
          <footer className="mt-16 pt-6 pb-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-2">
            <div>
              Cadence Desk · <span className="font-mono">v0.12-preview</span> · Runs on Ubuntu 22.04 LTS (Local-First)
            </div>
            <div>
              Demo build · Simulated async backend · Fictional prospect data
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomTabs />

      {/* Global Overlays */}
      <CommandPalette />
      <DemoControls />
      <ToastContainer />
    </div>
  );
};
