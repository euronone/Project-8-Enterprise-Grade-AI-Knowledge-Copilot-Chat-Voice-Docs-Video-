"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";

export function UploadZone({ onSelect }: { onSelect?: (files: FileList) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="w-full rounded-xl border-2 border-dashed p-8 text-center hover:bg-muted"
    >
      <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
      <p className="mt-2 font-medium">Drag and drop files, or click to browse</p>
      <p className="text-xs text-muted-foreground">Supports PDF, DOCX, XLSX, PPTX, code files, images, and more</p>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        multiple
        onChange={(e) => e.target.files && onSelect?.(e.target.files)}
      />
    </button>
  );
}
