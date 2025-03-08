'use client';

import * as React from "react";
import { PdfAnalysisForm } from "@/components/pdf-analysis-form";
import { PdfAnalysisResults, PdfAnalysisResult } from "@/components/pdf-analysis-results";
import { extractPdfContent, extractPdfFromBuffer } from "@/lib/ai/extract";

export function PdfAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [results, setResults] = React.useState<PdfAnalysisResult | null>(null);
  const [files, setFiles] = React.useState<{
    pdf1: File | null;
    pdf2: File | null;
    pdf1Name: string;
    pdf2Name: string;
  }>({
    pdf1: null,
    pdf2: null,
    pdf1Name: "",
    pdf2Name: "",
  });

  const handleAnalyze = async ({ pdf1, pdf2 }: { pdf1: File | null; pdf2: File | null }) => {
    if (!pdf1 || !pdf2) return;
    
    try {
      setIsAnalyzing(true);
      setFiles({
        pdf1,
        pdf2,
        pdf1Name: pdf1.name,
        pdf2Name: pdf2.name,
      });
      
      // Create FormData for each PDF
      const formData1 = new FormData();
      formData1.append('pdf', pdf1);
      
      const formData2 = new FormData();
      formData2.append('pdf', pdf2);
      
      // Extract content from PDFs using FormData
      const pdf1Content = await extractPdfContent(formData1);
      const pdf2Content = await extractPdfContent(formData2);
      
      // Create simple results with just the extracted content
      const simpleResults: PdfAnalysisResult = {
        similarity: 0, // Placeholder
        commonTopics: ["See extracted content below"],
        differences: {
          pdf1Only: [],
          pdf2Only: []
        },
        summary: `
EXTRACTED CONTENT FROM ${pdf1.name}:
${pdf1Content}

EXTRACTED CONTENT FROM ${pdf2.name}:
${pdf2Content}
        `
      };
      
      setResults(simpleResults);
    } catch (error) {
      console.error("Error analyzing PDFs:", error);
      alert("An error occurred while analyzing the PDFs. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setFiles({
      pdf1: null,
      pdf2: null,
      pdf1Name: "",
      pdf2Name: "",
    });
  };

  return (
    <div className="w-full py-8">
      {!results ? (
        <PdfAnalysisForm 
          onAnalyze={handleAnalyze} 
          isAnalyzing={isAnalyzing} 
        />
      ) : (
        <PdfAnalysisResults 
          results={results}
          pdf1Name={files.pdf1Name}
          pdf2Name={files.pdf2Name}
          onReset={handleReset}
        />
      )}
      
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-medium">Extracting PDF Content...</p>
              <p className="text-sm text-gray-500">This may take a moment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 