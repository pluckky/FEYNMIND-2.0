"use client"

import { Flame } from "lucide-react"

export function QuestionCard() {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border border-[#2a2a2a] rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
      <h3 className="text-5xl font-bold text-white mb-2">2</h3>
      <p className="text-[#8a8a8a] text-sm mb-8">Questions to start your streak</p>

      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#C4F042] to-transparent opacity-20" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-b from-[#B4D9FF] to-transparent opacity-20" />
        <Flame className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#C4F042]" />
      </div>
    </div>
  )
}
