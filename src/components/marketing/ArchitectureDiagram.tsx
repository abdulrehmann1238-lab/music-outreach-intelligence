import React from 'react';
import { Server, Database, Cpu, Globe, Lock, Mail } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <section id="architecture" className="py-20 border-b border-border bg-surface-sunken/20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <div className="text-xs font-sans font-semibold text-accent uppercase tracking-wider mb-2">
            Infrastructure Reality
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-ink font-normal">
            Runs on your server.
          </h2>
          <p className="text-text-secondary text-base max-w-2xl mt-2 leading-relaxed">
            No SaaS markups. No multi-tenant cloud storage. A private, single-owner Python + SQLite system running on your existing Ubuntu 22.04 LTS box.
          </p>
        </div>

        {/* Architecture Layout Grid */}
        <div className="bg-surface rounded-2xl border-2 border-border-strong p-6 sm:p-10 shadow-2 space-y-8">
          {/* Main Ubuntu Container */}
          <div className="border-2 border-primary/40 bg-surface-elevated rounded-xl p-6 relative">
            <div className="absolute -top-3.5 left-6 bg-primary text-bg text-xs font-mono font-semibold px-3 py-1 rounded-sm shadow-1 flex items-center gap-2">
              <Server className="w-3.5 h-3.5" />
              <span>Your Ubuntu 22.04 Server (i5 · 64GB RAM · RTX 3090 24GB)</span>
            </div>

            <div className="text-xs text-text-muted mt-2 mb-6">
              Owner controls DNS, firewall, Tailscale, and TLS certificates. Listens strictly on localhost:8080.
            </div>

            {/* Internal 5 Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Block 1: Dashboard */}
              <div className="p-4 rounded-lg bg-surface border border-border shadow-1 hover:border-primary transition-all">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-1">
                  <Globe className="w-4 h-4" />
                  <span>Secure HTTPS UI</span>
                </div>
                <div className="text-[11px] text-text-secondary leading-relaxed">
                  Tailscale/reverse-proxy protected single-owner console.
                </div>
              </div>

              {/* Block 2: Python App */}
              <div className="p-4 rounded-lg bg-surface border border-border shadow-1 hover:border-primary transition-all">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-1">
                  <Server className="w-4 h-4" />
                  <span>Python App Spine</span>
                </div>
                <div className="text-[11px] text-text-secondary leading-relaxed">
                  6-stage pipeline daemon with graceful exception backoff.
                </div>
              </div>

              {/* Block 3: SQLite */}
              <div className="p-4 rounded-lg bg-surface border border-border shadow-1 hover:border-primary transition-all">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-1">
                  <Database className="w-4 h-4" />
                  <span>SQLite Database</span>
                </div>
                <div className="text-[11px] text-text-secondary leading-relaxed">
                  Local tables for prospects, evidence, runs, audit, and dedupe.
                </div>
              </div>

              {/* Block 4: Local Model */}
              <div className="p-4 rounded-lg bg-surface border border-border shadow-1 hover:border-primary transition-all">
                <div className="flex items-center gap-2 text-accent font-semibold text-xs mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>Local llama.cpp</span>
                </div>
                <div className="text-[11px] text-text-secondary leading-relaxed">
                  Existing Qwen-class endpoint called as-is (0 cloud tokens).
                </div>
              </div>

              {/* Block 5: Scheduler */}
              <div className="p-4 rounded-lg bg-surface border border-border shadow-1 hover:border-primary transition-all">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-1">
                  <Lock className="w-4 h-4" />
                  <span>5-Run Scheduler</span>
                </div>
                <div className="text-[11px] text-text-secondary leading-relaxed">
                  Autonomous runs with overlap locks and pause controls.
                </div>
              </div>
            </div>
          </div>

          {/* External Controlled Connectors */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              External Managed Endpoints (Explicit & Capped)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-dashed border-border-strong bg-surface/60 flex items-start gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-ink">Gmail API (Owner OAuth)</div>
                  <div className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    Least-privilege tokens stored in runtime config. Dry-run previews and live dispatch only when armed.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-border-strong bg-surface/60 flex items-start gap-3">
                <Cpu className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-ink">Cloud Model (Final Review Gate)</div>
                  <div className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    Called only for bounded shortlists (12 max/run, 150/month). Key arrives at M4 via protected runtime config.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-border-strong bg-surface/60 flex items-start gap-3">
                <InstagramIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-ink">Instagram Manual Queue</div>
                  <div className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    Unverified automation fallback: prepared copy, review queue, operator-confirmed outcomes.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calming Philosophy Note */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-xs text-text-muted gap-2">
            <span className="font-sans font-medium text-ink">
              What this replaces: nothing exotic — no Kubernetes, no vector database, no subscription lock-in.
            </span>
            <span className="font-mono text-text-muted">
              Responsibility: Owner manages network & DNS · Freelancer delivers code
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
