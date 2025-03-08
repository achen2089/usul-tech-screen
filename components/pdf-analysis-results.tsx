import * as React from "react";
import { Button } from "./ui/button";
import ReactMarkdown from 'react-markdown';

// This is a dummy type for the analysis results
// Replace this with your actual result type when implementing the real analysis
export interface PdfAnalysisResult {
  similarity: number;
  commonTopics: string[];
  differences: {
    pdf1Only: string[];
    pdf2Only: string[];
  };
  summary: string;
}

interface PdfAnalysisResultsProps {
  results: PdfAnalysisResult | null;
  pdf1Name: string;
  pdf2Name: string;
  onReset: () => void;
}

export function PdfAnalysisResults({
  results,
  pdf1Name,
  pdf2Name,
  onReset,
}: PdfAnalysisResultsProps) {
  if (!results) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Budget Classification Comparison</h2>
        <Button variant="outline" size="sm" onClick={onReset}>
          New Comparison
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700 dark:text-gray-300">Document 1:</span> {pdf1Name}
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700 dark:text-gray-300">Document 2:</span> {pdf2Name}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
          <div className="text-sm overflow-auto max-h-[600px] prose dark:prose-invert max-w-none">
            <ReactMarkdown>
              {results.summary}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
} 