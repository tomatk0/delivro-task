import { useEffect } from "react";
import type { Invoice, Pagination } from "../util/types";
import { InvoiceCard } from "./InvoiceCard/InvoiceCard";
import { fetchInvoices } from "../util/fetchInvoices";

type InvoicesProps = {
  invoices: Invoice[];
  handleInvoices: (invoices: Invoice[]) => void;
  refetchData: number;
  handleFilter: (company: string) => void;
  pagination: Pagination;
  handlePagination: (pagination: Pagination) => void;
  filter: string;
};

export const Invoices = ({
  invoices,
  handleInvoices,
  refetchData,
  handleFilter,
  handlePagination,
  pagination,
  filter,
}: InvoicesProps) => {
  useEffect(() => {
    const fetch = async () => {
      const newInvoices = await fetchInvoices(pagination, filter);
      handleInvoices(newInvoices.data);
      handlePagination(newInvoices.pagination);
    };
    fetch();
  }, [pagination.page, pagination.limit, filter, refetchData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          handleFilter={handleFilter}
        />
      ))}
    </div>
  );
};
