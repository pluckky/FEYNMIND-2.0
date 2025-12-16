"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const MyDecks = () => {
  const [decks, setDecks] = useState<any[]>([])

  useEffect(() => {
    const storedDecks = JSON.parse(localStorage.getItem("decks") || "[]")
    setDecks(storedDecks)
  }, [])

  const selectDeck = (deck: any) => {
    localStorage.setItem("currentDeck", JSON.stringify(deck))
    window.location.href = "/dashboard"
  }

  return (
    <div className="space-y-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Decks</h1>
          <p className="text-[#8a8a8a]">Create and manage your study decks</p>
        </div>
        <a href="/create-deck">
          <Button className="bg-[#C4F042] hover:bg-[#b3d93c] text-black rounded-full h-12 font-medium px-6">
            <Plus className="w-4 h-4 mr-2" />
            {decks.length === 0 ? "Create Your First Deck" : "Create a Deck"}
          </Button>
        </a>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-4">No decks yet</h2>
          <p className="text-[#8a8a8a] mb-8">Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.id}
              onClick={() => selectDeck(deck)}
              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#C4F042] transition-colors cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{deck.name}</h3>
              <p className="text-[#8a8a8a] text-sm mb-3">{deck.fileName}</p>
              <p className="text-[#C4F042] text-sm">
                {deck.topics.split('\n').filter((t: string) => t.trim()).length} topics
              </p>
              <p className="text-[#5a5a5a] text-xs mt-2">
                Created: {new Date(deck.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyDecks