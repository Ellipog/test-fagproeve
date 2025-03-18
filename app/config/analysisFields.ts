export interface AnalysisField {
  name: string;
  description: string;
}

export const defaultAnalysisFields: AnalysisField[] = [
  { name: "Name", description: "Person or company name" },
  { name: "Date", description: "Document date" },
  { name: "Amount", description: "Total amount" },
  { name: "InvoiceNumber", description: "Invoice or document number" },
  { name: "DueDate", description: "Payment due date" },
  { name: "DocumentType", description: "Type of document (invoice, contract, etc.)" }
];

export interface AnalysisConfig {
  fields: AnalysisField[];
  apiEndpoint: string;
}

export const analysisConfig: AnalysisConfig = {
  fields: defaultAnalysisFields,
  apiEndpoint: "https://databie.innovasjon.skatteetaten-it.no/call/analyze_text"
}; 