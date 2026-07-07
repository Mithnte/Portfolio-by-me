import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevHub // Plugins",
  description:
    "Centralized dashboard for Roblox, Blender, and FiveM plugins, add-ons, and scripts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
