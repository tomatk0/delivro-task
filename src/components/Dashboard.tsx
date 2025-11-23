import { useState } from "react";
import { Filter } from "./Filter";
import { Upload } from "./Upload";
import { Invoices } from "./Invoices";
import type { Pagination, Invoice } from "../util/types";
import { Pages } from "./Pages";
import { INVOICES_PER_PAGE } from "../util/constants";

export const Dashboard = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [refetchData, setRefetchData] = useState(0);
  const [filter, setFilter] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    limit: INVOICES_PER_PAGE,
    page: 1,
    total: 1,
    totalPages: 1,
  });

  const handleInvoices = (invoices: Invoice[]) => {
    setInvoices(invoices);
  };

  const handleRefetchData = () => {
    setRefetchData((prev) => prev + 1);
  };

  const handlePagination = (pagination: Pagination) => {
    setPagination(pagination);
  };

  const handlePage = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleFilter = (company: string) => {
    setFilter(company);
    if (pagination.page !== 1) {
      handlePage(1);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 flex flex-col gap-4 bg-gray-50">
      <div className="flex w-full flex-wrap justify-between gap-4">
        <Filter
          handleFilter={handleFilter}
          filter={filter}
          handlePage={handlePage}
          pagination={pagination}
        />
        <Upload handleRefetchData={handleRefetchData} handlePage={handlePage} />
      </div>
      <Invoices
        handleInvoices={handleInvoices}
        handleFilter={handleFilter}
        invoices={invoices}
        refetchData={refetchData}
        handlePagination={handlePagination}
        pagination={pagination}
        filter={filter}
      />
      <Pages pagination={pagination} handlePage={handlePage} />
    </div>
  );
};
