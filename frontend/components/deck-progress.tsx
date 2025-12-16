"use client"

export function DeckProgress() {
  const decks = [
    { name: "[real] midterms algo ...", mastered: 0, total: 29 },
    { name: "[midterms] algo and...", mastered: 0, total: 27 },
    { name: "[midterms] machine le...", mastered: 0, total: 50 },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Deck progress</h3>
        <button className="text-[#C4F042] hover:text-white transition-colors text-sm font-semibold">See all</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {decks.map((deck, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#C4F042] transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-4 h-4 rounded ${["bg-pink-500", "bg-blue-500", "bg-yellow-500"][i]}`} />
              <span className="text-sm font-bold text-[#C4F042]">0%</span>
            </div>
            <h4 className="text-sm font-semibold text-white mb-2">{deck.name}</h4>
            <p className="text-xs text-[#8a8a8a]">0 of {deck.total} cards mastered</p>
          </div>
        ))}
      </div>
    </div>
  )
}
