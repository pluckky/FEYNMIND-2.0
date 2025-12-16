import React from 'react'

const PublicDecks = () => {
  return (
    <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Public Decks</h1>
            <p className="text-[#8a8a8a]">Explore decks shared by the community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#C4F042] transition-colors">
              <div className="w-12 h-12 bg-linear-to-br from-[#C4F042] to-[#B4D9FF] rounded-lg mb-4" />
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-sm text-[#8a8a8a]">Browse public decks from the community</p>
            </div>
          </div>
        </div>
  )
}

export default PublicDecks