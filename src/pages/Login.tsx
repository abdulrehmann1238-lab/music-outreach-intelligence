import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('owner@cadence.demo');
  const [password, setPassword] = useState('demo-passphrase');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifiedStep, setVerifiedStep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failCount, setFailCount] = useState(0);

  const navigate = useNavigate();
  const { login, addToast } = useAppStore();

  const handleUseDemo = () => {
    setEmail('owner@cadence.demo');
    setPassword('demo-passphrase');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (failCount >= 3) {
      setError('Locked for 30s (demo protection against brute force).');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (email === 'owner@cadence.demo' && password === 'demo-passphrase') {
        setLoading(false);
        setVerifiedStep(true);
        setTimeout(() => {
          login(email);
          addToast({
            type: 'success',
            title: 'Authenticated as Owner',
            message: 'Tailscale peer verified on 127.0.0.1:8080'
          });
          navigate('/app');
        }, 600);
      } else {
        setLoading(false);
        setFailCount(c => c + 1);
        setError('Email or passphrase didn’t match demo credentials.');
      }
    }, 900);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between font-sans selection:bg-accent-tint selection:text-ink">
      {/* Top minimal bar */}
      <header className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-ink transition-colors">
          ← Back to proposal tour
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-surface rounded-2xl border border-border shadow-3 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Login Form */}
          <div className="lg:col-span-6 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div>
              {/* Brand mark */}
              <div className="w-8 h-8 rounded-xs bg-ink flex items-center justify-center text-bg mb-6 shadow-1">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-bg" fill="none">
                  <path d="M2 12h4l2-3 2 6 2-4 2 2 2-1h6" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
                  <rect x="6" y="6" width="2.5" height="12" rx="1" fill="currentColor" />
                  <rect x="11" y="6" width="6" height="2.2" rx="1" fill="currentColor" />
                  <rect x="11" y="15.8" width="6" height="2.2" rx="1" fill="currentColor" />
                </svg>
              </div>

              <h1 className="font-display text-2xl text-ink font-normal tracking-tight">
                Sign in to Cadence Desk
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Single-owner session · Authenticated over private HTTPS
              </p>
            </div>

            {verifiedStep ? (
              <div className="p-6 rounded-xl bg-success-tint/30 border border-success/40 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-10 h-10 rounded-full bg-success text-bg mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="font-semibold text-sm text-ink">
                  Verified on this device (Tailscale)
                </div>
                <p className="text-xs text-text-secondary">
                  Establishing local encrypted workspace session...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                {error && (
                  <div className="p-3 rounded-md bg-error-tint border border-error/30 text-error text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-text-secondary font-medium mb-1.5" htmlFor="login-email">
                    Owner Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-md bg-surface-elevated border border-border-strong text-ink focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-text-secondary font-medium" htmlFor="login-password">
                      Passphrase
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-text-muted hover:text-ink cursor-pointer flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 rounded-md bg-surface-elevated border border-border-strong text-ink focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full py-2.5 text-xs font-medium"
                >
                  Sign In to Console
                </Button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleUseDemo}
                    className="text-xs text-primary hover:underline font-medium cursor-pointer"
                  >
                    Click to fill demo credentials
                  </button>
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
              <span>Connected via Tailscale node</span>
              <span className="flex items-center gap-1 text-success">
                <Lock className="w-3 h-3" /> TLS 1.3
              </span>
            </div>
          </div>

          {/* Right: Security Principles Panel */}
          <div className="hidden lg:flex lg:col-span-6 bg-surface-sunken p-10 flex-col justify-between border-l border-border relative overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 400 400"
            >
              <path d="M 0 200 Q 100 120, 200 200 T 400 200" stroke="var(--ink)" strokeWidth="1.5" fill="none" />
            </svg>

            <div className="space-y-6 relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>

              <div>
                <h3 className="font-display text-xl text-ink font-normal">
                  Private to the Owner.
                </h3>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Anticipating the requirements from your brief: developer SSH access is restricted, secrets are stored in protected runtime config, and every permission-affecting action is audited.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span><strong>Local-first:</strong> Ingest and qualification happen strictly on your local RTX 3090 hardware.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span><strong>Bounded cloud call:</strong> Cloud review is only invoked for verified shortlists with cost caps.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span><strong>Immutable audit log:</strong> Every approve, hold, suppress, and send operation is logged to SQLite.</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-text-muted relative z-10">
              Cadence Desk · Ubuntu 22.04 LTS deployment
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-text-muted">
        Demo build · Simulated credentials: <code className="font-mono text-ink">owner@cadence.demo</code> / <code className="font-mono text-ink">demo-passphrase</code>
      </footer>
    </div>
  );
};
