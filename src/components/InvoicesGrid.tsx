import type { Invoice } from "../util/types";

type InvoicesGridProps = {
  invoices: Invoice[];
};

const formatDate = (utcString: string): string => {
  const date = new Date(utcString);

  if (isNaN(date.getTime())) return "Invalid date";

  const day = String(date.getUTCDate());
  const month = String(date.getUTCMonth() + 1);
  const year = date.getUTCFullYear();

  return `${day}.${month}. ${year}`;
};

export const InvoicesGrid = ({ invoices }: InvoicesGridProps) => {
  return (
    <div className="grid grid-cols-5 gap-6 p-4">
      {invoices.map((invoice) => {
        // pick the image based on provider
        const imgSrc = `/${invoice.shipment.provider.toLowerCase()}.svg`; // adjust the path and property

        return (
          <div
            key={invoice.id}
            className="flex items-center gap-4 rounded-2xl shadow-md bg-white p-4 border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <img
              src={imgSrc}
              alt={invoice.shipment.provider}
              className="w-16 h-16 flex-shrink-0"
            />

            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2 text-black">
                {invoice.id}
              </h2>
              <p className="text-sm text-black">
                {invoice.shipment.company.name}
              </p>

              <div className="mt-4 flex justify-between text-sm">
                <span className="text-black">{invoice.invoicedPrice} Kč</span>
                <span className="text-black">
                  {formatDate(invoice.shipment.createdAt)}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <span className="text-black">{`${invoice.shipment.originCountry} -> ${invoice.shipment.destinationCountry}`}</span>
                <span className="text-black">{invoice.shipment.mode}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
