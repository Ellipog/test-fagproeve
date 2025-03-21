'use client';

import { useState } from 'react';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';
import { File } from './types';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (file: File) => {
    setFiles(prev => [...prev, file]);
  };

  const handleUpdateFile = (updatedFile: File) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === updatedFile.id ? updatedFile : file
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[85rem] mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Test Fagprøve Mars 2025 - Elliot Strand Aaen</h1>
          <p className="text-gray-500 mt-2">En mock applikasjon for å vise hvordan opplasting av dokumenter kan fungere</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Last opp dokumenter</h2>
              <FileUploader onFileUpload={handleFileUpload} />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <FileList files={files} onUpdateFile={handleUpdateFile} />
          </div>
        </div>
      </div>
    </div>
  );
}
