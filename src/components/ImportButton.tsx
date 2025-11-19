import { useRef, useState } from "react";
import type { Invoice } from "../util/types";

type ImportButtonProps = {
  handleInvoices: (invoices: Invoice[]) => void;
};

export const ImportButton = ({ handleInvoices }: ImportButtonProps) => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setFileName(file.name);

    try {
      const parsed = JSON.parse(text);
      handleInvoices(parsed as Invoice[]);
    } catch (err) {
      console.error("Invalid JSON:", err);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors w-auto"
      >
        Upload Invoices
      </button>

      {fileName && (
        <span className="text-sm text-gray-700 font-medium">{fileName}</span>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/json"
      />
    </div>
  );
};
