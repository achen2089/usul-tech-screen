'use client';

import * as React from "react";
import { PdfAnalysisForm } from "@/components/pdf-analysis-form";
import { PdfAnalysisResults, PdfAnalysisResult } from "@/components/pdf-analysis-results";
import { extractPdfContent } from "@/lib/ai/extract";
import { BudgetItem } from "@/lib/ai/schemas";

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

  const handleAnalyze = async (
    { pdf1, pdf2 }: { pdf1: File | null; pdf2: File | null },
    selectedClassification: string
  ) => {
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
      
      // Extract content from PDFs using FormData, passing the selected classification
      const pdf1Data = await extractPdfContent(formData1, selectedClassification);
      const pdf2Data = await extractPdfContent(formData2, selectedClassification);
      
      // Find the items for the selected classification
      const pdf1Item = pdf1Data.items.find(item => 
        item.classification.toLowerCase() === selectedClassification.toLowerCase()
      );
      
      const pdf2Item = pdf2Data.items.find(item => 
        item.classification.toLowerCase() === selectedClassification.toLowerCase()
      );
      
      // Calculate all differences for the result object
      const thisMonthDiff = pdf1Item && pdf2Item && pdf1Item.thisMonth && pdf2Item.thisMonth 
        ? pdf1Item.thisMonth - pdf2Item.thisMonth 
        : null;
      const thisMonthPercentDiff = thisMonthDiff !== null && pdf2Item?.thisMonth 
        ? ((thisMonthDiff / pdf2Item.thisMonth) * 100).toFixed(2) 
        : null;
      
      const ytdDiff = pdf1Item && pdf2Item && pdf1Item.fiscalYearToDate && pdf2Item.fiscalYearToDate 
        ? pdf1Item.fiscalYearToDate - pdf2Item.fiscalYearToDate 
        : null;
      const ytdPercentDiff = ytdDiff !== null && pdf2Item?.fiscalYearToDate 
        ? ((ytdDiff / pdf2Item.fiscalYearToDate) * 100).toFixed(2) 
        : null;
      
      const priorDiff = pdf1Item && pdf2Item && pdf1Item.priorPeriodYearToDate && pdf2Item.priorPeriodYearToDate 
        ? pdf1Item.priorPeriodYearToDate - pdf2Item.priorPeriodYearToDate 
        : null;
      const priorPercentDiff = priorDiff !== null && pdf2Item?.priorPeriodYearToDate 
        ? ((priorDiff / pdf2Item.priorPeriodYearToDate) * 100).toFixed(2) 
        : null;
      
      const budgetDiff = pdf1Item && pdf2Item && pdf1Item.budgetEstimates && pdf2Item.budgetEstimates 
        ? pdf1Item.budgetEstimates - pdf2Item.budgetEstimates 
        : null;
      const budgetPercentDiff = budgetDiff !== null && pdf2Item?.budgetEstimates 
        ? ((budgetDiff / pdf2Item.budgetEstimates) * 100).toFixed(2) 
        : null;
      
      // Create results without generating a summary
      const analysisResult: PdfAnalysisResult = {
        pdf1Data,
        pdf2Data,
        selectedClassification,
        comparisonItems: {
          pdf1Item: pdf1Item || null,
          pdf2Item: pdf2Item || null,
        },
        differences: {
          thisMonth: {
            absoluteDiff: thisMonthDiff,
            percentageDiff: thisMonthPercentDiff
          },
          fiscalYearToDate: {
            absoluteDiff: ytdDiff,
            percentageDiff: ytdPercentDiff
          },
          priorPeriod: {
            absoluteDiff: priorDiff,
            percentageDiff: priorPercentDiff
          },
          budgetEstimates: {
            absoluteDiff: budgetDiff,
            percentageDiff: budgetPercentDiff
          }
        }
      };
      
      setResults(analysisResult);
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
              <div className="w-12 h-12 border-4 border-t-gray-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-medium">Analyzing Budget Data...</p>
              <p className="text-sm text-gray-500">This may take a moment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 