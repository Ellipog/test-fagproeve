"use client";

import React, { useState } from "react";

interface ResultsProps {
  results: any | null;
  csvContent?: string | null;
}

export default function Results({ results, csvContent }: ResultsProps) {
  const [showRawJson, setShowRawJson] = useState(false);

  if (!results) {
    return null;
  }

  const downloadJson = () => {
    const jsonString = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "analysis-results.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    if (csvContent) {
      // Use the pre-generated CSV content if available
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "analysis-results.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Fall back to generating CSV on the client side
      const headers = Object.keys(results[0] || {}).join(",");
      const rows = results.map((row: any) => 
        Object.values(row)
          .map(val => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      );
      const csvContent = [headers, ...rows].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "analysis-results.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const toggleJsonView = () => {
    setShowRawJson(!showRawJson);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Uttrekk av data</h2>
        <button 
          onClick={toggleJsonView}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showRawJson ? "Vis tabell" : "Vis JSON"}
        </button>
      </div>
      
      {showRawJson ? (
        <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
          <pre className="text-xs text-gray-800">{JSON.stringify(results, null, 2)}</pre>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(results[0] || {}).map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(results) ? (
                results.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, valueIndex) => (
                      <td
                        key={valueIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {value === "undefined" ? "-" : String(value)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Object.keys(results || {}).length} className="px-6 py-4 text-center text-sm text-gray-500">
                    Ingen data funnet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 flex space-x-4">
        <button
          onClick={downloadJson}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Last ned JSON
        </button>
        <button
          onClick={downloadCsv}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Last ned CSV
        </button>
      </div>
    </div>
  );
} 