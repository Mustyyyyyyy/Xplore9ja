"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/upload";

export default function ImageUploadField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const res = await uploadImage(file);
        uploadedUrls.push(res.file.url);
      }

      onChange([...value, ...uploadedUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    onChange(value.filter((item) => item !== url));
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-neutral-700">Images</label>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
      />

      {uploading ? <p className="text-sm text-neutral-500">Uploading...</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {value.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((url) => (
            <div key={url} className="overflow-hidden rounded-2xl border border-black/5 bg-neutral-50">
              <img src={url} alt="Uploaded" className="h-40 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="w-full border-t border-black/5 px-4 py-3 text-sm font-medium text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}