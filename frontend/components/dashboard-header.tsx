"use client"

import { Bell, Zap, Menu } from "lucide-react"
import ProfileIcon from "./profile"

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="bg-[#0f0f0f] border-b border-[#2a2a2a] px-8 py-4 flex items-center justify-between">
      <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
        <Menu className="w-6 h-6 text-[#C4F042]" />
      </button>
      <div />
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-[#C4F042] text-black font-semibold rounded-full text-sm hover:bg-[#b8e035] transition-colors">
          Master Mode
        </button>
        <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-2 rounded-full">
          <Zap className="w-4 h-4 text-[#C4F042]" />
          <span className="text-sm font-semibold">1463</span>
        </div>
        <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors">
          <Bell className="w-5 h-5 text-[#8a8a8a]" />
        </button>
        <ProfileIcon />
        
      </div>
    </header>
  )
}
