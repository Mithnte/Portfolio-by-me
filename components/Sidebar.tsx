"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  LayoutGrid,
  Blocks,
  Box,
  Car,
  TrendingUp,
  GitBranch,
  Star,
} from "lucide-react";
import { Plugin, Developer } from "@/lib/types";
import { Platform, formatDownloads } from "@/lib/platformConfig";
import DeveloperProfileCard from "./DeveloperProfileCard";

interface SidebarProps {
  plugins: Plugin[];
  developer: Developer;
  activeFilter: Platform | "All";
  onFilterChange: (filter: Platform | "All") => void;
}

const NAV_ITEMS: { key: Platform | "All"; label: string; icon: typeof LayoutGrid }[] = [
  { key: "All", label: "All Dash", icon: LayoutGrid },
  { key: "Roblox", label: "Roblox Plugins", icon: Blocks },
  { key: "Blender", label: "Blender Add-ons", icon: Box },
  { key: "FiveM", label: "FiveM Resources", icon: Car },
];

export default function Sidebar({
  plugins,
  developer,
  activeFilter,
  onFilterChange,
}: SidebarProps) {
  const counts: Record<Platform | "All", number> = {
    All: plugins.length,
    Roblox: plugins.filter((p) => p.platform === "Roblox").length,
    Blender: plugins.filter((p) => p.platform === "Blender").length,
    FiveM: plugins.filter((p) => p.platform === "FiveM").length,
  };

  const totalDownloads = plugins.reduce((sum, p) => sum + p.downloads, 0);
  const totalStars = plugins.reduce((sum, p) => sum + p.stars, 0);
  const activeRepos = plugins.length;

  return (
    <aside className="lg:col-span-3 border-r border-slate-800 bg-zinc-950/60 min-h-screen">
      <div className="p-6 flex flex-col gap-6 sticky top-0 max-h-screen overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Terminal size={20} className="text-cyan-400" />
            </div>
            <div className="absolute -inset-1 rounded-lg bg-cyan-500/20 blur-md -z-10" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-100">
              DevHub <span className="text-slate-500 font-normal">//</span>{" "}
              Plugins
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              multi-platform registry
            </p>
          </div>
        </div>

        <DeveloperProfileCard developer={developer} />

        <nav className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-medium px-3 mb-1">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onFilterChange(item.key)}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-slate-800/70 text-slate-100"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute left-0 top-1 bottom-1 w-0.5 bg-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className={isActive ? "text-cyan-400" : "text-slate-500"}
                  />
                  {item.label}
                </span>
                <span
                  className={`text-xs font-mono px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-slate-700 text-slate-200"
                      : "bg-slate-800/60 text-slate-500"
                  }`}
                >
                  {counts[item.key]}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-medium px-1">
            Global Stats
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Total Downloads</span>
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
                <TrendingUp size={12} />
                +12.4%
              </span>
            </div>
            <span className="text-2xl font-semibold font-mono text-slate-100">
              {formatDownloads(totalDownloads)}
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Active Repository Projects
              </span>
              <GitBranch size={14} className="text-slate-500" />
            </div>
            <span className="text-2xl font-semibold font-mono text-slate-100">
              {activeRepos}
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Global GitHub Stars
              </span>
              <Star size={14} className="text-amber-400" />
            </div>
            <span className="text-2xl font-semibold font-mono text-slate-100">
              {formatDownloads(totalStars)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
