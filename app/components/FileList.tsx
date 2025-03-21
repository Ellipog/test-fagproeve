'use client';

import { useState, useEffect, Fragment, useMemo, useCallback } from 'react';
import { File } from '../types';

type FileListProps = {
  files: File[];
  onUpdateFile: (updatedFile: File) => void;
};

// Icons for different file types
const FileIcon = ({ fileName }: { fileName: string }) => {
  // Determine file type by extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    }
    
    // Document files
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    }
    
    // Spreadsheet files
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    }
    
    // Default file icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    );
  };
  
  return (
    <div className="h-10 w-10 text-blue-500 p-1.5 rounded-lg bg-blue-50">
      {getFileIcon(fileName)}
    </div>
  );
};

// Modal for editing files
const EditModal = ({ 
  isOpen, 
  file, 
  allCategories,
  onClose, 
  onSave 
}: { 
  isOpen: boolean;
  file: { 
    id: string;
    name: string;
    category: string;
    tags: string[];
  } | null;
  allCategories: string[];
  onClose: () => void;
  onSave: (id: string, name: string, category: string, tags: string[]) => void;
}) => {
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  useEffect(() => {
    if (file) {
      setEditName(file.name);
      setEditCategory(file.category);
      setEditTags([...file.tags]);
    }
  }, [file]);
  
  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(prev => prev.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  if (!isOpen || !file) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Rediger dokument</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filnavn</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Filnavn"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagger</label>
              <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-lg min-h-10 mb-2 border border-gray-200">
                {editTags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                      type="button"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {editTags.length === 0 && (
                  <span className="text-sm text-gray-400">Ingen tagger lagt til</span>
                )}
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 text-sm border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Legg til ny tagg"
                />
                <button
                  onClick={handleAddTag}
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 text-sm font-medium rounded-r-lg transition-colors"
                  disabled={!newTag.trim()}
                  type="button"
                >
                  Legg til
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button 
              onClick={onClose}
              className="text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors font-medium"
              type="button"
            >
              Avbryt
            </button>
            <button 
              onClick={() => {
                if (file) {
                  onSave(file.id, editName, editCategory, editTags);
                }
              }}
              className="text-sm bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors font-medium"
              type="button"
            >
              Lagre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FileList({ files, onUpdateFile }: FileListProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  
  // Use useMemo to avoid recalculating these values on every render
  const filesByCategory = useMemo(() => {
    return files.reduce((acc, file) => {
      if (!acc[file.category]) {
        acc[file.category] = [];
      }
      acc[file.category].push(file);
      return acc;
    }, {} as Record<string, File[]>);
  }, [files]);
  
  // Get all unique categories across all files
  const allCategories = useMemo(() => {
    return Array.from(new Set(files.map(file => file.category))).sort();
  }, [files]);
  
  // Get all unique tags across all files
  const allTags = useMemo(() => {
    return Array.from(
      new Set(files.flatMap(file => file.tags))
    ).sort();
  }, [files]);
  
  // Filter tags based on search query
  const filteredTags = useMemo(() => {
    if (tagSearchQuery.trim() === '') {
      return allTags;
    }
    const query = tagSearchQuery.toLowerCase();
    return allTags.filter(tag => tag.toLowerCase().includes(query));
  }, [tagSearchQuery, allTags]);

  // Check if tag search matches an existing tag exactly
  const exactTagMatch = useMemo(() => {
    if (!tagSearchQuery.trim()) return null;
    
    const lowercaseQuery = tagSearchQuery.trim().toLowerCase();
    const matchingTag = allTags.find(tag => tag.toLowerCase() === lowercaseQuery);
    
    return matchingTag || null;
  }, [tagSearchQuery, allTags]);
  
  // Get current categories in use
  const categories = useMemo(() => {
    return Object.keys(filesByCategory).sort();
  }, [filesByCategory]);
  
  // Filter files by category and/or tag
  const getFilteredFiles = useCallback(() => {
    let filteredFiles = [...files];
    
    // Filter by category if one is selected
    if (activeCategory) {
      filteredFiles = filteredFiles.filter(file => file.category === activeCategory);
    }
    
    // Filter by tag if one is selected
    if (activeTag) {
      filteredFiles = filteredFiles.filter(file => file.tags.includes(activeTag));
    }
    
    // If there's an exact tag match in search, filter by that tag
    if (!activeTag && exactTagMatch) {
      filteredFiles = filteredFiles.filter(file => 
        file.tags.some(tag => tag.toLowerCase() === exactTagMatch.toLowerCase())
      );
    }
    
    return filteredFiles;
  }, [files, activeCategory, activeTag, exactTagMatch]);

  // Effect to automatically set activeTag when there's an exact match
  useEffect(() => {
    if (exactTagMatch && !activeTag) {
      setActiveTag(exactTagMatch);
    } else if (!tagSearchQuery.trim() && activeTag && !allTags.includes(activeTag)) {
      // Reset active tag if it no longer exists
      setActiveTag(null);
    }
  }, [exactTagMatch, activeTag, allTags, tagSearchQuery]);

  // Group filtered files by category
  const filteredFilesByCategory = useMemo(() => {
    const filteredFiles = getFilteredFiles();
    
    return filteredFiles.reduce((acc, file) => {
      if (!acc[file.category]) {
        acc[file.category] = [];
      }
      acc[file.category].push(file);
      return acc;
    }, {} as Record<string, File[]>);
  }, [getFilteredFiles]);
  
  const filteredCategories = useMemo(() => {
    return Object.keys(filteredFilesByCategory).sort();
  }, [filteredFilesByCategory]);

  const startEditing = useCallback((file: File) => {
    setEditingFile(file);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingFile(null);
  }, []);

  const saveChanges = useCallback((fileId: string, name: string, category: string, tags: string[]) => {
    const fileToUpdate = files.find(f => f.id === fileId);
    if (!fileToUpdate) return;

    const updatedFile = {
      ...fileToUpdate,
      name: name.trim() || fileToUpdate.name,
      category: category || fileToUpdate.category,
      tags: tags
    };

    onUpdateFile(updatedFile);
    setEditingFile(null);
  }, [files, onUpdateFile]);
  
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveCategory(e.target.value === '' ? null : e.target.value);
  }, []);
  
  const handleTagChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveTag(e.target.value === '' ? null : e.target.value);
    // Clear the search query when selecting a tag from dropdown
    if (e.target.value) {
      setTagSearchQuery('');
    }
  }, []);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagSearchQuery(value);
    
    // Clear active tag when searching
    if (value && activeTag) {
      setActiveTag(null);
    }
  }, [activeTag]);
  
  const clearSearch = useCallback(() => {
    setTagSearchQuery('');
    // If there was an active tag due to search, clear it
    if (exactTagMatch && activeTag === exactTagMatch) {
      setActiveTag(null);
    }
  }, [activeTag, exactTagMatch]);
  
  const resetFilters = useCallback(() => {
    setActiveCategory(null);
    setActiveTag(null);
    setTagSearchQuery('');
  }, []);
  
  const switchToCardView = useCallback(() => {
    setViewMode('card');
  }, []);
  
  const switchToListView = useCallback(() => {
    setViewMode('list');
  }, []);
  
  // Handles clicking on a tag in file cards/list
  const handleTagClick = useCallback((tag: string) => {
    setActiveTag(tag);
    setTagSearchQuery('');
  }, []);
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-center">Ingen dokumenter er lastet opp ennå</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800">Dokumenter ({files.length})</h2>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={switchToCardView}
                  className={`p-2 ${viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  title="Kortvisning"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  onClick={switchToListView}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  title="Listevisning"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={activeCategory || ''}
                  onChange={handleCategoryChange}
                >
                  <option value="">Alle kategorier</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {allTags.length > 0 && (
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={activeTag || ''}
                    onChange={handleTagChange}
                  >
                    <option value="">Alle tagger</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Søk i tagger..."
                  value={tagSearchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {tagSearchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    type="button"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Tag chips display if they are filtered */}
          {(activeCategory || activeTag || (exactTagMatch && !activeTag)) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeCategory && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Kategori: {activeCategory}
                  <button 
                    onClick={() => setActiveCategory(null)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              )}
              
              {activeTag && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Tagg: {activeTag}
                  <button 
                    onClick={() => setActiveTag(null)}
                    className="ml-2 text-green-600 hover:text-green-800"
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              )}
              
              {!activeTag && exactTagMatch && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Søketreff: {exactTagMatch}
                  <button 
                    onClick={clearSearch}
                    className="ml-2 text-green-600 hover:text-green-800"
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              )}
              
              {(activeCategory || activeTag || (exactTagMatch && !activeTag)) && (
                <button 
                  onClick={resetFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                  type="button"
                >
                  Nullstill alle filtre
                </button>
              )}
            </div>
          )}
          
          {viewMode === 'card' ? (
            // Card view
            <div className="space-y-6">
              {filteredCategories.map(category => (
                <div key={category}>
                  <h3 className="text-sm font-medium mb-3 px-1 text-gray-700 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    {category}
                    <span className="ml-2 text-gray-400 text-xs">
                      ({filteredFilesByCategory[category].length} {filteredFilesByCategory[category].length === 1 ? 'dokument' : 'dokumenter'})
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFilesByCategory[category].map(file => (
                      <div 
                        key={file.id} 
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start mb-3">
                          <FileIcon fileName={file.name} />
                          <div className="ml-3 flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate text-gray-800">{file.name}</h4>
                            <p className="text-xs text-gray-500">{file.size} • {file.uploadDate}</p>
                          </div>
                          <button
                            onClick={() => startEditing(file)}
                            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                            title="Rediger"
                            type="button"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                        </div>
                        
                        {file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {file.tags.slice(0, 3).map(tag => (
                              <span 
                                key={tag}
                                className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 text-xxs rounded-full cursor-pointer hover:bg-gray-200"
                                onClick={() => handleTagClick(tag)}
                              >
                                {tag}
                              </span>
                            ))}
                            {file.tags.length > 3 && (
                              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xxs rounded-full">
                                +{file.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List view
            <div className="space-y-6">
              {filteredCategories.map(category => (
                <div key={category}>
                  <h3 className="text-sm font-medium mb-3 px-1 text-gray-700 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    {category}
                    <span className="ml-2 text-gray-400 text-xs">
                      ({filteredFilesByCategory[category].length} {filteredFilesByCategory[category].length === 1 ? 'dokument' : 'dokumenter'})
                    </span>
                  </h3>
                  
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    {filteredFilesByCategory[category].map((file, index) => (
                      <Fragment key={file.id}>
                        {index > 0 && <div className="h-px bg-gray-100" />}
                        <div className="p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <FileIcon fileName={file.name} />
                            <div className="ml-3 flex-1 min-w-0">
                              <h4 className="text-sm font-medium truncate text-gray-800">{file.name}</h4>
                              <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-4">
                                <span>{file.uploadDate}</span>
                                <span>{file.size}</span>
                                {file.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 my-1">
                                    {file.tags.slice(0, 3).map(tag => (
                                      <span 
                                        key={tag}
                                        className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xxs rounded-full cursor-pointer hover:bg-gray-200"
                                        onClick={() => handleTagClick(tag)}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {file.tags.length > 3 && (
                                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xxs rounded-full">
                                        +{file.tags.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => startEditing(file)}
                              className="text-gray-400 hover:text-blue-500 transition-colors p-2"
                              title="Rediger"
                              type="button"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      <EditModal 
        isOpen={editingFile !== null}
        file={editingFile}
        allCategories={allCategories}
        onClose={cancelEditing}
        onSave={saveChanges}
      />
    </div>
  );
} 