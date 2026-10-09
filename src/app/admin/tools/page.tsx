import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolRowActions } from "@/components/admin/tool-row-actions";

export default async function AdminToolsPage() {
  const tools = await prisma.tool.findMany({
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Produk / Tools</h1>
        <Button render={<Link href="/admin/tools/new" />}>Tambah Tool</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Tool</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Akses</TableHead>
              <TableHead>Biaya Koin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Urutan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell className="font-medium">{tool.name}</TableCell>
                <TableCell>{tool.category.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{tool.accessType}</Badge>
                </TableCell>
                <TableCell>{tool.accessType === "COIN" ? tool.coinCost : "-"}</TableCell>
                <TableCell>
                  <Badge variant={tool.isActive ? "default" : "outline"}>
                    {tool.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell>{tool.sortOrder}</TableCell>
                <TableCell>
                  <ToolRowActions toolId={tool.id} isActive={tool.isActive} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {tools.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">Belum ada tool.</p>
        )}
      </div>
    </div>
  );
}
