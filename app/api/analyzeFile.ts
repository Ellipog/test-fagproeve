import { AnalysisField } from "../config/analysisFields";

// Actually connect to the API instead of mocking responses
export async function uploadFile(file: File): Promise<string> {
  try {
    console.log("📤 [API] Upload started for file:", file.name);
    console.log("📤 [API] File type:", file.type);
    console.log("📤 [API] File size:", file.size, "bytes");
    
    // Convert file to FormData or read as needed
    const formData = new FormData();
    formData.append('file', file);
    
    // First, actually upload the file
    console.log("📤 [API] Sending real API request to upload file...");
    
    const uploadResponse = await fetch("https://databie.innovasjon.skatteetaten-it.no/call/upload_file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          { path: await readFileAsDataURL(file) }, // Send file data directly
          JSON.stringify({ files: ["Eksempel: Hotellkvittering.jpeg", "Eksempel: Faktura.pdf", "Eksempel: Arbeidsavtale.pdf"] })
        ]
      }),
    });

    console.log("📤 [API] Upload response status:", uploadResponse.status);
    if (!uploadResponse.ok) {
      throw new Error(`File upload failed with status: ${uploadResponse.status}`);
    }
    
    const uploadData = await uploadResponse.json();
    console.log("📤 [API] Upload response data:", uploadData);
    
    // Then update the available files list
    const updateResponse = await fetch("https://databie.innovasjon.skatteetaten-it.no/call/update_available_files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          JSON.stringify({ 
            files: ["Eksempel: Hotellkvittering.jpeg", "Eksempel: Faktura.pdf", "Eksempel: Arbeidsavtale.pdf", file.name] 
          })
        ]
      }),
    });
    
    console.log("📤 [API] Update files response status:", updateResponse.status);
    if (!updateResponse.ok) {
      throw new Error(`Update available files failed with status: ${updateResponse.status}`);
    }
    
    console.log("📤 [API] File upload completed successfully");
    return file.name;
  } catch (error) {
    console.error("📤 [API] Error uploading file:", error);
    throw error;
  }
}

