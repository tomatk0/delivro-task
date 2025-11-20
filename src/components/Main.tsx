import { useState } from "react";
import { CompanyFilter } from "./CompanyFilter";
import { ImportButton } from "./ImportButton";
import { InvoicesGrid } from "./InvoicesGrid";
import type { Invoice } from "../util/types";

export const Main = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const handleInvoices = (invoices: Invoice[]) => {
    setInvoices(invoices);
  };

  return (
    <div className="min-h-screen w-full p-6 flex flex-col gap-6 bg-gray-50">
      <ImportButton />
      <CompanyFilter handleInvoices={handleInvoices} />
      <InvoicesGrid handleInvoices={handleInvoices} invoices={invoices} />
    </div>
  );
};
