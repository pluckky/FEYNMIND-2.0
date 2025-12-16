'use client';

import { DeckProgress } from "@/components/deck-progress";
import { ProfileCard } from "@/components/profile-card";
import { QuestionCard } from "@/components/question-card";
import { StreakCalendar } from "@/components/streak-calendar";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [decks, setDecks] = useState<any[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);

  useEffect(() => {
    const storedDecks = JSON.parse(localStorage.getItem("decks") || "[]");
    setDecks(storedDecks);
    
    // If no selected deck, select the most recent one
    if (storedDecks.length > 0 && !selectedDeck) {
      setSelectedDeck(storedDecks[storedDecks.length - 1]);
    }
  }, []);

  const selectDeck = (deck: any) => {
    setSelectedDeck(deck);
    localStorage.setItem("currentDeck", JSON.stringify(deck));
  };

  if (decks.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Welcome to Feynmind</h1>
          <p className="text-[#8a8a8a] mb-8">Create your first study deck to get started!</p>
          <a href="/create-deck" className="bg-[#C4F042] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#b3d93c]">
            Create Your First Deck
          </a>
        </div>
      </div>
    );
  }

  if (selectedDeck) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{selectedDeck.name}</h1>
            <p className="text-[#8a8a8a]">Study topics extracted from {selectedDeck.fileName}</p>
          </div>
          <button
            onClick={() => setSelectedDeck(null)}
            className="text-[#C4F042] hover:text-[#b3d93c]"
          >
            ← Back to Decks
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedDeck.topics.split('\n').filter((topic: string) => topic.trim()).map((topic: string, index: number) => (
            <div key={index} className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#C4F042] transition-colors cursor-pointer">
              <h3 className="text-lg font-semibold text-white mb-2">{topic.trim()}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href = `/study?topic=${encodeURIComponent(topic.trim())}&difficulty=easy&fileName=${encodeURIComponent(selectedDeck.fileName)}`}
                  className="bg-[#C4F042] text-black px-3 py-1 rounded text-sm hover:bg-[#b3d93c]"
                >
                  Study Easy
                </button>
                <button
                  onClick={() => window.location.href = `/study?topic=${encodeURIComponent(topic.trim())}&difficulty=medium&fileName=${encodeURIComponent(selectedDeck.fileName)}`}
                  className="bg-[#2196f3] text-white px-3 py-1 rounded text-sm hover:bg-[#1976d2]"
                >
                  Study Medium
                </button>
                <button
                  onClick={() => window.location.href = `/study?topic=${encodeURIComponent(topic.trim())}&difficulty=hard&fileName=${encodeURIComponent(selectedDeck.fileName)}`}
                  className="bg-[#f44336] text-white px-3 py-1 rounded text-sm hover:bg-[#d32f2f]"
                >
                  Study Hard
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Study Decks</h1>
          <p className="text-[#8a8a8a]">Select a deck to start studying</p>
        </div>
        <a href="/my-analyses" className="text-[#C4F042] hover:text-[#b3d93c] underline">
          View All Analyses →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

      <div className="text-center">
        <a href="/create-deck" className="bg-[#C4F042] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#b3d93c] inline-block">
          Create New Deck
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StreakCalendar currentDay={24} />
        </div>
        <div className="lg:col-span-1">
          <QuestionCard />
        </div>
      </div>
      <DeckProgress />
    </div>
  );
};

export default Dashboard;
