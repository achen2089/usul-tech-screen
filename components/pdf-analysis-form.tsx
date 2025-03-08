import * as React from "react";
import { PdfUpload } from "@/components/pdf-upload";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PdfAnalysisFormProps {
  onAnalyze: (files: { pdf1: File | null; pdf2: File | null }, department: string) => void;
  isAnalyzing: boolean;
}

const departments = [
  "Budget Receipts",
  "Budget Outlays",
  "Legislative Branch",
  "Judicial Branch",
  "Department of Agriculture",
  "Department of Commerce",
  "Department of Defense--Military Programs",
  "Department of Education",
  "Department of Energy",
  "Department of Health and Human Services",
  "Department of Homeland Security",
  "Department of Housing and Urban Development",
  "Department of the Interior",
  "Department of Justice",
  "Department of Labor",
  "Department of State",
  "Department of Transportation",
  "Department of the Treasury"
];

export function PdfAnalysisForm({ onAnalyze, isAnalyzing }: PdfAnalysisFormProps) {
  const [pdf1, setPdf1] = React.useState<File | null>(null);
  const [pdf2, setPdf2] = React.useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>(departments[0]);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdf1 || !pdf2) {
      alert("Please upload both PDF files");
      return;
    }
    onAnalyze({ pdf1, pdf2 }, selectedDepartment);
  };

  return (
    <form onSubmit={handleAnalyze} className="w-full max-w-2xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4"> Summary of Receipts and Outlays Comparison</h2>
      
      <div className="mb-4">
        <label htmlFor="department" className="block text-sm font-medium mb-2">
          Select Department
        </label>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedDepartment}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 h-4 w-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {departments.map((dept) => (
              <DropdownMenuItem
                key={dept}
                onClick={() => {
                  setSelectedDepartment(dept);
                  setDropdownOpen(false);
                }}
              >
                {dept}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
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