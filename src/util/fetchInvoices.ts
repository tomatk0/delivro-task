import type { Pagination, InvoicesResponse } from "../util/types";

const BASE_API_URL = "http://localhost:5000";

export const fetchInvoices = async (
  pagination: Pagination,
  company?: string
): Promise<InvoicesResponse> => {
  try {
    const url = new URL("/invoices", BASE_API_URL);

    url.searchParams.set("page", String(pagination.page));
    url.searchParams.set("limit", String(pagination.limit));

    if (company && company.trim().length > 0) {
      url.searchParams.set("company", company);
    }

    const response = await fetch(url.toString());
    if (!response.ok)
      throw new Error(`Failed to fetch invoices (${response.status})`);

    const data: InvoicesResponse = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return {
      data: [],
      pagination: {
        limit: pagination.limit,
        page: 1,
        total: 0,
        totalPages: 0,
      },
    };
  }
};
