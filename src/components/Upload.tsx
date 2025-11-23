import { useRef, useState } from "react";
import type { Invoice } from "../util/types";

type UploadProps = {
  handleRefetchData: () => void;
  handlePage: (page: number) => void;
};

export const Upload = ({ handleRefetchData, handlePage }: UploadProps) => {
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
      const parsed = JSON.parse(text) as Invoice[];

      const response = await fetch("http://localhost:5000/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      if (!response.ok) {
        console.error("Failed to upload invoices:", await response.text());
      } else {
        handleRefetchData();
        handlePage(1);
      }
    } catch (err) {
      console.error("Invalid JSON:", err);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors w-auto cursor-pointer"
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
