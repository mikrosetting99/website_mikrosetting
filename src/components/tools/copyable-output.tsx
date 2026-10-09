"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function CopyableOutput({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Disalin ke clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Gagal menyalin, salin manual.");
    }
  }

  return (
    <div className="rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">{label ?? "Hasil"}</span>
        <Button type="button" size="sm" variant="ghost" onClick={handleCopy} className="h-7 gap-1 text-xs">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Tersalin" : "Copy"}
        </Button>
      </div>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-all p-3 text-xs leading-relaxed">
        {value}
      </pre>
    </div>
  );
}
