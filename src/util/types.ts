export type Invoice = {
  id: string;
  shipment: {
    id: string;
    createdAt: string;
    trackingNumber: string;
    company: {
      id: string;
      name: string;
    };
    provider: "GLS" | "DPD" | "UPS" | "PPL" | "FedEx";
    mode: "EXPORT" | "IMPORT";
    originCountry: string;
    destinationCountry: string;
  };
  invoicedWeight: number;
  invoicedPrice: number;
  updatedAt?: string;
};

export type Correction = {
  id: string;
  invoicedWeight: number;
  invoicedPrice: number;
  updatedAt: string;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type InvoicesResponse = {
  data: Invoice[];
  pagination: Pagination;
};
