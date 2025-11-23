import type { Pagination } from "../util/types";

type FilterProps = {
  handleFilter: (company: string) => void;
  filter: string;
  pagination: Pagination;
  handlePage: (page: number) => void;
};

export const Filter = ({
  filter,
  handleFilter,
  handlePage,
  pagination,
}: FilterProps) => {
  const handleSearch = () => {
    if (pagination.page !== 1) {
      handlePage(1);
    }
  };

  const handleClear = () => {
    handleFilter("");
    if (pagination.page !== 1) {
      handlePage(1);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={filter}
        onChange={(e) => handleFilter(e.target.value)}
        placeholder="Enter company name"
        className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button onClick={handleSearch}>
        <img
          className="cursor-pointer w-6 w-6"
          src="/funnel.svg"
          title="Apply filter"
        />
      </button>
      <button onClick={handleClear}>
        <img
          className="cursor-pointer w-6 h-6"
          src="/funnel-x.svg"
          title="Clear filter"
        />
      </button>
    </div>
  );
};
