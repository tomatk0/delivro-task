import { getName } from "country-list";
import ReactCountryFlag from "react-country-flag";

type ShipmentProps = {
  originCountry: string;
  destinationCountry: string;
  shipmentMode: string;
};

export const Shipment = ({
  destinationCountry,
  originCountry,
  shipmentMode,
}: ShipmentProps) => {
  return (
    <div className="mt-4 flex justify-between items-center text-sm">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <ReactCountryFlag
            countryCode={originCountry}
            svg
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            title={getName(originCountry)}
          />
        </div>
        <span>{originCountry}</span>
        <img src="/arrow-right.svg" className="w-6 h-6" />
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <ReactCountryFlag
            countryCode={destinationCountry}
            svg
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            title={getName(destinationCountry)}
          />
        </div>
        <span>{destinationCountry}</span>
      </div>

      <span
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-white font-medium ${
          shipmentMode === "IMPORT" ? "bg-green-500" : "bg-blue-500"
        }`}
      >
        <img
          src={shipmentMode === "IMPORT" ? "/file-down.svg" : "/file-up.svg"}
          alt={shipmentMode}
          className="w-4 h-4"
        />
        {shipmentMode}
      </span>
    </div>
  );
};
