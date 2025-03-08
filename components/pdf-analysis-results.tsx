import * as React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { BudgetData, BudgetItem } from "@/lib/ai/schemas";

// Updated interface to better reflect the actual data structure
export interface PdfAnalysisResult {
  // Document metadata
  pdf1Data: BudgetData;
  pdf2Data: BudgetData;
  
  // Comparison data
  selectedClassification: string;
  comparisonItems: {
    pdf1Item: BudgetItem | null;
    pdf2Item: BudgetItem | null;
  };
  
  // Calculated differences
  differences: {
    thisMonth: {
      absoluteDiff: number | null;
      percentageDiff: string | null;
    };
    fiscalYearToDate: {
      absoluteDiff: number | null;
      percentageDiff: string | null;
    };
    priorPeriod: {
      absoluteDiff: number | null;
      percentageDiff: string | null;
    };
    budgetEstimates: {
      absoluteDiff: number | null;
      percentageDiff: string | null;
    };
  };
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

  const { pdf1Data, pdf2Data, selectedClassification, comparisonItems, differences } = results;
  const { pdf1Item, pdf2Item } = comparisonItems;

  // Helper function to format numbers with commas
  const formatNumber = (num: number | null) => {
    if (num === null) return 'N/A';
    return `$${num.toLocaleString()}`;
  };

