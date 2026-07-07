import { Platform } from "./platformConfig";

export interface Hotkey {
  combo: string;
  action: string;
}

export interface LogEntry {
  time: string;
  level: "INF" | "WRN" | "ERR" | "OK";
  message: string;
}

export interface Plugin {
  id: string;
  platform: Platform;
  name: string;
  description: string;
  version: string;
  status: "Stable" | "Beta" | "Deprecated";
  downloads: number;
  stars: number;
  latencyMs: number;
  cpuLoad: number;
  repoUrl: string;
  installSteps: string[];
  features: string[];
  hotkeys: Hotkey[];
  changelog: LogEntry[];
}

export type ConnectorId = "github" | "discord" | "youtube" | "twitter";

export interface Connector {
  id: ConnectorId;
  label: string;
  url: string;
  connected: boolean;
  kind: "static" | "oauth";
}

export interface DeveloperStats {
  projects: number;
  totalStars: number;
  totalDownloads: number;
}

export interface Developer {
  name: string;
  handle: string;
  avatarInitials: string;
  bio: string;
  role: string;
  location: string;
  stats: DeveloperStats;
  connectors: Connector[];
}
