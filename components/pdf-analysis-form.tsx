import * as React from "react";
import { PdfUpload } from "@/components/pdf-upload";
import { Button } from "@/components/ui/button";

interface PdfAnalysisFormProps {
  onAnalyze: (files: { pdf1: File | null; pdf2: File | null }) => void;
  isAnalyzing: boolean;
}

export function PdfAnalysisForm({ onAnalyze, isAnalyzing }: PdfAnalysisFormProps) {
  const [pdf1, setPdf1] = React.useState<File | null>(null);
  const [pdf2, setPdf2] = React.useState<File | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdf1 || !pdf2) {
      alert("Please upload both PDF files");
      return;
    }
    onAnalyze({ pdf1, pdf2 });
  };

  return (
    <form onSubmit={handleAnalyze} className="w-full max-w-2xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">PDF Comparison Tool</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PdfUpload 
          label="First PDF Document" 
          onFileChange={setPdf1} 
          selectedFile={pdf1}
          required
        />
        
        <PdfUpload 
          label="Second PDF Document" 
          onFileChange={setPdf2} 
          selectedFile={pdf2}
          required
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          type="submit" 
          disabled={!pdf1 || !pdf2 || isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze PDFs"}
        </Button>
      </div>
    </form>
  );
} 