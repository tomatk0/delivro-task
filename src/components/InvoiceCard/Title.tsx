import type { Correction } from "../../util/types";

type TitleProps = {
  id: string;
  correctionsLength: number;
  companyName: string;
  handleCorrections: (corrections: Correction[]) => void;
  handleFilter: (company: string) => void;
};

export const Title = ({
  correctionsLength,
  id,
  handleCorrections,
  companyName,
  handleFilter,
}: TitleProps) => {
  const fetchCorrections = async () => {
    if (correctionsLength) {
      handleCorrections([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/invoices/${id}/corrections`
      );
      if (!response.ok) throw new Error("Failed to fetch invoices");
      const data = await response.json();
      handleCorrections(data); //
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex justify-between text-sm">
        <h2
          className="text-base font-semibold mb-2 text-black truncate"
          title={id}
        >
          {id}
        </h2>

        <button onClick={fetchCorrections}>
          <img
            className="cursor-pointer w-6 h-6"
            src="/history.svg"
            title={
              correctionsLength > 0
                ? "Hide corrections history"
                : "View corrections history"
            }
          />
        </button>
      </div>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => handleFilter(companyName)}
        title="Filter by this company"
      >
        <p className="text-sm text-black">{companyName}</p>
        <img src="/search.svg" className="w-4 h-4" />
      </div>
    </>
  );
};
