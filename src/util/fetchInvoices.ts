import type { Invoice } from "./types";

export const fetchInvoices = async (company?: string): Promise<Invoice[]> => {
  try {
    const url = company
      ? `http://localhost:5000/invoices?company=${encodeURIComponent(company)}`
      : "http://localhost:5000/invoices";

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch invoices");

    const data: Invoice[] = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
