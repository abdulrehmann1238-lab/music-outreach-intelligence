import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'drawing' | 'resolved' | 'lifting' | 'done'>('drawing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if session has already seen the intro
    const seen = sessionStorage.getItem('cd_intro');
    if (seen === '1') {
      onComplete();
      return;
    }

    // Step progression
    const startTime = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, Math.round((elapsed / 800) * 100));
      setProgress(p);

      if (elapsed > 450 && phase === 'drawing') {
        setPhase('resolved');
      }

      if (elapsed >= 900) {
        clearInterval(progressTimer);
        setPhase('lifting');
        sessionStorage.setItem('cd_intro', '1');
        setTimeout(() => {
          setPhase('done');
          onComplete();
        }, 500);
      }
    }, 30);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        clearInterval(progressTimer);
        sessionStorage.setItem('cd_intro', '1');
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      clearInterval(progressTimer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onComplete, phase]);

  if (phase === 'done') return null;

  const handleSkip = () => {
    sessionStorage.setItem('cd_intro', '1');
    onComplete();
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-loader bg-bg flex flex-col items-center justify-center transition-all cursor-pointer ${
        phase === 'lifting' ? '-translate-y-full opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: '500ms', transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
      role="status"
      aria-label="Loading application"
    >
      <div className="flex flex-col items-center gap-6 max-w-sm w-full px-6">
        {/* Waveform Drawing SVG */}
        <div className="w-full flex items-center justify-center">
          <svg viewBox="0 0 400 60" className="w-full max-w-[340px] text-ink overflow-visible" fill="none">
            {/* The 1px waveform line */}
            <path
              d="M 10 30 L 70 30 L 95 12 L 120 48 L 145 18 L 170 42 L 195 24 L 220 36 L 245 30 L 390 30"
              stroke="var(--ink)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-700 ease-out"
              style={{
                strokeDasharray: 500,
                strokeDashoffset: Math.max(0, 500 - (progress * 5))
              }}
            />
          </svg>
        </div>

        {/* Brand Mark & Wordmark Fade-in */}
        <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${
          phase === 'resolved' || phase === 'lifting' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          {/* Cadence Desk Monogram Mark */}
          <div className="w-8 h-8 rounded-xs bg-ink flex items-center justify-center text-bg shadow-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-bg" fill="none">
              <path d="M2 12h4l2-3 2 6 2-4 2 2 2-1h6" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
              <rect x="6" y="6" width="2.5" height="12" rx="1" fill="currentColor" />
              <rect x="11" y="6" width="6" height="2.2" rx="1" fill="currentColor" />
              <rect x="11" y="15.8" width="6" height="2.2" rx="1" fill="currentColor" />
            </svg>
          </div>

          <div className="font-display text-2xl text-ink font-normal tracking-tight">
            Cadence Desk
          </div>
          <div className="text-[11px] font-sans text-text-muted tracking-widest uppercase">
            Local-First Music Outreach Intelligence
          </div>
        </div>

        {/* Progress hairline */}
        <div className="w-48 h-[1px] bg-border-strong rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-accent transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[10px] text-text-muted">
          Press Esc or click anywhere to skip
        </div>
      </div>
    </div>
  );
};
