import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';

export const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { bannerDismissed, setBannerDismissed } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Scoring', href: '#scoring' },
    { label: 'Safeguards', href: '#safeguards' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Milestones', href: '#milestones' },
  ];

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Demo Banner */}
      {!bannerDismissed && (
        <div className="bg-surface-sunken border-b border-border text-[11px] font-sans text-text-secondary py-1.5 px-4 flex items-center justify-between z-nav">
          <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>
              Interactive Proposal Demo — All prospect names, domains, and metrics are simulated and traceable to the 10-page brief.
            </span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-text-muted hover:text-ink cursor-pointer text-xs p-0.5"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sticky Global Nav */}
      <header
        className={`sticky top-0 z-nav transition-all duration-200 select-none ${
          scrolled ? 'bg-bg/92 border-b border-border shadow-1' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1360px] mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-xs bg-ink flex items-center justify-center text-bg shadow-1">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-bg" fill="none">
                <path d="M2 12h4l2-3 2 6 2-4 2 2 2-1h6" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
                <rect x="6" y="6" width="2.5" height="12" rx="1" fill="currentColor" />
                <rect x="11" y="6" width="6" height="2.2" rx="1" fill="currentColor" />
                <rect x="11" y="15.8" width="6" height="2.2" rx="1" fill="currentColor" />
              </svg>
            </div>
            <span className="font-display font-medium text-lg text-ink tracking-tight">
              Cadence Desk
            </span>
          </Link>

          {/* Centre Anchors (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-xs font-sans font-medium text-text-secondary hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="hidden sm:inline-flex text-xs font-sans font-medium text-text-secondary hover:text-ink px-3 py-1.5 transition-colors"
            >
              Sign in
            </Link>

            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/app')}
              className="text-xs"
            >
              Open the console →
            </Button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-text-secondary hover:text-ink cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full Sheet Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-surface-elevated border-b border-border shadow-3 p-6 space-y-4 animate-in slide-in-from-top-2">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="block py-2 text-sm font-sans font-medium text-ink hover:text-primary border-b border-border/50"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app');
                }}
              >
                Open the console →
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
              >
                Sign in with demo credentials
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
