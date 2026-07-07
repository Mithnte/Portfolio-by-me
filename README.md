# DevHub // Plugins

Multi-Platform Developer Plugin Hub — a dashboard/portfolio to showcase
Roblox Studio plugins, Blender add-ons, and FiveM resources.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Lucide React icons
- Framer Motion

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  layout.tsx        Root layout, fonts, metadata
  page.tsx           Page state: selected platform filter, selected plugin
  globals.css        Tailwind base + JetBrains Mono / Inter imports
  api/
    auth/discord/route.ts             Discord OAuth step 1 (scaffold, inactive)
    auth/discord/callback/route.ts     Discord OAuth step 2 (scaffold, inactive)
components/
  Sidebar.tsx              Left nav + profile card + global stats
  DeveloperProfileCard.tsx  Avatar, bio, stats, connector badges
  PluginGrid.tsx            Search, quick-filter pills, responsive card grid
  PluginCard.tsx             Individual plugin card
  InspectorPanel.tsx         Right panel: Overview / Changelog tabs
data/
  plugins.json          6 mock plugins (Roblox x2, Blender x2, FiveM x2)
  developer.json         Developer profile: bio, stats, connector links
lib/
  types.ts               Shared TypeScript interfaces
  platformConfig.ts       Brand colors, icons, connector config, formatting helpers
  search.ts               Weighted search scoring, sorting, match descriptions
  highlight.tsx            Search-term highlighting for card titles/descriptions
```

## Who can use this

This is a **single-owner showcase**, not a multi-user marketplace. It's
built for one developer (or one team) to display their own plugins —
visitors can browse, search, and filter, but there's no account system,
no database, and no way for a visitor to upload their own plugin through
the site. Anyone can clone this repo and run their own instance with
their own `plugins.json` and `developer.json` — that's the "universal"
part. Turning it into a place where *other people* register accounts and
submit their own plugins is a materially bigger project (needs a real
database instead of a JSON file, user accounts, an upload/review flow,
and content moderation) and isn't included here.

## Search behavior

The center grid's search box scores every plugin against the query
across five fields — name, platform, description, feature bullets, and
hotkey combos/actions — weighted so a title match ranks above a hit
buried in a hotkey. Matching text is highlighted inline on each card, and
when a match comes from a feature or hotkey (not visible in the card
preview), a small "Matched in ..." label appears so the connection isn't
mysterious. A sort dropdown (top-right of the filter row) lets visitors
re-order by downloads, stars, or latency instead of relevance. This logic
lives in `lib/search.ts`, independent of any component, so it can be
reused or unit-tested on its own.

## Editing plugin data

All plugin content lives in `data/plugins.json`. Each entry follows the
`Plugin` interface in `lib/types.ts`. Add a new object to the array to add
a plugin — no code changes required, the grid, sidebar counts, and
inspector panel all read from this file reactively.

## Editing the developer profile

`data/developer.json` drives the profile card in the sidebar (avatar
initials, bio, role, location, stats, and connector links). Each entry in
`connectors` has a `kind`:

- `"static"` — a plain link (GitHub, YouTube, Twitter/X). Renders as a
  clickable badge immediately, no setup needed. Just replace the `url`
  fields with your real profile links.
- `"oauth"` — currently only Discord. Renders as a locked/disabled badge
  until the OAuth scaffold below is wired up, since a real "connected"
  state requires a server-side token exchange.

## Discord connector

Two things ship today:

1. **A static "Join Discord" badge** — set `connected: true` and `kind:
   "static"` on the Discord entry in `data/developer.json` if you just
   want it to link straight to your server invite (e.g.
   `https://discord.gg/your-code`). This works immediately, no backend
   needed.
2. **A Discord OAuth scaffold** (`app/api/auth/discord/route.ts` and
   `app/api/auth/discord/callback/route.ts`) for actually letting users
   log in with Discord. This is present but inactive until configured:
   - Create an app at
     [discord.com/developers/applications](https://discord.com/developers/applications)
   - Copy `.env.example` to `.env.local` and fill in `DISCORD_CLIENT_ID`,
     `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`
   - Add the same redirect URI in the Discord app's OAuth2 settings
   - Point a "Login with Discord" button at `/api/auth/discord`
   
   The client secret is only ever read server-side in the callback
   route — it's never sent to the browser.

## Connecting a real GitHub upload flow

The "GitHub Repo" buttons currently link out to static repo URLs
(`repoUrl` field in `plugins.json`), pointed at
`https://github.com/Mithnte`. If you want users (or you) to push new
script files to a repo directly from this dashboard, that requires a
server-side piece this static frontend does not include:

1. A GitHub OAuth App or GitHub App for authentication.
2. An API route (e.g. `app/api/github/upload/route.ts`) that holds the
   access token server-side and calls the GitHub Contents API
   (`PUT /repos/{owner}/{repo}/contents/{path}`).
3. A form/component that posts file content to that API route instead of
   directly to GitHub, so the token never reaches the browser.

This follows the same pattern as the Discord OAuth scaffold above.

## Deploying

### Vercel

```bash
npm i -g vercel
vercel
```

Or connect the repo at [vercel.com/new](https://vercel.com/new) — zero
config needed, Next.js is auto-detected.

### Netlify

Add a `netlify.toml` with:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Then `netlify deploy` or connect the repo via the Netlify dashboard.