// Helper to read file as data URL
async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeFile(
  fileContent: string,
  numPages: number,
  fields: AnalysisField[]
): Promise<any> {
  try {
    console.log("🔍 [API] Analysis started");
    console.log("🔍 [API] Content length:", fileContent.length, "characters");
    console.log("🔍 [API] Number of pages:", numPages);
    console.log("🔍 [API] Fields to extract:", fields.map(f => f.name).join(", "));
    
    // Format the fields to match the API's expected structure
    const schemaData = fields.map(field => [field.name.toLowerCase(), field.description]);
    
    // Prepare the request payload according to the curl example
    const requestBody = {
      data: [
        "Du er en nøyaktig assistent som analyserer et dokument og henter ut korrekt informasjon. Fyll kun ut felter som er definert i dataskjema. Felter og informasjon som ikke kan identifiseres angis som \"undefined\".",
        {
          headers: ["Navn", "Beskrivelse"],
          data: schemaData,
          metadata: null
        },
        {
          headers: ["Begrep", "Definisjon"],
          data: [["", ""]],
          metadata: null
        },
        fileContent,
        numPages.toString()
      ]
    };

    console.log("🔍 [API] Prepared API request payload:");
    console.log("🔍 [API] - Instruction: Set");
    console.log("🔍 [API] - Schema fields:", schemaData.length);
    console.log("🔍 [API] - Content length:", fileContent.length);
    
    // Actually call the API
    console.log("🔍 [API] Sending real request to: https://databie.innovasjon.skatteetaten-it.no/call/analyze_text");
    const response = await fetch("https://databie.innovasjon.skatteetaten-it.no/call/analyze_text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("🔍 [API] Response status:", response.status);
    if (!response.ok) {
      throw new Error(`Analysis failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("🔍 [API] Response data received:", responseData);
    
    // Extract the actual data from the response
    const result = responseData.data || responseData;
    console.log("🔍 [API] Analysis completed, returning results");
    return result;
  } catch (error) {
    console.error("🔍 [API] Error analyzing file:", error);
    throw error;
  }
}

// Helper function to extract field values from document content
function extractFieldFromContent(fieldName: string, content: string): string | null {
  console.log(`🔎 [EXTRACT] Looking for field "${fieldName}" in content`);
  const contentLower = content.toLowerCase();
  
  // Name/company detection
  if (fieldName === "name" || fieldName === "navn") {
    console.log(`🔎 [EXTRACT] Trying to extract name/company`);
    // Look for common name patterns
    const nameMatch = content.match(/(?:customer|client|recipient|company|name):\s*([^\n]+)/i);
    const result = nameMatch ? nameMatch[1].trim() : null;
    console.log(`🔎 [EXTRACT] Name extraction result: "${result || 'not found'}"`);
    return result;
  }
  
  // Date detection
  if (fieldName === "date" || fieldName === "dato") {
    console.log(`🔎 [EXTRACT] Trying to extract date`);
    // Look for date in various formats
    const dateMatch = content.match(/(?:date|dated|dato):\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}\.\d{2}\.\d{4})/i);
    const result = dateMatch ? dateMatch[1] : null;
    console.log(`🔎 [EXTRACT] Date extraction result: "${result || 'not found'}"`);
    return result;
  }
  
  // Amount/total detection
  if (fieldName === "amount" || fieldName === "beløp" || fieldName === "total") {
    console.log(`🔎 [EXTRACT] Trying to extract amount/total`);
    // Look for monetary amounts
    const amountMatch = content.match(/(?:total|amount|sum|beløp)(?:[^\n]*?):?\s*[$€£]?(\d[0-9,.\s]*)/i);
    const result = amountMatch ? amountMatch[1].trim() : null;
    console.log(`🔎 [EXTRACT] Amount extraction result: "${result || 'not found'}"`);
    return result;
  }
  
  // Invoice number detection
  if (fieldName === "invoicenumber" || fieldName === "fakturanummer") {
    console.log(`🔎 [EXTRACT] Trying to extract invoice number`);
    const invMatch = content.match(/(?:invoice\s*(?:number|#|no)?|faktura(?:nummer)?):\s*([^\n]+)/i);
    const result = invMatch ? invMatch[1].trim() : null;
    console.log(`🔎 [EXTRACT] Invoice number extraction result: "${result || 'not found'}"`);
    return result;
  }
  
  // Due date detection
  if (fieldName === "duedate" || fieldName === "forfallsdato") {
    console.log(`🔎 [EXTRACT] Trying to extract due date`);
    const dueMatch = content.match(/(?:due\s*date|betales\s*innen|forfallsdato):\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}\.\d{2}\.\d{4})/i);
    const result = dueMatch ? dueMatch[1] : null;
    console.log(`🔎 [EXTRACT] Due date extraction result: "${result || 'not found'}"`);
    return result;
  }
  
  // Document type detection
  if (fieldName === "documenttype" || fieldName === "dokumenttype") {
    console.log(`🔎 [EXTRACT] Trying to determine document type`);
    let result = null;
    if (contentLower.includes("invoice") || contentLower.includes("faktura")) {
      result = "Invoice";
    } else if (contentLower.includes("receipt") || contentLower.includes("kvittering")) {
      result = "Receipt";
    } else if (contentLower.includes("contract") || contentLower.includes("avtale")) {
      result = "Contract";
    } else {
      result = "Document";
    }
    console.log(`🔎 [EXTRACT] Document type detection result: "${result}"`);
    return result;
  }
  
  // Default - no specific handler for this field type
  console.log(`🔎 [EXTRACT] No specific extractor for field "${fieldName}"`);
  return null;
}

export async function createCsvContent(jsonData: any): Promise<string> {
  try {
    console.log("📊 [CSV] Starting CSV generation from JSON data");
    console.log("📊 [CSV] Input data:", JSON.stringify(jsonData).substring(0, 100) + "...");
    
    // Actually call the API for CSV generation
    console.log("📊 [CSV] Calling actual API: https://databie.innovasjon.skatteetaten-it.no/call/create_csv_content");
    
    const response = await fetch("https://databie.innovasjon.skatteetaten-it.no/call/create_csv_content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [jsonData]
      }),
    });
    
    console.log("📊 [CSV] Response status:", response.status);
    if (!response.ok) {
      throw new Error(`CSV creation failed with status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log("📊 [CSV] CSV data received");
    
    const csvContent = responseData.data || responseData;
    console.log("📊 [CSV] CSV generation complete, total length:", typeof csvContent === 'string' ? csvContent.length : 'unknown');
    
    return typeof csvContent === 'string' ? csvContent : JSON.stringify(csvContent);
  } catch (error) {
    console.error("📊 [CSV] Error creating CSV:", error);
    throw error;
  }
} 