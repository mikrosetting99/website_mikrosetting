"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { uploadLogoAction, removeLogoAction } from "@/app/admin/settings/upload-logo-action";

export function LogoUploader({ siteName, logoUrl }: { siteName: string; logoUrl?: string }) {
  const [preview, setPreview] = useState(logoUrl ?? "");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.append("logo_file", file);

    startTransition(async () => {
      const result = await uploadLogoAction(formData);
      if (result.ok && result.logoUrl) {
        setPreview(result.logoUrl);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeLogoAction();
      if (result.ok) {
        setPreview("");
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- previews a freshly uploaded local file path
          <img src={preview} alt={siteName} className="h-full w-full object-cover" />
        ) : (
          <span className="text-lg font-bold text-muted-foreground">
            {siteName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            {isPending ? "Mengunggah..." : "Upload Logo"}
          </Button>
          {preview && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              disabled={isPending}
              onClick={handleRemove}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, GIF, atau SVG. Maksimal 2MB.</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
