"use client"

export function ProfileCard() {
  return (
    <div className="bg-gradient-to-r from-[#1a1a1a] to-[#252525] border border-[#2a2a2a] rounded-2xl p-6 flex items-center justify-between hover:border-[#C4F042] transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C4F042] to-[#B4D9FF] flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-white">Master</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-12 bg-[#C4F042] rounded-full" />
            <span className="text-sm font-semibold text-[#C4F042]">20k XP</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-[#8a8a8a]">Level 15:</p>
        <p className="text-2xl font-bold text-white">30k XP</p>
      </div>
    </div>
  )
}
