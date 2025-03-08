import { PdfAnalyzer } from "@/components/pdf-analyzer";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-8 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col items-center justify-center py-6">
        <h1 className="text-3xl font-bold mb-2">Treasury Data Comparison</h1>
        <p className="text-gray-500 text-center max-w-2xl">
          Upload two Treasury documents to analyze their summary of receipts and outlays.
        </p>
      </header>
      
      <main className="flex flex-col items-center justify-start w-full">
        <PdfAnalyzer />
      </main>
    </div>
  );
}
