"use client";

import { useState } from "react";
import pluginsData from "@/data/plugins.json";
import developerData from "@/data/developer.json";
import { Plugin, Developer } from "@/lib/types";
import { Platform } from "@/lib/platformConfig";
import Sidebar from "@/components/Sidebar";
import PluginGrid from "@/components/PluginGrid";
import InspectorPanel from "@/components/InspectorPanel";

const plugins = pluginsData as Plugin[];
const developer = developerData as Developer;

export default function Home() {
  const [platformFilter, setPlatformFilter] = useState<Platform | "All">(
    "All"
  );
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin>(plugins[0]);

  return (
    <main className="min-h-screen bg-zinc-950 relative">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 relative">
        <Sidebar
          plugins={plugins}
          developer={developer}
          activeFilter={platformFilter}
          onFilterChange={setPlatformFilter}
        />
        <PluginGrid
          plugins={plugins}
          platformFilter={platformFilter}
          selectedPlugin={selectedPlugin}
          onSelectPlugin={setSelectedPlugin}
        />
        <InspectorPanel plugin={selectedPlugin} />
      </div>
    </main>
  );
}
