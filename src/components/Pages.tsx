import type { Pagination } from "../util/types";

type PagesProps = {
  pagination: Pagination;
  handlePage: (page: number) => void;
};

export const Pages = ({ pagination, handlePage }: PagesProps) => {
  const { page, totalPages } = pagination;

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    handlePage(newPage);
  };

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const visiblePages = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-auto">
      <button
        className="px-3 py-1 rounded bg-gray-100 text-sm disabled:opacity-50 hover:bg-gray-200 cursor-pointer"
        onClick={() => goToPage(1)}
        disabled={page <= 1}
        title="First page"
        aria-label="First page"
        type="button"
      >
        First
      </button>

      <button
        className="px-3 py-1 rounded bg-gray-100 text-sm disabled:opacity-50 hover:bg-gray-200 cursor-pointer"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        title="Previous page"
        aria-label="Previous page"
        type="button"
      >
        Previous
      </button>

      <div className="flex gap-1">
        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`px-3 py-1 rounded text-sm cursor-pointer ${
              p === page
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            aria-current={p === page ? "page" : undefined}
            title={`Go to page ${p}`}
            type="button"
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="px-3 py-1 rounded bg-gray-100 text-sm disabled:opacity-50 hover:bg-gray-200 cursor-pointer"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        title="Next page"
        aria-label="Next page"
        type="button"
      >
        Next
      </button>

      <button
        className="px-3 py-1 rounded bg-gray-100 text-sm disabled:opacity-50 hover:bg-gray-200 cursor-pointer"
        onClick={() => goToPage(totalPages)}
        disabled={page >= totalPages}
        title="Last page"
        aria-label="Last page"
        type="button"
      >
        Last
      </button>
    </div>
  );
};
