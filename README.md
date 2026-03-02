# Timelife

[![Deploy to Firebase Hosting](https://github.com/AymericLeFeyer/timelife/actions/workflows/firebase-hosting-pull-request.yml/badge.svg)](https://github.com/AymericLeFeyer/timelife/actions/workflows/firebase-hosting-pull-request.yml)
[![Last commit](https://img.shields.io/github/last-commit/AymericLeFeyer/timelife)](https://github.com/AymericLeFeyer/timelife/commits/main)
[![Stars](https://img.shields.io/github/stars/AymericLeFeyer/timelife?style=flat)](https://github.com/AymericLeFeyer/timelife/stargazers)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Hosted_on-Firebase-FFCA28?logo=firebase&logoColor=black)

An interactive career timeline that visualizes professional experience, missions, and technologies in a clean chronological view.

---

## Screenshots

> _Screenshots coming soon_

---

## Overview

Timelife is a personal portfolio timeline web app. It displays career history as an interactive vertical timeline — each entry shows a company, duration, role, and the technologies used across missions. Users can search and filter by technology to quickly explore relevant experience.

The UI was **mostly built using [Bolt](https://bolt.new)** (StackBlitz's AI-powered web development tool), with refinements made using Claude Code.

---

## Data Source

All data (profile, companies, missions, technologies) is fetched at runtime from **[portfolio-manager](https://github.com/AymericLeFeyer/portfolio-manager)**, a separate backend API that centralizes portfolio content.

**API base URL:** `https://api.aymeric.lefeyer.fr`

| Endpoint | Description |
|---|---|
| `GET /api/profile` | Name, title, bio, social links |
| `GET /api/companies` | Companies with icons |
| `GET /api/technologies` | Technologies with icons and categories |

Technology and company icons are served from the same API (e.g. `https://api.aymeric.lefeyer.fr/icons/technologies/flutter.png`).

---

## Features

- **Interactive timeline** — chronological career view with expandable mission details
- **Search** — filter across companies, missions, and technologies in real time
- **Quick filters** — one-click filter buttons for Kotlin, Flutter, React, VueJS, and NodeJS
- **Technology icons** — loaded dynamically from the portfolio-manager CDN
- **Responsive design** — works on mobile and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | TailwindCSS |
| Icons | Lucide React |
| Data | portfolio-manager REST API |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |

---

## Deployment

The app is deployed on **Firebase Hosting** (project `timelife-c7dc1`).

Deployment is fully automated via **GitHub Actions** (`.github/workflows/firebase-hosting-pull-request.yml`):

- **Push to `main`** → builds and deploys to the **live** channel
- **Pull request** → builds and deploys to a **preview channel**, with a comment posted automatically on the PR

To deploy manually:

```bash
npm run build
firebase deploy
```

Or use the combined script:

```bash
npm run deploy
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build
```

---

## Related

- [portfolio-manager](https://github.com/AymericLeFeyer/portfolio-manager) — backend API and content management
