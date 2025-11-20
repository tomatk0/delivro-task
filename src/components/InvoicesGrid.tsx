import { useEffect } from "react";
import type { Invoice } from "../util/types";
import { InvoiceComponent } from "./InvoiceComponent";
import { fetchInvoices } from "../util/fetchInvoices";

type InvoicesGridProps = {
  invoices: Invoice[];
  handleInvoices: (invoices: Invoice[]) => void;
};

export const InvoicesGrid = ({ invoices, handleInvoices }: InvoicesGridProps) => {
  useEffect(() => {
    const fetch = async () => {
      const invoices = await fetchInvoices();
      handleInvoices(invoices);
    };
    fetch();
  }, []);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-2 gap-6">
      {invoices.map((invoice) => {
        return <InvoiceComponent key={invoice.id} invoice={invoice} />;
      })}
    </div>
  );
};
