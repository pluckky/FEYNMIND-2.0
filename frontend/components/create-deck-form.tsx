"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"

interface CreateDeckFormProps {
  onClose: () => void
}

export function CreateDeckForm({ onClose }: CreateDeckFormProps) {
  const [deckName, setDeckName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deckName || !file) return

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Here you would handle the file upload and deck creation
    console.log("Creating deck:", { deckName, fileName: file.name })

    setLoading(false)
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Deck Name</label>
        <input
          type="text"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          placeholder="e.g., Calculus Fundamentals"
          className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white placeholder-[#8a8a8a] focus:outline-none focus:border-[#C4F042]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Upload Module</label>
        <label className="flex items-center justify-center gap-2 bg-[#1a1a1a] border border-dashed border-[#3a3a3a] rounded-lg p-6 cursor-pointer hover:border-[#C4F042] transition-colors">
          <Upload className="w-4 h-4 text-[#C4F042]" />
          <div className="text-center">
            <p className="text-sm font-medium">{file ? file.name : "Choose file or drag and drop"}</p>
            <p className="text-xs text-[#8a8a8a] mt-1">PDF, DOC, or DOCX</p>
          </div>
          <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" required />
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-[#3a3a3a] rounded-lg text-white hover:bg-[#1a1a1a] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !deckName || !file}
          className="flex-1 px-4 py-2 bg-[#C4F042] text-[#1a1a1a] rounded-lg font-medium hover:bg-[#d4ff52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Deck"}
        </button>
      </div>
    </form>
  )
}
