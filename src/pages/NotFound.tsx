import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const NotFound: React.FC = () => {
  const session = useAppStore(state => state.session);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 animate-fadeIn">
      {/* Flatline waveform SVG */}
      <div className="w-48 h-12 mb-6 text-[var(--text-muted)] opacity-60">
        <svg viewBox="0 0 200 40" className="w-full h-full stroke-current fill-none stroke-[1.5]">
          <path d="M 0 20 L 70 20 L 75 14 L 80 26 L 85 20 L 200 20" strokeLinecap="round" />
        </svg>
      </div>

      <div className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2 font-medium">
        Error 404 · Signal Lost
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-normal text-[var(--ink)] mb-3">
        That page isn't in the evidence.
      </h1>

      <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-8 leading-relaxed">
        Check the address, or navigate back to the command overview to review qualified prospects.
      </p>

      <div className="flex items-center gap-3">
        {session.authenticated ? (
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-[var(--shadow-1)]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Overview</span>
          </Link>
        ) : (
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors shadow-[var(--shadow-1)]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Cover</span>
          </Link>
        )}
      </div>
    </div>
  );
};
