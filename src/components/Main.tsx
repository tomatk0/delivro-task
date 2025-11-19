import { useState } from "react";
import type { Invoice } from "../util/types";
import { ImportButton } from "./ImportButton";
import { InvoicesGrid } from "./InvoicesGrid";

export const Main = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const handleInvoices = (invoices: Invoice[]) => {
    setInvoices(invoices);
  };

  return (
    <div className="min-h-screen w-full p-6 flex flex-col gap-6 bg-gray-50">
      <ImportButton handleInvoices={handleInvoices} />
      {invoices.length > 0 && <InvoicesGrid invoices={invoices} />}
    </div>
  );
};
