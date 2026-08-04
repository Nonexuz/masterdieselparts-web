"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

type ProductImageUploaderProps = {
  initialUrls?: string[];
};

function sanitizeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "jpg";

  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "imagem"}.${extension}`;
}

export function ProductImageUploader({
  initialUrls = [],
}: ProductImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialUrls);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setErrorMessage("");

    const supabase = createBrowserSupabaseClient();
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Use somente imagens JPG, PNG ou WebP.");
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Cada imagem deve ter no máximo 5 MB.");
        continue;
      }

      const safeFileName = sanitizeFileName(file.name);
      const filePath = `admin/${crypto.randomUUID()}-${safeFileName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        setErrorMessage(
          `Erro ao enviar ${file.name}: ${error.message}`
        );
        continue;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    if (uploadedUrls.length > 0) {
      setImageUrls((currentUrls) => [
        ...currentUrls,
        ...uploadedUrls,
      ]);
    }

    setUploading(false);
  }

  function removeImage(urlToRemove: string) {
    setImageUrls((currentUrls) =>
      currentUrls.filter((url) => url !== urlToRemove)
    );
  }

  return (
    <div>
      <textarea
        name="image_urls"
        value={imageUrls.join("\n")}
        readOnly
        className="hidden"
      />

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center transition hover:border-yellow-400 hover:bg-yellow-50">
        <span className="text-lg font-black">
          {uploading
            ? "Enviando imagens..."
            : "Selecionar imagens do computador"}
        </span>

        <span className="mt-2 text-sm text-zinc-600">
          JPG, PNG ou WebP — máximo de 5 MB por imagem
        </span>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploading}
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
          className="hidden"
        />
      </label>

      {errorMessage && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {errorMessage}
        </div>
      )}

      {imageUrls.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {imageUrls.map((url, index) => (
            <div
              key={url}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="aspect-square bg-zinc-100">
                <img
                  src={url}
                  alt={`Imagem ${index + 1} do produto`}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-3">
                <span className="text-sm font-bold">
                  Imagem {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}