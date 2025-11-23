import { formatDate } from "../../util/formatDate";

type InfoProps = {
  price: number;
  createdAt: string;
  updatedAt?: string;
};

export const Info = ({ createdAt, price, updatedAt }: InfoProps) => {
  return (
    <div className="mt-4 flex justify-between text-sm">
      <span className="text-purple-500 text-lg font-semibold">{price} Kč</span>

      <span className="text-black">
        {formatDate(updatedAt ?? createdAt, false)}
      </span>
    </div>
  );
};
