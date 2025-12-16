"use client";

import type React from "react";
import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateDeckPage() {
  const [deckName, setDeckName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreateDeck = async () => {
    if (!file || !deckName) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Upload successful:", data);

      // Store the data for later use
      const newDeck = {
        id: Date.now().toString(),
        name: deckName,
        fileName: data.fileName,
        topics: data.topics,
        createdAt: new Date().toISOString(),
      };

      const existingDecks = JSON.parse(localStorage.getItem("decks") || "[]");
      existingDecks.push(newDeck);
      localStorage.setItem("decks", JSON.stringify(existingDecks));

      // Set as current deck for immediate study
      localStorage.setItem("currentDeck", JSON.stringify(newDeck));

      // Navigate to study page or dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Deck</h1>
        <p className="text-[#8a8a8a]">
          Upload your module to generate a study deck
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-8 space-y-6">
          {/* Deck Name Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Deck Name
            </label>
            <input
              type="text"
              placeholder="e.g., Biology Chapter 3"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white placeholder-[#5a5a5a] focus:border-[#C4F042] focus:outline-none transition-colors"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Upload Module
            </label>
            <div className="border-2 border-dashed border-[#2a2a2a] rounded-lg p-8 hover:border-[#C4F042] transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-8 h-8 text-[#C4F042] mb-3" />
                <p className="text-white font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-[#8a8a8a]">
                  PDF, DOC, DOCX (Max 50MB)
                </p>
              </label>
            </div>
            {file && (
              <p className="text-sm text-[#C4F042] mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Create Button */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleCreateDeck}
              disabled={!deckName || !file}
              className="flex-1 bg-[#C4F042] hover:bg-[#b3d93c] text-black rounded-full h-12 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Deck
            </Button>
            <Link href="/my-decks" className="flex-1">
              <Button className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-[#2a2a2a] rounded-full h-12">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
