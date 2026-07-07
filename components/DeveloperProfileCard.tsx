use client";

import { motion } from "framer-motion";
import { MapPin, FolderGit2, Star, Download, Lock } from "lucide-react";
import { Developer } from "@/lib/types";
import { CONNECTOR_CONFIG, formatDownloads } from "@/lib/platformConfig";

interface DeveloperProfileCardProps {
  developer: Developer;
}

export default function DeveloperProfileCard({
  developer,
}: DeveloperProfileCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 via-slate-700 to-amber-500 flex items-center justify-center text-sm font-semibold text-slate-950">
            {developer.avatarInitials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
        </div>
        <div className="min-w-0 flex flex-col">
          <span className="text-sm font-semibold text-slate-100 truncate">
            {developer.name}
          </span>
          <span className="text-xs text-slate-500 truncate">
            {developer.role}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        {developer.bio}
      </p>

      <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <MapPin size={11} />
        {developer.location}
      </span>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80">
        <div className="flex flex-col items-center gap-1 pt-3">
          <FolderGit2 size={13} className="text-slate-500" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            {developer.stats.projects}
          </span>
          <span className="text-[9px] text-slate-600 uppercase tracking-wide">
            Projects
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 pt-3 border-x border-slate-800/80">
          <Star size={13} className="text-amber-400" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            {formatDownloads(developer.stats.totalStars)}
          </span>
          <span className="text-[9px] text-slate-600 uppercase tracking-wide">
            Stars
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 pt-3">
          <Download size={13} className="text-slate-500" />
          <span className="text-xs font-mono font-semibold text-slate-200">
            {formatDownloads(developer.stats.totalDownloads)}
          </span>
          <span className="text-[9px] text-slate-600 uppercase tracking-wide">
            Downloads
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80 mt-1">
        {developer.connectors.map((connector) => {
          const meta = CONNECTOR_CONFIG[connector.id];
          const Icon = meta.icon;

          if (connector.kind === "oauth" && !connector.connected) {
            return (
              <button
                key={connector.id}
                type="button"
                title={`${meta.label} — connect via OAuth (coming soon)`}
                disabled
                className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-600 cursor-not-allowed"
              >
                <Icon size={14} />
                <Lock
                  size={9}
                  className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-[1px] text-slate-500"
                />
              </button>
            );
          }

          return (
            <motion.a
              key={connector.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              href={connector.url}
              target="_blank"
              rel="noopener noreferrer"
              title={meta.label}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border border-slate-800 bg-slate-900/60 ${meta.textClass} ${meta.hoverBg} hover:border-slate-600 transition-colors`}
            >
              <Icon size={14} />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
