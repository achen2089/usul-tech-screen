'use client';

import * as React from "react";
import { PdfAnalysisForm } from "@/components/pdf-analysis-form";
import { PdfAnalysisResults, PdfAnalysisResult } from "@/components/pdf-analysis-results";
import { extractPdfContent, extractPdfFromBuffer } from "@/lib/ai/extract";
import { BudgetData } from "@/lib/ai/schemas";

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
    selectedDepartment: string
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
      
      // Extract content from PDFs using FormData
      const pdf1Data = await extractPdfContent(formData1);
      const pdf2Data = await extractPdfContent(formData2);
      
      // Find the selected department data in both PDFs
      const findDepartmentData = (data: BudgetData, department: string) => {
        // Check if we're looking for budget receipts or outlays
        if (department === "Budget Outlays" || department === "Budget Receipts") {
          return {
            category: department,
            items: department === "Budget Outlays" ? data.outlays : data.receipts,
            total: department === "Budget Outlays" ? data.totalOutlays : data.totalReceipts
          };
        }
        
        // Otherwise, find the specific department in the outlays
        const departmentItem = data.outlays.find(item => 
          item.classification.toLowerCase() === department.toLowerCase()
        );
        
        return {
          category: department,
          items: departmentItem ? [departmentItem] : [],
          total: null
        };
      };
      
      const pdf1DepartmentData = findDepartmentData(pdf1Data, selectedDepartment);
      const pdf2DepartmentData = findDepartmentData(pdf2Data, selectedDepartment);
      
      // Compare the data and generate a summary
      const generateSummary = () => {
        let summary = `# Comparison of ${selectedDepartment} between documents\n\n`;
        
        summary += `## ${pdf1.name} vs ${pdf2.name}\n\n`;
        
        if (pdf1DepartmentData.items.length === 0 || pdf2DepartmentData.items.length === 0) {
          summary += `Could not find data for "${selectedDepartment}" in one or both documents.\n\n`;
          return summary;
        }
        
        // Add a table comparing the values
        summary += "| Category | This Month | Fiscal Year to Date | Prior Period | Budget Estimates |\n";
        summary += "|----------|------------|---------------------|--------------|------------------|\n";
        
        // Add rows for each item
        pdf1DepartmentData.items.forEach(item => {
          const matchingItem = pdf2DepartmentData.items.find(i => 
            i.classification === item.classification
          );
          
          if (matchingItem) {
            summary += `| ${item.classification} (${pdf1.name}) | ${item.thisMonth || 'N/A'} | ${item.fiscalYearToDate || 'N/A'} | ${item.priorPeriodYearToDate || 'N/A'} | ${item.budgetEstimates || 'N/A'} |\n`;
            summary += `| ${matchingItem.classification} (${pdf2.name}) | ${matchingItem.thisMonth || 'N/A'} | ${matchingItem.fiscalYearToDate || 'N/A'} | ${matchingItem.priorPeriodYearToDate || 'N/A'} | ${matchingItem.budgetEstimates || 'N/A'} |\n`;
            
            // Calculate differences
            if (item.thisMonth && matchingItem.thisMonth) {
              const diff = item.thisMonth - matchingItem.thisMonth;
              const percentDiff = ((diff / matchingItem.thisMonth) * 100).toFixed(2);
              summary += `| Difference | ${diff} (${diff > 0 ? '+' : ''}${percentDiff}%) | `;
              
              if (item.fiscalYearToDate && matchingItem.fiscalYearToDate) {
                const ytdDiff = item.fiscalYearToDate - matchingItem.fiscalYearToDate;
                const ytdPercentDiff = ((ytdDiff / matchingItem.fiscalYearToDate) * 100).toFixed(2);
                summary += `${ytdDiff} (${ytdDiff > 0 ? '+' : ''}${ytdPercentDiff}%) | `;
              } else {
                summary += `N/A | `;
              }
              
              if (item.priorPeriodYearToDate && matchingItem.priorPeriodYearToDate) {
                const priorDiff = item.priorPeriodYearToDate - matchingItem.priorPeriodYearToDate;
                const priorPercentDiff = ((priorDiff / matchingItem.priorPeriodYearToDate) * 100).toFixed(2);
                summary += `${priorDiff} (${priorDiff > 0 ? '+' : ''}${priorPercentDiff}%) | `;
              } else {
                summary += `N/A | `;
              }
              
              if (item.budgetEstimates && matchingItem.budgetEstimates) {
                const budgetDiff = item.budgetEstimates - matchingItem.budgetEstimates;
                const budgetPercentDiff = ((budgetDiff / matchingItem.budgetEstimates) * 100).toFixed(2);
                summary += `${budgetDiff} (${budgetDiff > 0 ? '+' : ''}${budgetPercentDiff}%) |\n`;
              } else {
                summary += `N/A |\n`;
              }
            }
          }
        });
        
        // Add totals if available
        if (pdf1DepartmentData.total && pdf2DepartmentData.total) {
          summary += `\n## Totals\n\n`;
          summary += "| Document | This Month | Fiscal Year to Date | Prior Period | Budget Estimates |\n";
          summary += "|----------|------------|---------------------|--------------|------------------|\n";
          summary += `| ${pdf1.name} | ${pdf1DepartmentData.total.thisMonth || 'N/A'} | ${pdf1DepartmentData.total.fiscalYearToDate || 'N/A'} | ${pdf1DepartmentData.total.priorPeriodYearToDate || 'N/A'} | ${pdf1DepartmentData.total.budgetEstimates || 'N/A'} |\n`;
          summary += `| ${pdf2.name} | ${pdf2DepartmentData.total.thisMonth || 'N/A'} | ${pdf2DepartmentData.total.fiscalYearToDate || 'N/A'} | ${pdf2DepartmentData.total.priorPeriodYearToDate || 'N/A'} | ${pdf2DepartmentData.total.budgetEstimates || 'N/A'} |\n`;
        }
        
        return summary;
      };
      
      const summary = generateSummary();
      
      // Create results
      const analysisResult: PdfAnalysisResult = {
        similarity: 0, // Placeholder
        commonTopics: [selectedDepartment],
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