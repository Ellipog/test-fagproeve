"use client";

import React, { useState, useCallback } from "react";
import { AnalysisField } from "../config/analysisFields";

interface AnalysisFieldsProps {
  fields: AnalysisField[];
  onChange: (fields: AnalysisField[]) => void;
}

export default function AnalysisFields({ fields, onChange }: AnalysisFieldsProps) {
  const handleFieldChange = useCallback(
    (index: number, key: keyof AnalysisField, value: string) => {
      const updatedFields = [...fields];
      updatedFields[index] = { ...updatedFields[index], [key]: value };
      onChange(updatedFields);
    },
    [fields, onChange]
  );

  const addField = useCallback(() => {
    onChange([...fields, { name: "", description: "" }]);
  }, [fields, onChange]);

  const removeField = useCallback(
    (index: number) => {
      const updatedFields = [...fields];
      updatedFields.splice(index, 1);
      onChange(updatedFields);
    },
    [fields, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Dataskjema</h2>
        <button
          type="button"
          onClick={addField}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Legg til felt
        </button>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        {fields.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Ingen felt lagt til. Legg til felt for å definere datauttrekk.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {fields.map((field, index) => (
              <li key={index} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="mb-2">
                      <label htmlFor={`field-name-${index}`} className="block text-sm font-medium text-gray-700">
                        Navn
                      </label>
                      <input
                        type="text"
                        id={`field-name-${index}`}
                        value={field.name}
                        onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Feltnavn"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <label htmlFor={`field-desc-${index}`} className="block text-sm font-medium text-gray-700">
                        Beskrivelse
                      </label>
                      <input
                        type="text"
                        id={`field-desc-${index}`}
                        value={field.description}
                        onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Feltbeskrivelse"
                      />
                    </div>
                  </div>
                  <div className="flex items-center pt-6">
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Fjern felt"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 