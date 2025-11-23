import { useState } from "react";
import { type Correction, type Invoice } from "../../util/types";
import { Title } from "./Title";
import { Info } from "./Info";
import { Shipment } from "./Shipment";
import { Corrections } from "./Corrections";

type InvoiceComponentProps = {
  invoice: Invoice;
  handleFilter: (company: string) => void;
};

export const InvoiceCard = ({
  invoice,
  handleFilter,
}: InvoiceComponentProps) => {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const imgSrc = `/${invoice.shipment.provider.toLowerCase()}.svg`;

  const handleCorrections = (corrections: Correction[]) => {
    setCorrections(corrections);
  };

  return (
    <div
      key={invoice.id}
      className="flex items-center gap-4 rounded-2xl shadow-md bg-white p-4 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <img src={imgSrc} alt={invoice.shipment.provider} className="w-16 h-16" />
      <div className="flex-1">
        <Title
          correctionsLength={corrections.length}
          handleCorrections={handleCorrections}
          id={invoice.id}
          companyName={invoice.shipment.company.name}
          handleFilter={handleFilter}
        />
        <Info
          createdAt={invoice.shipment.createdAt}
          price={invoice.invoicedPrice}
          updatedAt={invoice.updatedAt}
        />
        <Shipment
          destinationCountry={invoice.shipment.destinationCountry}
          originCountry={invoice.shipment.originCountry}
          shipmentMode={invoice.shipment.mode}
        />
        <Corrections corrections={corrections} />
      </div>
    </div>
  );
};
