'use client';

import * as React from "react";
import { PdfAnalysisForm } from "@/components/pdf-analysis-form";
import { PdfAnalysisResults, PdfAnalysisResult } from "@/components/pdf-analysis-results";
import { extractPdfContent, extractPdfFromBuffer } from "@/lib/ai/extract";
import { BudgetData, BudgetItem } from "@/lib/ai/schemas";

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
      
      // Generate a summary comparing the data
      const generateSummary = () => {
        let summary = `# Comparison of ${selectedClassification}\n\n`;
        
        // Add period/year information if available
        if (pdf1Data.period || pdf1Data.year) {
          summary += `## ${pdf1Data.title || 'Budget Data'}\n`;
          summary += `### ${pdf1Data.period || ''} ${pdf1Data.year || ''}\n\n`;
        }
        
        // Find the items for the selected classification
        const pdf1Item = pdf1Data.items.find(item => 
          item.classification.toLowerCase() === selectedClassification.toLowerCase()
        );
        
        const pdf2Item = pdf2Data.items.find(item => 
          item.classification.toLowerCase() === selectedClassification.toLowerCase()
        );
        
        if (!pdf1Item || !pdf2Item) {
          summary += `Could not find data for "${selectedClassification}" in one or both documents.\n\n`;
          return summary;
        }
        
        // Add a table comparing the values
        summary += "| Document | This Month | Fiscal Year to Date | Prior Period | Budget Estimates |\n";
        summary += "|----------|------------|---------------------|--------------|------------------|\n";
        summary += `| ${pdf1.name} | ${pdf1Item.thisMonth?.toLocaleString() || 'N/A'} | ${pdf1Item.fiscalYearToDate?.toLocaleString() || 'N/A'} | ${pdf1Item.priorPeriodYearToDate?.toLocaleString() || 'N/A'} | ${pdf1Item.budgetEstimates?.toLocaleString() || 'N/A'} |\n`;
        summary += `| ${pdf2.name} | ${pdf2Item.thisMonth?.toLocaleString() || 'N/A'} | ${pdf2Item.fiscalYearToDate?.toLocaleString() || 'N/A'} | ${pdf2Item.priorPeriodYearToDate?.toLocaleString() || 'N/A'} | ${pdf2Item.budgetEstimates?.toLocaleString() || 'N/A'} |\n`;
        
        // Calculate differences
        if (pdf1Item.thisMonth && pdf2Item.thisMonth) {
          const thisMonthDiff = pdf1Item.thisMonth - pdf2Item.thisMonth;
          const thisMonthPercentDiff = ((thisMonthDiff / pdf2Item.thisMonth) * 100).toFixed(2);
          
          const ytdDiff = pdf1Item.fiscalYearToDate && pdf2Item.fiscalYearToDate 
            ? pdf1Item.fiscalYearToDate - pdf2Item.fiscalYearToDate 
            : null;
          const ytdPercentDiff = ytdDiff && pdf2Item.fiscalYearToDate 
            ? ((ytdDiff / pdf2Item.fiscalYearToDate) * 100).toFixed(2) 
            : null;
          
          const priorDiff = pdf1Item.priorPeriodYearToDate && pdf2Item.priorPeriodYearToDate 
            ? pdf1Item.priorPeriodYearToDate - pdf2Item.priorPeriodYearToDate 
            : null;
          const priorPercentDiff = priorDiff && pdf2Item.priorPeriodYearToDate 
            ? ((priorDiff / pdf2Item.priorPeriodYearToDate) * 100).toFixed(2) 
            : null;
          
          const budgetDiff = pdf1Item.budgetEstimates && pdf2Item.budgetEstimates 
            ? pdf1Item.budgetEstimates - pdf2Item.budgetEstimates 
            : null;
          const budgetPercentDiff = budgetDiff && pdf2Item.budgetEstimates 
            ? ((budgetDiff / pdf2Item.budgetEstimates) * 100).toFixed(2) 
            : null;
          
          summary += `| **Difference** | ${thisMonthDiff.toLocaleString()} (${thisMonthDiff > 0 ? '+' : ''}${thisMonthPercentDiff}%) | `;
          
          if (ytdDiff !== null) {
            summary += `${ytdDiff.toLocaleString()} (${ytdDiff > 0 ? '+' : ''}${ytdPercentDiff}%) | `;
          } else {
            summary += `N/A | `;
          }
          
          if (priorDiff !== null) {
            summary += `${priorDiff.toLocaleString()} (${priorDiff > 0 ? '+' : ''}${priorPercentDiff}%) | `;
          } else {
            summary += `N/A | `;
          }
          
          if (budgetDiff !== null) {
            summary += `${budgetDiff.toLocaleString()} (${budgetDiff > 0 ? '+' : ''}${budgetPercentDiff}%) |\n`;
          } else {
            summary += `N/A |\n`;
          }
        }
        
        return summary;
      };
      
      const summary = generateSummary();
      
      // Create results
      const analysisResult: PdfAnalysisResult = {
        similarity: 0, // Placeholder
        commonTopics: [selectedClassification],
        differences: {
          pdf1Only: [],
          pdf2Only: []
        },
        summary
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
              <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-medium">Analyzing Budget Data...</p>
              <p className="text-sm text-gray-500">This may take a moment</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 