  // Helper function to determine trend icon and color
  const getTrendInfo = (diff: number | null) => {
    if (diff === null) return { icon: null, color: '', bgColor: '' };
    if (diff > 0) return { 
      icon: <TrendingUp className="h-4 w-4" />, 
      color: 'text-green-700 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    };
    if (diff < 0) return { 
      icon: <TrendingDown className="h-4 w-4" />, 
      color: 'text-red-700 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    };
    return { icon: null, color: '', bgColor: '' };
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gradient-to-r ">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Budget Classification Comparison
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Comparison
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-4 gap-4">
          <Badge variant="outline" className="px-4 py-2 text-base font-medium flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm">
            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
            <span className="font-semibold">Document 1:</span> 
            <span className="truncate max-w-[200px]">{pdf1Name}</span>
          </Badge>
          <ArrowRight className="h-5 w-5 text-gray-400" />
          <Badge variant="outline" className="px-4 py-2 text-base font-medium flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="font-semibold">Document 2:</span> 
            <span className="truncate max-w-[200px]">{pdf2Name}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-inner border border-gray-100 dark:border-gray-800">
          <div className="p-6 overflow-auto max-h-[70vh]">
            {/* Classification Title */}
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b pb-2 mb-4">
              Comparison of {selectedClassification}
            </h1>

            {/* Error message if items not found */}
            {(!pdf1Item || !pdf2Item) ? (
              <div className="my-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-yellow-800 dark:text-yellow-200">
                Could not find data for "{selectedClassification}" in one or both documents.
              </div>
            ) : (
              <>
                {/* Individual Document Data */}
                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mt-6 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  Individual Document Data
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Document 1 */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400 border-l-4 border-gray-400 pl-2 mb-3">
                      Document 1: {pdf1Name}
                    </h3>
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Category</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">This Month</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold text-gray-700 dark:text-gray-300">
                            {formatNumber(pdf1Item?.thisMonth)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Fiscal Year to Date</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold text-gray-700 dark:text-gray-300">
                            {formatNumber(pdf1Item?.fiscalYearToDate)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Prior Period</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold text-gray-700 dark:text-gray-300">
                            {formatNumber(pdf1Item?.priorPeriodYearToDate)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Budget Estimates</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold text-gray-700 dark:text-gray-300">
                            {formatNumber(pdf1Item?.budgetEstimates)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Document 2 */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400 border-l-4 border-gray-400 pl-2 mb-3">
                      Document 2: {pdf2Name}
                    </h3>
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Category</th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">This Month</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold text-gray-700 dark:text-gray-300">
                            {formatNumber(pdf2Item?.thisMonth)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Fiscal Year to Date</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold text-gray-700 dark:text-gray-300">
                            {formatNumber(pdf2Item?.fiscalYearToDate)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Prior Period</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold text-gray-700 dark:text-gray-300">
                            {formatNumber(pdf2Item?.priorPeriodYearToDate)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Budget Estimates</td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold text-gray-700 dark:text-gray-300">
                            {formatNumber(pdf2Item?.budgetEstimates)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mt-8 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  Side-by-Side Comparison
                </h2>

                <div className="overflow-x-auto my-6 rounded-lg shadow-md">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Category</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Document 1</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Document 2</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">Difference</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-bold">% Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* This Month */}
                      <tr className="bg-gray-50 dark:bg-gray-800 font-semibold">
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold">This Month</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{formatNumber(pdf1Item?.thisMonth)}</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{formatNumber(pdf2Item?.thisMonth)}</td>
                        <td className={`border border-gray-300 dark:border-gray-700 px-4 py-2 ${differences.thisMonth.absoluteDiff !== null ? getTrendInfo(differences.thisMonth.absoluteDiff).bgColor : ''}`}>
                          {differences.thisMonth.absoluteDiff !== null ? (
                            <div className={`flex items-center gap-1 ${getTrendInfo(differences.thisMonth.absoluteDiff).color}`}>
                              {getTrendInfo(differences.thisMonth.absoluteDiff).icon}
                              <span className="font-bold">{formatNumber(differences.thisMonth.absoluteDiff)}</span>
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td className={`border border-gray-300 dark:border-gray-700 px-4 py-2 ${differences.thisMonth.absoluteDiff !== null ? getTrendInfo(differences.thisMonth.absoluteDiff).bgColor : ''}`}>
                          {differences.thisMonth.percentageDiff !== null ? (
                            <div className={`flex items-center gap-1 ${differences.thisMonth.absoluteDiff !== null ? getTrendInfo(differences.thisMonth.absoluteDiff).color : ''}`}>
                              {differences.thisMonth.absoluteDiff !== null && getTrendInfo(differences.thisMonth.absoluteDiff).icon}
                              <span className="font-bold">
                                {differences.thisMonth.absoluteDiff !== null && differences.thisMonth.absoluteDiff > 0 ? '+' : ''}{differences.thisMonth.percentageDiff}%
                              </span>
                            </div>
                          ) : 'N/A'}
                        </td>
                      </tr>

                      {/* Fiscal Year to Date */}
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold">Fiscal Year to Date</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{formatNumber(pdf1Item?.fiscalYearToDate)}</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{formatNumber(pdf2Item?.fiscalYearToDate)}</td>
                        <td className={`border border-gray-300 dark:border-gray-700 px-4 py-2 ${differences.fiscalYearToDate.absoluteDiff !== null ? getTrendInfo(differences.fiscalYearToDate.absoluteDiff).bgColor : ''}`}>
                          {differences.fiscalYearToDate.absoluteDiff !== null ? (
                            <div className={`flex items-center gap-1 ${getTrendInfo(differences.fiscalYearToDate.absoluteDiff).color}`}>
                              {getTrendInfo(differences.fiscalYearToDate.absoluteDiff).icon}
                              <span className="font-bold">{formatNumber(differences.fiscalYearToDate.absoluteDiff)}</span>
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td className={`border border-gray-300 dark:border-gray-700 px-4 py-2 ${differences.fiscalYearToDate.absoluteDiff !== null ? getTrendInfo(differences.fiscalYearToDate.absoluteDiff).bgColor : ''}`}>
                          {differences.fiscalYearToDate.percentageDiff !== null ? (
                            <div className={`flex items-center gap-1 ${differences.fiscalYearToDate.absoluteDiff !== null ? getTrendInfo(differences.fiscalYearToDate.absoluteDiff).color : ''}`}>
                              {differences.fiscalYearToDate.absoluteDiff !== null && getTrendInfo(differences.fiscalYearToDate.absoluteDiff).icon}
                              <span className="font-bold">
                                {differences.fiscalYearToDate.absoluteDiff !== null && differences.fiscalYearToDate.absoluteDiff > 0 ? '+' : ''}{differences.fiscalYearToDate.percentageDiff}%
                              </span>
                            </div>
                          ) : 'N/A'}
                        </td>
                      </tr>

                      {/* Prior Period */}
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold">Prior Period</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{formatNumber(pdf1Item?.priorPeriodYearToDate)}</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{formatNumber(pdf2Item?.priorPeriodYearToDate)}</td>
                        <td className={`border border-gray-300 dark:border-gray-700 px-4 py-2 ${differences.priorPeriod.absoluteDiff !== null ? getTrendInfo(differences.priorPeriod.absoluteDiff).bgColor : ''}`}>
                          {differences.priorPeriod.absoluteDiff !== null ? (
                            <div className={`flex items-center gap-1 ${getTrendInfo(differences.priorPeriod.absoluteDiff).color}`}>
                              {getTrendInfo(differences.priorPeriod.absoluteDiff).icon}
                              <span className="font-bold">{formatNumber(differences.priorPeriod.absoluteDiff)}</span>
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td className={`border border-gray-300 dark:border-gray-700 px-4 py-2 ${differences.priorPeriod.absoluteDiff !== null ? getTrendInfo(differences.priorPeriod.absoluteDiff).bgColor : ''}`}>
                          {differences.priorPeriod.percentageDiff !== null ? (
                            <div className={`flex items-center gap-1 ${differences.priorPeriod.absoluteDiff !== null ? getTrendInfo(differences.priorPeriod.absoluteDiff).color : ''}`}>
                              {differences.priorPeriod.absoluteDiff !== null && getTrendInfo(differences.priorPeriod.absoluteDiff).icon}
                              <span className="font-bold">
                                {differences.priorPeriod.absoluteDiff !== null && differences.priorPeriod.absoluteDiff > 0 ? '+' : ''}{differences.priorPeriod.percentageDiff}%
                              </span>
                            </div>
                          ) : 'N/A'}
                        </td>
                      </tr>

                      {/* Budget Estimates */}
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-bold">Budget Estimates</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{formatNumber(pdf1Item?.budgetEstimates)}</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{formatNumber(pdf2Item?.budgetEstimates)}</td>
                        <td className={`border border-gray-300 dark:border-gray-700 px-4 py-2 ${differences.budgetEstimates.absoluteDiff !== null ? getTrendInfo(differences.budgetEstimates.absoluteDiff).bgColor : ''}`}>
                          {differences.budgetEstimates.absoluteDiff !== null ? (
                            <div className={`flex items-center gap-1 ${getTrendInfo(differences.budgetEstimates.absoluteDiff).color}`}>
                              {getTrendInfo(differences.budgetEstimates.absoluteDiff).icon}
                              <span className="font-bold">{formatNumber(differences.budgetEstimates.absoluteDiff)}</span>
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td className={`border border-gray-300 dark:border-gray-700 px-4 py-2 ${differences.budgetEstimates.absoluteDiff !== null ? getTrendInfo(differences.budgetEstimates.absoluteDiff).bgColor : ''}`}>
                          {differences.budgetEstimates.percentageDiff !== null ? (
                            <div className={`flex items-center gap-1 ${differences.budgetEstimates.absoluteDiff !== null ? getTrendInfo(differences.budgetEstimates.absoluteDiff).color : ''}`}>
                              {differences.budgetEstimates.absoluteDiff !== null && getTrendInfo(differences.budgetEstimates.absoluteDiff).icon}
                              <span className="font-bold">
                                {differences.budgetEstimates.absoluteDiff !== null && differences.budgetEstimates.absoluteDiff > 0 ? '+' : ''}{differences.budgetEstimates.percentageDiff}%
                              </span>
                            </div>
                          ) : 'N/A'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Key Insights */}
                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mt-8 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                  Key Insights
                </h2>

                <ul className="list-disc pl-5 space-y-2 my-4">
                  {differences.thisMonth.absoluteDiff !== null && differences.thisMonth.percentageDiff !== null && (
                    <li className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className={getTrendInfo(differences.thisMonth.absoluteDiff).color}>
                          {getTrendInfo(differences.thisMonth.absoluteDiff).icon}
                        </span>
                        <span>
                          This month's {selectedClassification} is <strong className={`font-bold ${getTrendInfo(differences.thisMonth.absoluteDiff).color}`}>{formatNumber(Math.abs(differences.thisMonth.absoluteDiff))}</strong> (<span className={getTrendInfo(differences.thisMonth.absoluteDiff).color}>{differences.thisMonth.absoluteDiff > 0 ? '+' : ''}{differences.thisMonth.percentageDiff}%</span>) 
                          {differences.thisMonth.absoluteDiff > 0 ? ' higher than ' : ' lower than '} 
                          the comparison document.
                        </span>
                      </div>
                    </li>
                  )}

                  {differences.fiscalYearToDate.absoluteDiff !== null && differences.fiscalYearToDate.percentageDiff !== null && (
                    <li className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className={getTrendInfo(differences.fiscalYearToDate.absoluteDiff).color}>
                          {getTrendInfo(differences.fiscalYearToDate.absoluteDiff).icon}
                        </span>
                        <span>
                          Fiscal year to date {selectedClassification} is <strong className={`font-bold ${getTrendInfo(differences.fiscalYearToDate.absoluteDiff).color}`}>{formatNumber(Math.abs(differences.fiscalYearToDate.absoluteDiff))}</strong> (<span className={getTrendInfo(differences.fiscalYearToDate.absoluteDiff).color}>{differences.fiscalYearToDate.absoluteDiff > 0 ? '+' : ''}{differences.fiscalYearToDate.percentageDiff}%</span>) 
                          {differences.fiscalYearToDate.absoluteDiff > 0 ? ' higher than ' : ' lower than '} 
                          the comparison document.
                        </span>
                      </div>
                    </li>
                  )}

                  {differences.budgetEstimates.absoluteDiff !== null && differences.budgetEstimates.percentageDiff !== null && (
                    <li className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className={getTrendInfo(differences.budgetEstimates.absoluteDiff).color}>
                          {getTrendInfo(differences.budgetEstimates.absoluteDiff).icon}
                        </span>
                        <span>
                          Budget estimates for {selectedClassification} are <strong className={`font-bold ${getTrendInfo(differences.budgetEstimates.absoluteDiff).color}`}>{formatNumber(Math.abs(differences.budgetEstimates.absoluteDiff))}</strong> (<span className={getTrendInfo(differences.budgetEstimates.absoluteDiff).color}>{differences.budgetEstimates.absoluteDiff > 0 ? '+' : ''}{differences.budgetEstimates.percentageDiff}%</span>) 
                          {differences.budgetEstimates.absoluteDiff > 0 ? ' higher than ' : ' lower than '} 
                          the comparison document.
                        </span>
                      </div>
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 