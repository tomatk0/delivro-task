import { formatDate } from "../../util/formatDate";
import type { Correction } from "../../util/types";

type CorrectionsProps = {
  corrections: Correction[];
};

export const Corrections = ({ corrections }: CorrectionsProps) => {
  return (
    corrections.length > 0 && (
      <div className="mt-4 flex flex-col gap-2 text-sm">
        {corrections.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span className="text-black">{item.invoicedPrice} Kč</span>
            <span className="text-black">{item.invoicedWeight} KG</span>
            <span className="text-black">
              {formatDate(item.updatedAt, true)}
            </span>
          </div>
        ))}
      </div>
    )
  );
};
