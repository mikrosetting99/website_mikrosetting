"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DynamicIcon } from "@/lib/icons";
import {
  deleteToolAction,
  duplicateToolAction,
  toggleToolActiveAction,
} from "@/app/admin/tools/actions";
import type { Category, Tool } from "@/generated/prisma/client";

type ToolWithCategory = Tool & { category: Category };

export function AdminToolsPreview({ tools }: { tools: ToolWithCategory[] }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) || tool.category.name.toLowerCase().includes(q),
    );
  }, [tools, query]);

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Produk / Tools</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama tool atau kategori..."
              className="w-56 pl-9"
            />
          </div>
          <Button size="sm" render={<Link href="/admin/tools/new" />}>
            <Plus className="h-4 w-4" />
            Tambah Tool
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">No</TableHead>
              <TableHead>Nama Tool</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Akses</TableHead>
              <TableHead>Biaya Koin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tool, index) => (
              <TableRow key={tool.id}>
                <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <DynamicIcon name={tool.icon} className="h-3.5 w-3.5" />
                    </span>
                    {tool.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{tool.category.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{tool.accessType}</Badge>
                </TableCell>
                <TableCell>{tool.accessType === "COIN" ? tool.coinCost : "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={tool.isActive}
                      disabled={isPending}
                      onCheckedChange={(checked) =>
                        startTransition(async () => {
                          await toggleToolActiveAction(tool.id, checked);
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {tool.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon-sm" variant="outline" render={<Link href={`/admin/tools/${tool.id}`} />}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await duplicateToolAction(tool.id);
                          toast.success("Tool berhasil diduplikasi.");
                        })
                      }
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                      disabled={isPending}
                      onClick={() => {
                        if (!confirm("Hapus tool ini?")) return;
                        startTransition(async () => {
                          await deleteToolAction(tool.id);
                          toast.success("Tool berhasil dihapus.");
                        });
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">Tidak ada tool yang cocok.</p>
        )}
      </div>
    </section>
  );
}
