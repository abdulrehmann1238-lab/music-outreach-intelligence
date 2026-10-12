# Cadence Desk — Music Outreach Intelligence System

An interactive frontend demo and proposal prototype for a single-owner, local-first music industry outreach intelligence console. Designed for discovering, qualifying, and contacting Asian record labels, sync/licensing companies, and independent artists while ensuring auditable scoring, hard gate enforcement, and delivery safeguards.

---

## Key Highlights & Architectural Principles

- **Local-First, Cloud-Last Pipeline:** Fast local extraction and scoring via local LLM endpoints (`llama.cpp` / Qwen), with a strictly bounded cloud model gate used only for final review of high-priority candidates.
- **Auditable Scoring System:** 100-point scorecards for Record Labels, Sync Houses, and Artists. Every score point references a verified, timestamped evidence snippet. Unsupported claims visibly score 0.
- **Hard Gate Overrides (G1–G10):** High scores never override hard gates (e.g. duplicates, inactive footprints, or suppression).
- **Four-Service Fit Engine:** Artists are independently evaluated across Production, Songwriting, Mixing, and Mastering, with clear distinction between explicit statements and inferred hypotheses.
- **Safety Safeguards by Default:** Live email sending is OFF by default (requires typed confirmation), dry-run testing is supported, repeated sends are blocked by idempotency keys, and Instagram outbound uses a manual operator queue.
- **Single-Owner Privacy:** Private to the owner with isolated secrets and Tailscale device verification.

---

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS with custom CSS variables (Warm paper neutral `--bg: #F5F2EC`, spruce `--primary: #24504E`, terracotta `--accent: #AE5A35`)
- **Typography:** `@fontsource/newsreader` (display serif), `@fontsource/instrument-sans` (UI sans), `@fontsource/jetbrains-mono` (tabular mono)
- **Icons:** `lucide-react`
- **State Management:** `zustand` with persistence and audit logging
- **Routing:** `react-router-dom` with SPA redirects configured for Netlify

---

## Local Development

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Netlify Deployment

This repository includes:
1. `netlify.toml` with build commands (`npm run build`), publish directory (`dist`), Node 20 environment, and SPA redirect rules (`/*` to `/index.html` with status `200`).
2. `public/_redirects` for fallback client-side routing on any static host.

When importing this repository into Netlify:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 20+
