"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

/**
 * Pick an image and upload it, handing back the stored URL.
 *
 * Uploads immediately rather than on form submit, so the caller only ever
 * deals with a plain URL string.
 */
export function ImagePicker({
  value,
  onChange,
  label = "Image",
  compact = false,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("image", file);

      // No Content-Type header here on purpose — the browser must set the
      // multipart boundary itself.
      const res = await fetch("/api/uploads", { method: "POST", body });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message ?? "Upload failed");
      }
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const box = compact ? "w-20 h-20" : "w-full h-36";

  return (
    <div>
      {!compact && (
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) pick(file);
        }}
      />

      {value ? (
        <div className={`relative ${box} rounded-2xl overflow-hidden border border-gray-200 group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={`${box} rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-colors disabled:opacity-50`}
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
          {!compact && (
            <span className="text-xs font-bold">{busy ? "Uploading…" : "Add an image"}</span>
          )}
        </button>
      )}

      {error && <p className="mt-1.5 text-xs font-bold text-red-600">{error}</p>}
    </div>
  );
}
