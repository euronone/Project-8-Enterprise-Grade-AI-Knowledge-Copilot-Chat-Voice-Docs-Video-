"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadZone({ onSelect }: { onSelect?: (files: FileList) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="w-full h-auto flex flex-col items-center justify-center rounded-[14px] border-2 border-dashed border-[#374151] bg-[#1F2937]/50 p-8 hover:bg-[#1F2937] hover:border-[#6366F1]"
      >
        <Upload className="h-6 w-6 text-[#9CA3AF]" />
        <p className="mt-2 font-medium text-[#F9FAFB]">Drag and drop files, or click to browse</p>
        <p className="text-xs text-[#9CA3AF]">Supports PDF, DOCX, XLSX, PPTX, code files, images, and more</p>
      </Button>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        multiple
        onChange={(e) => e.target.files && onSelect?.(e.target.files)}
      />
    </>
  );
}
