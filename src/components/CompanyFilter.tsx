import { useState } from "react";
import { fetchInvoices } from "../util/fetchInvoices";
import type { Invoice } from "../util/types";

type CompanyFilterProps = {
  handleInvoices: (invoices: Invoice[]) => void;
};

export const CompanyFilter = ({ handleInvoices }: CompanyFilterProps) => {
  const [company, setCompany] = useState("");

  const handleSearch = async () => {
    const invoices = await fetchInvoices(company);
    handleInvoices(invoices);
  };

  const handleClear = async () => {
    setCompany("");
    await handleSearch();
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Enter company name"
        className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button onClick={handleSearch}>
        <img className="cursor-pointer w8 h-8" src="/funnel.svg" />
      </button>
      <button onClick={handleClear}>
        <img className="cursor-pointer w8 h-8" src="/funnel-x.svg" />
      </button>
    </div>
  );
};
