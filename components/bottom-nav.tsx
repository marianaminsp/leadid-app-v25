"use client"

import { BookOpen, ScanLine, MapPin } from "lucide-react"

interface BottomNavProps {
  activeTab: "scan" | "herbarium" | "arboretum"
  onTabChange: (tab: "scan" | "herbarium" | "arboretum") => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav pb-safe z-50">
      <div className="mx-auto flex max-w-lg items-center justify-around px-8 py-3">
        <button
          onClick={() => onTabChange("herbarium")}
          className={`flex flex-col items-center gap-1.5 px-6 py-2.5 rounded-2xl transition-all duration-300 ${
            activeTab === "herbarium" ? "glass scale-105" : "scale-100 opacity-70 hover:opacity-100"
          }`}
          aria-label="Herbarium"
        >
          <BookOpen className="text-white" size={24} strokeWidth={activeTab === "herbarium" ? 2.5 : 2} />
          <span className={`text-xs text-white font-medium ${activeTab === "herbarium" ? "" : "opacity-0"}`}>
            Herbarium
          </span>
        </button>

        <button
          onClick={() => onTabChange("scan")}
          className="relative flex h-16 w-16 items-center justify-center rounded-full glow-button shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Scan"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/50 animate-spin-slow" />
            <ScanLine className="text-white" size={28} strokeWidth={2.5} />
          </div>
        </button>

        <button
          onClick={() => onTabChange("arboretum")}
          className={`flex flex-col items-center gap-1.5 px-6 py-2.5 rounded-2xl transition-all duration-300 ${
            activeTab === "arboretum" ? "glass scale-105" : "scale-100 opacity-70 hover:opacity-100"
          }`}
          aria-label="Arboretum"
        >
          <MapPin className="text-white" size={24} strokeWidth={activeTab === "arboretum" ? 2.5 : 2} />
          <span className={`text-xs text-white font-medium ${activeTab === "arboretum" ? "" : "opacity-0"}`}>
            Arboretum
          </span>
        </button>
      </div>
    </nav>
  )
}
