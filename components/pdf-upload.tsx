import * as React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface PdfUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
}

export function PdfUpload({
  className,
  label,
  onFileChange,
  selectedFile,
  ...props
}: PdfUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    onFileChange(file);
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {selectedFile && (
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
        >
          Choose PDF
        </Button>
        <span className="text-sm truncate max-w-[200px]">
          {selectedFile ? selectedFile.name : "No file selected"}
        </span>
      </div>
    </div>
  );
} 