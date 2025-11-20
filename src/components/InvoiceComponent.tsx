import { useState } from "react";
import { type Correction, type Invoice } from "../util/types";

type InvoiceComponentProps = {
  invoice: Invoice;
};

const formatDate = (utcString: string, includeTime: boolean): string => {
  const date = new Date(utcString);

  if (isNaN(date.getTime())) return "Invalid date";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  let formatted = `${day}.${month}.${year}`;

  if (includeTime) {
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    formatted += ` ${hours}:${minutes}`;
  }

  return formatted;
};

export const InvoiceComponent = ({ invoice }: InvoiceComponentProps) => {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const imgSrc = `/${invoice.shipment.provider.toLowerCase()}.svg`;

  const fetchCorrections = async (invoiceId: string) => {
    if (corrections.length > 0) {
      setCorrections([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/invoices/${invoiceId}/corrections`
      );
      if (!response.ok) throw new Error("Failed to fetch invoices");
      const data = await response.json();
      setCorrections(data); //
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      key={invoice.id}
      className="flex items-center gap-4 rounded-2xl shadow-md bg-white p-4 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <img src={imgSrc} alt={invoice.shipment.provider} className="w-16 h-16" />

      <div className="flex-1">
        <div className="flex justify-between text-sm">
          <h2 className="text-lg font-semibold mb-2 text-black">
            {invoice.id}
          </h2>
          <button onClick={() => fetchCorrections(invoice.id)}>
            <img className="cursor-pointer w8 h-8" src="/history.svg" />
          </button>
        </div>
        <p className="text-sm text-black">{invoice.shipment.company.name}</p>

        <div className="mt-4 flex justify-between text-sm">
          <span className="text-black">{invoice.invoicedPrice} Kč</span>
          <span className="text-black">
            {formatDate(invoice.shipment.createdAt, false)}
          </span>
        </div>

        <div className="mt-4 flex justify-between text-sm">
          <span className="text-black">{`${invoice.shipment.originCountry} -> ${invoice.shipment.destinationCountry}`}</span>
          <span className="text-black">{invoice.shipment.mode}</span>
        </div>

        {corrections.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 text-sm">
            {corrections.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-black">
                  {formatDate(item.updatedAt, true)}
                </span>
                <span className="text-black">{item.invoicedPrice} Kč</span>
                <span className="text-black">{item.invoicedWeight} KG</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
