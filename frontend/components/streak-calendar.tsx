"use client"

import { Button } from "@/components/ui/button"

export function StreakCalendar({ currentDay }: { currentDay: number }) {
  const days = Array.from({ length: 29 }, (_, i) => i + 1)
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border border-[#2a2a2a] rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6">Start your streak!</h3>

      {/* Calendar Grid */}
      <div className="mb-8">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm text-[#8a8a8a] font-semibold">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar dates */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <button
              key={day}
              className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                day === currentDay
                  ? "bg-[#C4F042] text-black"
                  : day < currentDay
                    ? "bg-[#1a1a1a] text-[#C4F042] border border-[#C4F042]"
                    : "bg-[#1a1a1a] text-[#8a8a8a] hover:bg-[#2a2a2a]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Start Streak Button */}
      <Button className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-[#C4F042] rounded-full h-14 font-semibold text-base transition-all hover:shadow-lg hover:shadow-[#C4F042]/20">
        Start streak
      </Button>
    </div>
  )
}
