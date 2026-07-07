"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Plugin } from "@/lib/types";
import { Platform } from "@/lib/platformConfig";
import { searchPlugins, sortPlugins, SortOption, SORT_LABELS } from "@/lib/search";
import PluginCard from "./PluginCard";

interface PluginGridProps {
  plugins: Plugin[];
  platformFilter: Platform | "All";
  selectedPlugin: Plugin;
  onSelectPlugin: (plugin: Plugin) => void;
}

const QUICK_FILTERS = ["Stable", "Beta", "High Downloads", "Low Latency"] as const;
type QuickFilter = (typeof QUICK_FILTERS)[number];

export default function PluginGrid({
  plugins,
  platformFilter,
  selectedPlugin,
  onSelectPlugin,
}: PluginGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuickFilters, setActiveQuickFilters] = useState<QuickFilter[]>(
    []
  );
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      ) {
        setSortMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleQuickFilter = (filter: QuickFilter) => {
    setActiveQuickFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredResults = useMemo(() => {
    let base = plugins;

    if (platformFilter !== "All") {
      base = base.filter((p) => p.platform === platformFilter);
    }

    if (activeQuickFilters.includes("Stable")) {
      base = base.filter((p) => p.status === "Stable");
    }
    if (activeQuickFilters.includes("Beta")) {
      base = base.filter((p) => p.status === "Beta");
    }
    if (activeQuickFilters.includes("High Downloads")) {
      base = base.filter((p) => p.downloads >= 15000);
    }
    if (activeQuickFilters.includes("Low Latency")) {
      base = base.filter((p) => p.latencyMs <= 15);
    }

    const searched = searchPlugins(base, searchQuery);

    if (searchQuery.trim().length > 0 && sortBy === "relevance") {
      return searched;
    }

    const sortedPlugins = sortPlugins(
      searched.map((r) => r.plugin),
      sortBy
    );
    const matchedInById = new Map(
      searched.map((r) => [r.plugin.id, r.matchedIn])
    );

    return sortedPlugins.map((plugin) => ({
      plugin,
      matchedIn: matchedInById.get(plugin.id) ?? [],
    }));
  }, [plugins, platformFilter, searchQuery, activeQuickFilters, sortBy]);

  return (
    <section className="lg:col-span-6 border-r border-slate-800 min-h-screen">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">
              {platformFilter === "All" ? "All Plugins" : platformFilter}
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {filteredResults.length} result
              {filteredResults.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, feature, hotkey, platform..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-slate-600 text-xs pr-1">
              <SlidersHorizontal size={12} />
            </span>
            {QUICK_FILTERS.map((filter) => {
              const isActive = activeQuickFilters.includes(filter);
              return (
                <button
                  key={filter}
                  onClick={() => toggleQuickFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    isActive
                      ? "bg-slate-100 text-slate-900 border-slate-100"
                      : "bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200"
                  }`}
                >
                  {filter}
                </button>
              );
            })}

            <div className="relative ml-auto" ref={sortMenuRef}>
              <button
                onClick={() => setSortMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-600 hover:text-slate-200 transition-all duration-200"
              >
                <ArrowUpDown size={11} />
                {SORT_LABELS[sortBy]}
              </button>
              {sortMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-20 rounded-xl border border-slate-800 bg-zinc-950 shadow-xl overflow-hidden min-w-[160px]">
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setSortMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                        sortBy === option
                          ? "bg-slate-800 text-slate-100"
                          : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                      }`}
                    >
                      {SORT_LABELS[option]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredResults.map(({ plugin, matchedIn }) => (
              <motion.div
                key={plugin.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <PluginCard
                  plugin={plugin}
                  isSelected={selectedPlugin.id === plugin.id}
                  onSelect={onSelectPlugin}
                  searchQuery={searchQuery}
                  matchedIn={matchedIn}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-slate-500">
              No plugins match your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveQuickFilters([]);
                setSortBy("relevance");
              }}
              className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
      }
