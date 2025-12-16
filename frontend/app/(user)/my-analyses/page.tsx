"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DocumentAnalysis {
  id: number;
  fileName: string;
  fileType: string;
  topics: string;
  qualityAnalysis: string;
  processedAt: string;
}

export default function MyAnalysesPage() {
  const [analyses, setAnalyses] = useState<DocumentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/documents/analyses");
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data);
      }
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const parseTopics = (topicsString: string) => {
    try {
      // Remove quality analysis part if present
      const cleanTopics = topicsString.split('\n\nQuality Analysis:')[0];
      const topics = JSON.parse(cleanTopics);
      return topics;
    } catch {
      return [topicsString];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#24261B] flex items-center justify-center">
        <div className="text-white">Loading your analyses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#24261B] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-[#C4F042] hover:text-[#b3d93c] mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">My Document Analyses</h1>
          <p className="text-[#8a8a8a]">View all your processed documents and their analysis results</p>
        </div>

        {analyses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-white mb-4">No analyses yet</h2>
            <p className="text-[#8a8a8a] mb-8">Upload and analyze your first document to get started!</p>
            <Link href="/create-deck" className="bg-[#C4F042] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#b3d93c] inline-block">
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{analysis.fileName}</h3>
                    <p className="text-[#8a8a8a] text-sm">
                      {analysis.fileType.toUpperCase()} • Processed {formatDate(analysis.processedAt)}
                    </p>
                  </div>
                  <Link
                    href={`/study?topic=${encodeURIComponent(parseTopics(analysis.topics)[0] || 'General Study')}&difficulty=medium&fileName=${encodeURIComponent(analysis.fileName)}&analysisId=${analysis.id}`}
                    className="bg-[#C4F042] hover:bg-[#b3d93c] text-black px-4 py-2 rounded-lg font-medium text-sm"
                  >
                    Study This
                  </Link>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-medium text-white mb-2">Key Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {parseTopics(analysis.topics).map((topic: string, index: number) => (
                      <span
                        key={index}
                        className="bg-[#1a1a1a] text-[#C4F042] px-3 py-1 rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {analysis.qualityAnalysis && (
                  <div className="text-sm text-[#8a8a8a]">
                    <strong>Quality Analysis:</strong> {analysis.qualityAnalysis}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}