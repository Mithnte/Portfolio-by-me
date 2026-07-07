"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListChecks,
  Keyboard,
  Terminal as TerminalIcon,
  Download,
  Star,
  ExternalLink,
} from "lucide-react";
import { Plugin } from "@/lib/types";
import {
  PLATFORM_CONFIG,
  statusBadgeClass,
  logLevelClass,
  formatDownloads,
} from "@/lib/platformConfig";

interface InspectorPanelProps {
  plugin: Plugin;
}

type Tab = "overview" | "changelog";

export default function InspectorPanel({ plugin }: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const config = PLATFORM_CONFIG[plugin.platform];
  const Icon = config.icon;

  return (
    <aside className="hidden lg:block lg:col-span-3 min-h-screen">
      <div className="p-6 flex flex-col gap-5 sticky top-0 max-h-screen overflow-y-auto scrollbar-thin">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.bgClass}`}
            >
              <Icon size={17} className={config.textClass} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${config.textClass}`}>
                {plugin.platform}
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border w-fit ${statusBadgeClass(
                  plugin.status
                )}`}
              >
                {plugin.version} · {plugin.status}
              </span>
            </div>
          </div>

          <h2 className="text-base font-semibold text-slate-100 leading-snug">
            {plugin.name}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {plugin.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Download size={12} />
              {formatDownloads(plugin.downloads)} installs
            </span>
            <span className="flex items-center gap-1">
              <Star size={12} className="text-amber-400" />
              {plugin.stars} stars
            </span>
          </div>

          <a
            href={plugin.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-300 border border-slate-800 rounded-lg py-2 hover:border-slate-600 hover:text-slate-100 transition-colors"
          >
            View Source Repository
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="flex items-center gap-1 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("overview")}
            className={`relative px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === "overview"
                ? "text-slate-100"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Overview
            {activeTab === "overview" && (
              <motion.div
                layoutId="inspector-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("changelog")}
            className={`relative px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === "changelog"
                ? "text-slate-100"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Changelog
            {activeTab === "changelog" && (
              <motion.div
                layoutId="inspector-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                  <ListChecks size={13} />
                  Installation
                </span>
                <ol className="flex flex-col gap-2">
                  {plugin.installSteps.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-xs text-slate-400 leading-relaxed"
                    >
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-medium text-slate-300">
                  Features
                </span>
                <ul className="flex flex-col gap-1.5">
                  {plugin.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-xs text-slate-400 leading-relaxed"
                    >
                      <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${config.textClass.replace("text-", "bg-")}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                  <Keyboard size={13} />
                  Configured Hotkeys
                </span>
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-3 flex flex-col gap-2">
                  {plugin.hotkeys.map((hotkey, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-xs text-slate-400">
                        {hotkey.action}
                      </span>
                      <kbd className="text-[10px] font-mono px-2 py-1 rounded-md bg-black/40 border border-slate-700 text-slate-300 whitespace-nowrap">
                        {hotkey.combo}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="changelog"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-3"
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <TerminalIcon size={13} />
                Live Log Output
              </span>
              <div className="bg-black font-mono text-xs text-green-400 p-3 rounded-lg border border-slate-800 flex flex-col gap-1.5 overflow-x-auto">
                <div className="flex items-center gap-1.5 pb-2 mb-1 border-b border-slate-800/80">
                  <span className="w-2 h-2 rounded-full bg-red-500/70" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/70" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
                  <span className="ml-2 text-slate-500 text-[10px]">
                    {plugin.name.toLowerCase().replace(/\s+/g, "-")}.log
                  </span>
                </div>
                {plugin.changelog.map((entry, i) => (
                  <div key={i} className="flex gap-2 whitespace-nowrap">
                    <span className="text-slate-600">[{entry.time}]</span>
                    <span className={logLevelClass(entry.level)}>
                      {entry.level}
                    </span>
                    <span className="text-slate-300">{entry.message}</span>
                  </div>
                ))}
                <div className="flex gap-1 pt-1">
                  <span className="text-slate-600">$</span>
                  <span className="w-1.5 h-3.5 bg-green-400 animate-blink" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
