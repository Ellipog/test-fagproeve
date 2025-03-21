'use client';

import { useState, useCallback } from 'react';
import { File } from '../types';

interface FileUploaderProps {
  onFilesProcessed?: (files: File[]) => void;
  onFileUpload?: (file: File) => void;
}

export default function FileUploader({ onFilesProcessed, onFileUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Document categories with Norwegian names
  const documentCategories = [
    'Arbeidskontrakt',
    'Leiekontrakt',
    'Visum',
    'Oppholdstillatelse',
    'Skattemelding',
    'Bankutskrift',
    'Forsikringsdokument',
    'Førerkort',
    'Pass',
    'Legeerklæring',
    'Lønnslipp',
    'Studiebevis',
    'Vitnemål'
  ];

  // Common tags for immigration documents
  const commonTags = [
    'navn',
    'fødselsdato',
    'fødselsnummer',
    'adresse',
    'statsborgerskap',
    'innreisedato',
    'utløpsdato',
    'inntekt',
    'skatt',
    'arbeidsgiver',
    'utdanning',
    'helse',
    'identifikasjon',
    'bolig',
    'familie'
  ];

  // Map document types to relevant tags
  const documentTags: Record<string, string[]> = {
    'Arbeidskontrakt': ['arbeidsgiver', 'inntekt', 'navn'],
    'Leiekontrakt': ['adresse', 'bolig', 'navn'],
    'Visum': ['utløpsdato', 'innreisedato', 'statsborgerskap'],
    'Oppholdstillatelse': ['utløpsdato', 'statsborgerskap', 'identifikasjon'],
    'Skattemelding': ['inntekt', 'skatt', 'fødselsnummer'],
    'Bankutskrift': ['inntekt', 'navn', 'adresse'],
    'Forsikringsdokument': ['helse', 'bolig', 'navn'],
    'Førerkort': ['identifikasjon', 'navn', 'fødselsdato'],
    'Pass': ['identifikasjon', 'statsborgerskap', 'navn'],
    'Legeerklæring': ['helse', 'navn', 'fødselsdato'],
    'Lønnslipp': ['inntekt', 'arbeidsgiver', 'skatt'],
    'Studiebevis': ['utdanning', 'navn', 'identifikasjon'],
    'Vitnemål': ['utdanning', 'navn', 'fødselsdato']
  };

  // Generate file size between 10 KB and 5 MB
  const generateFileSize = (): string => {
    const size = Math.floor(Math.random() * 5000) + 10;
    return size < 1000 ? `${size} KB` : `${(size / 1000).toFixed(1)} MB`;
  };

  // Generate today's date or a random date within the last 30 days
  const generateDate = (): string => {
    const date = new Date();
    if (Math.random() > 0.5) {
      // Generate a random date within the last 30 days
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    }
    return date.toLocaleDateString('no-NO');
  };

  // Generate tags based on document type
  const generateTags = (category: string): string[] => {
    // Get relevant tags for the document type
    const relevantTags = documentTags[category] || [];
    
    // Add 0-2 random additional tags that aren't already included
    const additionalTags: string[] = [];
    const availableTags = commonTags.filter(tag => !relevantTags.includes(tag));
    
    const numAdditionalTags = Math.floor(Math.random() * 3); // 0, 1, or 2
    for (let i = 0; i < numAdditionalTags && availableTags.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableTags.length);
      additionalTags.push(availableTags[randomIndex]);
      availableTags.splice(randomIndex, 1); // Remove the selected tag
    }
    
    return [...relevantTags, ...additionalTags];
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const processFiles = useCallback((fileList: FileList) => {
    setIsProcessing(true);
    setNotification(null);
    
    setTimeout(() => {
      const processedFiles: File[] = [];
      
      Array.from(fileList).forEach((file, index) => {
        // Generate a random category for the file
        const randomCategory = documentCategories[Math.floor(Math.random() * documentCategories.length)];
        
        const processedFile = {
          id: `file-${Date.now()}-${index}`,
          name: file.name,
          category: randomCategory,
          size: generateFileSize(),
          uploadDate: generateDate(),
          tags: generateTags(randomCategory)
        };
        
        processedFiles.push(processedFile);
        
        // If onFileUpload is provided (legacy support), call it for each file
        if (onFileUpload) {
          onFileUpload(processedFile);
        }
      });
      
      // If onFilesProcessed is provided (new API), call it with all processed files
      if (onFilesProcessed) {
        onFilesProcessed(processedFiles);
      }
      
      setIsProcessing(false);
      setIsDragging(false);
      
      // Show notification with number of processed files
      const fileCount = processedFiles.length;
      setNotification(
        `${fileCount} ${fileCount === 1 ? 'dokument' : 'dokumenter'} behandlet. Du kan endre navn, kategori, eller tagger på dokumentene.`
      );
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }, 1500); // Simulate processing time
  }, [documentCategories, onFilesProcessed, onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
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
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              {isDragging ? 'Slipp filer her' : 'Last opp dokumenter'}
            </h3>
            <p className="text-sm text-gray-500">
              Dra og slipp filer her, eller klikk for å velge
            </p>
          </div>
          
          {isProcessing ? (
            <div className="flex items-center mt-2">
              <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm text-blue-500 font-medium">Behandler filer...</span>
            </div>
          ) : (
            <label className="mt-2">
              <span className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                Velg filer
              </span>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileInputChange}
              />
            </label>
          )}
        </div>
      </div>
      
      {notification && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-lg text-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {notification}
          </div>
        </div>
      )}
    </div>
  );
} 