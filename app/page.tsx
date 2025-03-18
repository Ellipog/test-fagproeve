"use client";

import { useState, useCallback } from "react";
import FileUploader from "./components/FileUploader";
import AnalysisFields from "./components/AnalysisFields";
import Results from "./components/Results";
import { AnalysisField, defaultAnalysisFields } from "./config/analysisFields";
import { uploadFile, analyzeFile, createCsvContent } from "./api/analyzeFile";

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisFields, setAnalysisFields] = useState<AnalysisField[]>(defaultAnalysisFields);
  const [results, setResults] = useState<any | null>(null);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = useCallback(async (file: File) => {
    console.log("🔵 File selected:", file.name);
    console.log("🔵 File type:", file.type);
    console.log("🔵 File size:", file.size, "bytes");
    
    setSelectedFile(file);
    setResults(null);
    setCsvContent(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      setError("Ingen fil valgt for analyse");
      return;
    }

    console.log("🟢 Starting analysis for file:", selectedFile.name);
    setIsUploading(true);
    setError(null);

    try {
      // Read the file content - using text for simple files, base64 for binary
      console.log("🟢 Reading file content...");
      let fileContent;
      
      // For PDF and image files, read as base64
      if (selectedFile.type.includes('pdf') || 
          selectedFile.type.includes('image') || 
          selectedFile.type.includes('application/octet-stream')) {
        fileContent = await readFileAsBase64(selectedFile);
        console.log("🟢 File read as base64 data URL");
      } else {
        // For text files, read as text
        fileContent = await readFileAsText(selectedFile);
        console.log("🟢 File read as text");
      }
      
      console.log("🟢 File content read successfully, length:", fileContent.length, "characters");
      if (typeof fileContent === 'string' && fileContent.length > 100) {
        console.log("🟢 First 100 characters:", fileContent.substring(0, 100));
      }
      
      // For simplicity, assuming a single page for most files
      // In a real application, you'd need to determine actual page count
      const numPages = 1;
      console.log("🟢 Using page count:", numPages);
      
      // First try to upload the file
      console.log("🟢 Uploading file to API...");
      const uploadResult = await uploadFile(selectedFile);
      console.log("🟢 Upload result:", uploadResult);
      
      // Then analyze the content
      console.log("🟢 Analyzing file content with fields:", analysisFields.map(f => f.name).join(", "));
      const analysisResults = await analyzeFile(fileContent, numPages, analysisFields);
      console.log("🟢 Analysis results:", JSON.stringify(analysisResults, null, 2));
      setResults(analysisResults);
      
      // If we have results, also generate CSV content
      if (analysisResults) {
        console.log("🟢 Generating CSV content...");
        const csvData = await createCsvContent(analysisResults);
        console.log("🟢 CSV content generated:", typeof csvData === 'string' && csvData.length > 100 ? 
          csvData.substring(0, 100) + "..." : csvData);
        setCsvContent(csvData);
      }
    } catch (err) {
      console.error("🔴 Error during analysis:", err);
      setError(`Feil under analyse av filen: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      console.log("🟢 Analysis process completed");
      setIsUploading(false);
    }
  }, [selectedFile, analysisFields]);

  // Helper function to read file content as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log("🟡 Starting to read file as text:", file.name);
      const reader = new FileReader();
      
      reader.onload = () => {
        console.log("🟡 File read completed successfully");
        const content = reader.result as string;
        console.log("🟡 File content length:", content.length);
        resolve(content);
      };
      
      reader.onerror = () => {
        console.error("🔴 Error reading file:", reader.error);
        reject(reader.error);
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          console.log(`🟡 Reading progress: ${percentComplete}%`);
        }
      };
      
      console.log("🟡 Starting file read operation...");
      reader.readAsText(file);
    });
  };

  // Helper function to read file as base64 data URL
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log("🟡 Starting to read file as base64:", file.name);
      const reader = new FileReader();
      
      reader.onload = () => {
        console.log("🟡 File read as base64 completed successfully");
        const content = reader.result as string;
        console.log("🟡 Base64 content length:", content.length);
        resolve(content);
      };
      
      reader.onerror = () => {
        console.error("🔴 Error reading file as base64:", reader.error);
        reject(reader.error);
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          console.log(`🟡 Reading progress: ${percentComplete}%`);
        }
      };
      
      console.log("🟡 Starting file read as data URL...");
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Databie
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Trekk ut strukturert data fra PDFer, bilder og andre ustrukturerte dokumenter
          </p>
        </div>

        <div className="mt-10 space-y-10">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Last opp fil</h2>
              <div className="mb-5">
                <FileUploader onFileSelected={handleFileSelected} isUploading={isUploading} />
              </div>
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-500">
                  Valgt fil: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </div>
              )}
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <AnalysisFields fields={analysisFields} onChange={setAnalysisFields} />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isUploading || !selectedFile}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                isUploading || !selectedFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUploading ? "Analyserer..." : "Bzzzz... Trekk ut data!"}
            </button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {results && <Results results={results} csvContent={csvContent} />}
        </div>
      </div>
    </div>
  );
}
