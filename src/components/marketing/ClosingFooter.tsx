import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const ClosingFooter: React.FC = () => {
  const navigate = useNavigate();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim() || !formMsg.trim()) return;

    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('sent');
    }, 900);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ink text-bg pt-20 pb-12 select-none relative overflow-hidden">
      {/* Top waveform line fading out */}
      <svg
        className="absolute top-0 left-0 right-0 w-full h-8 opacity-15 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1200 40"
      >
        <path d="M 0 20 Q 300 0, 600 20 T 1200 20" stroke="var(--bg)" strokeWidth="1.5" fill="none" />
      </svg>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Call to action hero block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-border-strong/20">
          <div className="lg:col-span-7 space-y-6">
            <div className="w-8 h-1 bg-accent rounded-full" />
            <h2 className="font-display text-3xl sm:text-4xl text-bg font-normal max-w-lg leading-tight">
              Let's make Milestone 1 your first working proof.
            </h2>
            <p className="text-sm text-text-muted max-w-xl leading-relaxed">
              I'll connect to your existing local endpoint, retrieve one real Asian record label and one real independent artist, and show you every source, every citation, and every score.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="bg-bg text-ink hover:bg-surface-sunken font-sans font-medium text-xs px-5 py-2.5 rounded-md transition-colors cursor-pointer"
              >
                Open the console →
              </button>

              <button
                type="button"
                onClick={() => navigate('/app/plan')}
                className="border border-border-strong/40 text-bg hover:bg-surface-sunken/10 font-sans font-medium text-xs px-4 py-2.5 rounded-md transition-colors cursor-pointer"
              >
                Read the delivery plan
              </button>
            </div>
          </div>

          {/* Contact form (simulated) */}
          <div className="lg:col-span-5 bg-surface-elevated/5 border border-border-strong/20 p-6 rounded-xl space-y-4">
            <h3 className="font-sans font-semibold text-sm text-bg">
              Ask a question about the proposal
            </h3>

            {formStatus === 'sent' ? (
              <div className="p-4 rounded-md bg-success-tint/10 border border-success/30 text-xs text-success space-y-1">
                <div className="font-semibold">Message recorded</div>
                <div className="text-text-muted">Thanks — I will address your question in my direct reply.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Your name"
                    className="w-full p-2.5 rounded-md bg-ink border border-border-strong/30 text-bg placeholder-text-muted focus:outline-none focus:border-accent text-xs"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full p-2.5 rounded-md bg-ink border border-border-strong/30 text-bg placeholder-text-muted focus:outline-none focus:border-accent text-xs"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    placeholder="What would you like to ask about the architecture or gates?"
                    className="w-full p-2.5 rounded-md bg-ink border border-border-strong/30 text-bg placeholder-text-muted focus:outline-none focus:border-accent text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full bg-accent hover:bg-accent-hover text-bg font-sans font-medium p-2.5 rounded-md text-xs transition-colors cursor-pointer"
                >
                  {formStatus === 'sending' ? 'Recording inquiry...' : 'Send inquiry'}
                </button>
                <div className="text-[10px] text-text-muted text-center">
                  Demo form · All messages recorded in local test state
                </div>
              </form>
            )}
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs">
          <div>
            <div className="font-semibold text-bg mb-3 uppercase tracking-wider text-[11px]">Product</div>
            <div className="space-y-2 text-text-muted">
              <div><a href="#how-it-works" className="hover:text-bg">How it works</a></div>
              <div><a href="#scoring" className="hover:text-bg">Auditable scoring</a></div>
              <div><a href="#safeguards" className="hover:text-bg">Defensive safeguards</a></div>
              <div><a href="#architecture" className="hover:text-bg">Server architecture</a></div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-bg mb-3 uppercase tracking-wider text-[11px]">Console</div>
            <div className="space-y-2 text-text-muted">
              <div><Link to="/app" className="hover:text-bg">Overview Dashboard</Link></div>
              <div><Link to="/app/review" className="hover:text-bg">Review & Cloud Gate</Link></div>
              <div><Link to="/app/outreach" className="hover:text-bg">Outreach & Instagram</Link></div>
              <div><Link to="/app/jobs" className="hover:text-bg">Jobs & Scheduling</Link></div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-bg mb-3 uppercase tracking-wider text-[11px]">Project</div>
            <div className="space-y-2 text-text-muted">
              <div><Link to="/app/plan" className="hover:text-bg">Delivery Plan (M1–M6)</Link></div>
              <div><Link to="/app/sources" className="hover:text-bg">Source Feasibility Matrix</Link></div>
              <div><Link to="/app/system" className="hover:text-bg">Health & Proven Restore</Link></div>
              <div><Link to="/app/suppression" className="hover:text-bg">Suppression Store</Link></div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-bg mb-3 uppercase tracking-wider text-[11px]">Disclosure & Notes</div>
            <div className="space-y-2 text-[11px] text-text-muted leading-relaxed">
              <div>All prospects, domains, and metrics in this demo are fictional.</div>
              <div className="text-bg/80 italic pt-1 border-t border-border-strong/20">
                "AI-assisted response: I used an AI system to help prepare this reply."
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 border-t border-border-strong/20 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <div>
            © 2026 · Built as a proposal interactive demonstration for the Music Outreach Intelligence System.
          </div>
          <button
            onClick={scrollToTop}
            className="text-text-muted hover:text-bg transition-colors cursor-pointer"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
