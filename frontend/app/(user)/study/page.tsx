"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function StudyPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const difficulty = searchParams.get("difficulty");
  const fileName = searchParams.get("fileName");

  const [explanation, setExplanation] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!explanation.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/study/feynman-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concept: topic,
          explanation,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get feedback");
      }

      const text = await response.text();
      setFeedback(text);
    } catch (error) {
      console.error("Error:", error);
      setFeedback("Error: Could not get feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalogy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/study/analogy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concept: topic,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get analogy");
      }

      const text = await response.text();
      setFeedback("💡 ANALOGY: " + text);
    } catch (error) {
      console.error("Error:", error);
      setFeedback("Error: Could not generate analogy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!topic) {
    return <div>Please select a topic to study.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="text-[#C4F042] hover:text-[#b3d93c] mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-2">Study: {topic}</h1>
        <p className="text-[#8a8a8a]">Difficulty: {difficulty}</p>
      </div>

      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Explain this concept in simple terms
        </h2>

        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Write your explanation here..."
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-[#5a5a5a] focus:border-[#C4F042] focus:outline-none transition-colors min-h-[200px] resize-none"
        />

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !explanation.trim()}
            className="bg-[#C4F042] hover:bg-[#b3d93c] text-black px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Analyzing..." : "Submit Explanation"}
          </button>

          <button
            onClick={handleAnalogy}
            disabled={isLoading}
            className="bg-[#2196f3] hover:bg-[#1976d2] text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating..." : "Get Analogy"}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Feedback</h3>
          <p className="text-[#8a8a8a] whitespace-pre-wrap">{feedback}</p>
        </div>
      )}
    </div>
  );
}