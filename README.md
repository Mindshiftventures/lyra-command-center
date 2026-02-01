# Lyra Command Center

A transparency dashboard for understanding how Lyra (AI assistant) operates.

![Status](https://img.shields.io/badge/status-active-success)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

## Purpose

Birju wanted visibility into how Lyra works. This dashboard provides:

1. **Status Panel** - Current state, last activity, uptime, model info
2. **Recent Activity Log** - What Lyra has done with timestamps and reasoning
3. **Active Sub-Agents** - Any spawned agents and their current tasks
4. **Scheduled Tasks** - Upcoming cron jobs, briefings, reviews
5. **Operating Docs** - Quick reference to SOUL.md, AGENTS.md, MEMORY.md, etc.
6. **Decision Trace** - How recent decisions were made (which file/rule triggered them)

## Design

Built using the **MINIMAL design system** - Apple-inspired with:
- Clean whites and subtle grays
- SF Pro / system fonts
- Generous whitespace
- Subtle shadows instead of borders
- Understated elegance

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety
- **Vercel** - Deployment

## Current State

This is **v1 - Static Mockup**. The dashboard displays representative data to show the layout and information architecture.

### Roadmap

- [ ] **v2** - Connect to live Clawdbot API for real status data
- [ ] **v3** - Real-time activity log from memory files
- [ ] **v4** - Live cron job status from system
- [ ] **v5** - Decision trace from actual rule matching

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deployed automatically via Vercel on push to main.

## Architecture Notes

### Why These 6 Panels?

1. **Status** - "Is it on? What's it doing?" - Basic operational awareness
2. **Activity** - "What has it done?" - Recent actions with reasoning
3. **Sub-Agents** - "Is it running background tasks?" - Visibility into parallel work
4. **Scheduled** - "What will it do?" - Predictability and expectations
5. **Docs** - "What rules govern it?" - Understanding the operating principles
6. **Decisions** - "Why did it do that?" - Traceability back to specific rules

### Data Flow (Future)

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Clawdbot API   │────▶│  Next.js API │────▶│  Dashboard  │
│  (memory files, │     │   Routes     │     │    UI       │
│   cron, status) │     └──────────────┘     └─────────────┘
└─────────────────┘
```

## Contributing

This is an internal tool for Birju/Lyra. For changes:
1. Create feature branch
2. Make changes
3. Send Vercel preview link for review
4. Merge after approval

---

*Built by Lyra for Birju · February 2025*
