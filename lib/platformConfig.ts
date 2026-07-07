import { Box, Blocks, Car, Github, Youtube, Twitter, MessageCircle, LucideIcon } from "lucide-react";
import { ConnectorId } from "./types";

export type Platform = "Roblox" | "Blender" | "FiveM";

interface PlatformMeta {
  label: Platform;
  icon: LucideIcon;
  textClass: string;
  bgClass: string;
  borderClass: string;
  glowShadow: string;
  ringClass: string;
  hex: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformMeta> = {
  Roblox: {
    label: "Roblox",
    icon: Blocks,
    textClass: "text-roblox",
    bgClass: "bg-roblox/10",
    borderClass: "border-roblox/40",
    glowShadow: "shadow-glow-roblox",
    ringClass: "ring-roblox/50",
    hex: "#38bdf8",
  },
  Blender: {
    label: "Blender",
    icon: Box,
    textClass: "text-blender",
    bgClass: "bg-blender/10",
    borderClass: "border-blender/40",
    glowShadow: "shadow-glow-blender",
    ringClass: "ring-blender/50",
    hex: "#f59e0b",
  },
  FiveM: {
    label: "FiveM",
    icon: Car,
    textClass: "text-fivem",
    bgClass: "bg-fivem/10",
    borderClass: "border-fivem/40",
    glowShadow: "shadow-glow-fivem",
    ringClass: "ring-fivem/50",
    hex: "#10b981",
  },
};

export const CONNECTOR_CONFIG: Record<
  ConnectorId,
  { label: string; icon: LucideIcon; textClass: string; hoverBg: string }
> = {
  github: {
    label: "GitHub",
    icon: Github,
    textClass: "text-slate-300",
    hoverBg: "hover:bg-slate-800",
  },
  discord: {
    label: "Discord",
    icon: MessageCircle,
    textClass: "text-indigo-400",
    hoverBg: "hover:bg-indigo-500/10",
  },
  youtube: {
    label: "YouTube",
    icon: Youtube,
    textClass: "text-red-400",
    hoverBg: "hover:bg-red-500/10",
  },
  twitter: {
    label: "Twitter / X",
    icon: Twitter,
    textClass: "text-sky-400",
    hoverBg: "hover:bg-sky-500/10",
  },
};

export function formatDownloads(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}K`;
  }
  return n.toString();
}

export function statusBadgeClass(status: string): string {
  if (status === "Stable") {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  }
  if (status === "Beta") {
    return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  }
  return "bg-slate-500/10 text-slate-400 border-slate-500/30";
}

export function logLevelClass(level: string): string {
  switch (level) {
    case "ERR":
      return "text-red-400";
    case "WRN":
      return "text-amber-400";
    case "OK":
      return "text-emerald-400";
    default:
      return "text-green-400";
  }
}
