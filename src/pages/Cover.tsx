import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav } from '../components/marketing/Nav';
import { SignalPath } from '../components/marketing/SignalPath';
import { StoryScroll } from '../components/marketing/StoryScroll';
import { ScoringExplorer } from '../components/marketing/ScoringExplorer';
import { SafeguardsGrid } from '../components/marketing/SafeguardsGrid';
import { ArchitectureDiagram } from '../components/marketing/ArchitectureDiagram';
import { MilestoneTimeline } from '../components/marketing/MilestoneTimeline';
import { ClosingFooter } from '../components/marketing/ClosingFooter';
import { Loader } from '../components/marketing/Loader';
import { Button } from '../components/ui/Button';

export const Cover: React.FC = () => {
  const [loadingFinished, setLoadingFinished] = useState(false);
  const navigate = useNavigate();

  const handleScrollToScoring = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#scoring')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans selection:bg-accent-tint selection:text-ink">
      {/* Intro Waveform Drawing Animation */}
      {!loadingFinished && (
        <Loader onComplete={() => setLoadingFinished(true)} />
      )}

      {/* Global Sticky Navigation */}
      <Nav />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-border overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left 5 cols: Value Proposition */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-surface-sunken border border-border text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Asian Labels · Sync · Independent Artists</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] leading-[1.08] text-ink font-normal tracking-tight">
                Prospecting that shows its evidence.
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-[50ch] font-sans">
                A private, local-first system that finds Asian labels, sync houses and independent artists, scores each one against your criteria, and contacts only those that pass every gate — once.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/app')}
                  className="font-medium"
                >
                  Open the console →
                </Button>

                <button
                  type="button"
                  onClick={handleScrollToScoring}
                  className="text-xs font-sans font-medium text-text-secondary hover:text-ink px-4 py-3 rounded-md transition-colors cursor-pointer border border-border bg-surface hover:bg-surface-sunken"
                >
                  See how a prospect is scored
                </button>
              </div>

              {/* Trust Subline */}
              <div className="pt-2 border-t border-border/80 flex items-center gap-2 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span>Runs on your Ubuntu server · Local models first · Cloud review only for bounded shortlist</span>
              </div>
            </div>

            {/* Right 7 cols: Interactive Signal Path Visual */}
            <div className="lg:col-span-7">
              <SignalPath />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Six Stages, One Rule */}
      <StoryScroll />

      {/* Section 3: Scoring you can audit */}
      <ScoringExplorer />

      {/* Section 4: Safeguards */}
      <SafeguardsGrid />

      {/* Section 5: Runs on your server (Architecture) */}
      <ArchitectureDiagram />

      {/* Section 6: Milestones */}
      <MilestoneTimeline />

      {/* Closing Section & Proposal Footer */}
      <ClosingFooter />
    </div>
  );
};
