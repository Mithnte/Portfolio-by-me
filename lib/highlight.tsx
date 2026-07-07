import React from "react";

/**
 * Splits `text` around case-insensitive occurrences of `query` and wraps
 * matches in a <mark>-like span. Returns plain text (as a single-item
 * array) when query is empty so callers can render uniformly either way.
 */
export function highlightMatch(
  text: string,
  query: string
): React.ReactNode[] {
  if (!query || query.trim().length === 0) {
    return [text];
  }

  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) && part.toLowerCase() === trimmed.toLowerCase() ? (
      <mark
        key={i}
        className="bg-cyan-500/25 text-cyan-200 rounded-sm px-0.5"
      >
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}
