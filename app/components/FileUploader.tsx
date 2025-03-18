"use client";

import React, { useState, useCallback, useRef } from "react";
import { AnalysisField } from "../config/analysisFields";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
}

export default function FileUploader({ onFileSelected, isUploading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    console.log("📄 [UPLOADER] File drag over");
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    console.log("📄 [UPLOADER] File drag leave");
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      console.log("📄 [UPLOADER] File dropped");
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        console.log("📄 [UPLOADER] File from drop:", file.name, file.type, file.size, "bytes");
        onFileSelected(file);
      } else {
        console.log("📄 [UPLOADER] No valid files in drop event");
      }
    },
    [onFileSelected]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("📄 [UPLOADER] File input change event");
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        console.log("📄 [UPLOADER] File selected from input:", file.name, file.type, file.size, "bytes");
        onFileSelected(file);
      } else {
        console.log("📄 [UPLOADER] No files selected from input");
      }
    },
    [onFileSelected]
  );

  const handleButtonClick = useCallback(() => {
    console.log("📄 [UPLOADER] File selection button clicked");
    fileInputRef.current?.click();
  }, []);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,.txt"
      />
      {isUploading ? (
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Behandler fil...</p>
        </div>
      ) : (
        <div>
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-600">Dra og slipp fil her</p>
          <p className="text-gray-500 text-sm mt-1">- eller -</p>
          <p className="text-blue-500 font-medium mt-1">Velg fil</p>
          <p className="text-gray-400 text-xs mt-3">
            Støtter PDF, bilder og dokumenter
          </p>
        </div>
      )}
    </div>
  );
} 