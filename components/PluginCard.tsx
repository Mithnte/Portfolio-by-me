"use client";

import { motion } from "framer-motion";
import { Github, ArrowUpRight, Download, Star, Activity, Cpu } from "lucide-react";
import { Plugin } from "@/lib/types";
import { PLATFORM_CONFIG, formatDownloads, statusBadgeClass } from "@/lib/platformConfig";
import { highlightMatch } from "@/lib/highlight";
import { describeMatch } from "@/lib/search";

interface PluginCardProps {
  plugin: Plugin;
  isSelected: boolean;
  onSelect: (plugin: Plugin) => void;
  searchQuery?: string;
  matchedIn?: string[];
}

export default function PluginCard({
  plugin,
  isSelected,
  onSelect,
  searchQuery = "",
  matchedIn = [],
}: PluginCardProps) {
  const config = PLATFORM_CONFIG[plugin.platform];
  const Icon = config.icon;

  const latencyLevel =
    plugin.latencyMs < 15 ? "low" : plugin.latencyMs < 30 ? "mid" : "high";
  const cpuLevel =
    plugin.cpuLoad < 15 ? "low" : plugin.cpuLoad < 35 ? "mid" : "high";

  const levelColor = {
    low: "bg-emerald-400",
    mid: "bg-amber-400",
    high: "bg-red-400",
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onClick={() => onSelect(plugin)}
      className={`group relative cursor-pointer rounded-2xl border backdrop-blur-md p-5 flex flex-col gap-4 transition-colors duration-200 ${
        isSelected
          ? `bg-slate-900/70 ${config.borderClass} ${config.glowShadow}`
          : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bgClass}`}
          >
            <Icon size={16} className={config.textClass} />
          </div>
          <span className={`text-xs font-medium ${config.textClass}`}>
            {plugin.platform}
          </span>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-1 rounded-full border ${statusBadgeClass(
            plugin.status
          )}`}
        >
          {plugin.version} · {plugin.status}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-slate-100 leading-snug">
          {highlightMatch(plugin.name, searchQuery)}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {highlightMatch(plugin.description, searchQuery)}
        </p>
        {searchQuery.trim().length > 0 &&
          describeMatch(matchedIn) &&
          !matchedIn.includes("name") &&
          !matchedIn.includes("description") && (
            <span className="text-[10px] text-cyan-400/80 font-mono">
              {describeMatch(matchedIn)}
            </span>
          )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-800 bg-black/30 p-2.5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Activity size={11} />
            <span className="text-[10px] font-mono uppercase tracking-wide">
              Latency
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-semibold text-slate-200">
              {plugin.latencyMs}
            </span>
            <span className="text-[10px] text-slate-500">ms</span>
            <span
              className={`ml-auto w-1.5 h-1.5 rounded-full ${levelColor[latencyLevel]}`}
            />
          </div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-black/30 p-2.5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Cpu size={11} />
            <span className="text-[10px] font-mono uppercase tracking-wide">
              CPU Load
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-semibold text-slate-200">
              {plugin.cpuLoad}
            </span>
            <span className="text-[10px] text-slate-500">%</span>
            <span
              className={`ml-auto w-1.5 h-1.5 rounded-full ${levelColor[cpuLevel]}`}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Download size={12} />
          {formatDownloads(plugin.downloads)}
        </span>
        <span className="flex items-center gap-1">
          <Star size={12} className="text-amber-400" />
          {plugin.stars}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(plugin);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors ${
            isSelected
              ? `${config.bgClass} ${config.textClass} border ${config.borderClass}`
              : "bg-slate-100 text-slate-900 hover:bg-white"
          }`}
        >
          View Details / Install
          <ArrowUpRight size={13} />
        </motion.button>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={plugin.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-colors"
          aria-label="GitHub Repo"
        >
          <Github size={15} />
        </motion.a>
      </div>
    </motion.div>
  );
}
