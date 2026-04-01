"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
export default function ImportCustomersModal({ onClose, onSuccess }: any) {

  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ HANDLE FILE SELECT
  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      console.log("Selected file:", selectedFile);
    }
  };

  // ✅ HANDLE UPLOAD CLICK
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
 const toastId = toast.loading("Uploading customers...");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/customers", {   // ✅ SAME API (updated backend)
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
       toast.success(
          `Imported successfully (${data.count || 0} customers)`,
          { id: toastId }
       )

        onSuccess(); // refresh table
        onClose();
      } else {
        toast.error(data.error || "Import failed ❌", { id: toastId });
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error ❌", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md">

        <h2 className="text-xl font-semibold text-white mb-4">
          Import Customers
        </h2>

        {/* FILE INPUT */}
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileChange}
          className="
            w-full
            text-sm text-gray-300
            file:mr-4
            file:py-2
            file:px-4
            file:rounded-lg
            file:border-0
            file:text-sm
            file:font-medium
            file:bg-green-600
            file:text-white
            hover:file:bg-green-700
            cursor-pointer
            bg-zinc-900
            border border-zinc-700
            rounded-lg
            p-2
          "
        />

        {/* ✅ FILE NAME PREVIEW */}
        {fileName && (
          <p className="text-green-400 text-sm mt-2">
            Selected: {fileName}
          </p>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-5">

          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}   // ✅ NOW WORKING
            disabled={loading}
            className="px-4 py-2 bg-green-600 rounded-lg"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

        </div>

      </div>
    </div>
  );
}