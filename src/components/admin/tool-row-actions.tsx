"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  deleteToolAction,
  duplicateToolAction,
  toggleToolActiveAction,
} from "@/app/admin/tools/actions";

export function ToolRowActions({ toolId, isActive }: { toolId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      <Switch
        checked={isActive}
        disabled={isPending}
        onCheckedChange={(checked) =>
          startTransition(async () => {
            await toggleToolActiveAction(toolId, checked);
          })
        }
      />
      <Button size="sm" variant="outline" render={<Link href={`/admin/tools/${toolId}`} />}>
        Edit
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await duplicateToolAction(toolId);
            toast.success("Tool berhasil diduplikasi.");
          })
        }
      >
        Duplicate
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-destructive hover:bg-destructive/10"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Hapus tool ini?")) return;
          startTransition(async () => {
            await deleteToolAction(toolId);
            toast.success("Tool berhasil dihapus.");
          });
        }}
      >
        Hapus
      </Button>
    </div>
  );
}
