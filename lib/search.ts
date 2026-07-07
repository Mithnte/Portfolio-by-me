import { Plugin } from "./types";

export type SortOption = "relevance" | "downloads" | "stars" | "latency";

export const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  downloads: "Most Downloads",
  stars: "Most Stars",
  latency: "Lowest Latency",
};

interface ScoredPlugin {
  plugin: Plugin;
  score: number;
  matchedIn: string[];
}

/**
 * Scores a plugin against a search query across multiple fields, each
 * weighted by how strong a match there is likely to mean to the user.
 * A hit in the title matters more than a hit buried in a hotkey action.
 */
function scorePlugin(plugin: Plugin, query: string): ScoredPlugin {
  const q = query.toLowerCase().trim();
  let score = 0;
  const matchedIn: string[] = [];

  if (q.length === 0) {
    return { plugin, score: 0, matchedIn };
  }

  const name = plugin.name.toLowerCase();
  if (name === q) {
    score += 100;
    matchedIn.push("name");
  } else if (name.startsWith(q)) {
    score += 60;
    matchedIn.push("name");
  } else if (name.includes(q)) {
    score += 40;
    matchedIn.push("name");
  }

  if (plugin.platform.toLowerCase().includes(q)) {
    score += 25;
    matchedIn.push("platform");
  }

  if (plugin.description.toLowerCase().includes(q)) {
    score += 20;
    matchedIn.push("description");
  }

  const featureHit = plugin.features.some((f) => f.toLowerCase().includes(q));
  if (featureHit) {
    score += 12;
    matchedIn.push("features");
  }

  const hotkeyHit = plugin.hotkeys.some(
    (h) =>
      h.action.toLowerCase().includes(q) || h.combo.toLowerCase().includes(q)
  );
  if (hotkeyHit) {
    score += 8;
    matchedIn.push("hotkeys");
  }

  if (plugin.version.toLowerCase().includes(q)) {
    score += 5;
    matchedIn.push("version");
  }

  return { plugin, score, matchedIn };
}

/**
 * Filters and ranks plugins by search relevance. Returns plugins with
 * score > 0 only, sorted descending by score. When query is empty,
 * returns all plugins with score 0 (i.e. unranked / original order).
 */
export function searchPlugins(
  plugins: Plugin[],
  query: string
): { plugin: Plugin; matchedIn: string[] }[] {
  if (query.trim().length === 0) {
    return plugins.map((plugin) => ({ plugin, matchedIn: [] }));
  }

  return plugins
    .map((plugin) => scorePlugin(plugin, query))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ plugin, matchedIn }) => ({ plugin, matchedIn }));
}

export function sortPlugins(plugins: Plugin[], sortBy: SortOption): Plugin[] {
  const copy = [...plugins];
  switch (sortBy) {
    case "downloads":
      return copy.sort((a, b) => b.downloads - a.downloads);
    case "stars":
      return copy.sort((a, b) => b.stars - a.stars);
    case "latency":
      return copy.sort((a, b) => a.latencyMs - b.latencyMs);
    case "relevance":
    default:
      return copy;
  }
}

const FIELD_LABELS: Record<string, string> = {
  name: "title",
  platform: "platform",
  description: "description",
  features: "a feature",
  hotkeys: "a hotkey",
  version: "version",
};

export function describeMatch(matchedIn: string[]): string | null {
  if (matchedIn.length === 0) return null;
  const primary = matchedIn[0];
  return `Matched in ${FIELD_LABELS[primary] ?? primary}`;
}
