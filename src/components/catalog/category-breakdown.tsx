"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { AccessBadge } from "./access-badge";
import { DynamicIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Category, Tool } from "@/generated/prisma/client";

interface CategoryBreakdownProps {
  categories: Category[];
  toolCounts: Record<string, number>;
  otherTools: Tool[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryBreakdown({
  categories,
  toolCounts,
  otherTools,
  activeCategory,
  onSelectCategory,
}: CategoryBreakdownProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-1 rounded-xl border bg-card p-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
              activeCategory === category.id
                ? "bg-accent text-foreground"
                : "text-foreground/80 hover:bg-accent",
            )}
          >
            <DynamicIcon name={category.icon} className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{category.name}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {toolCounts[category.id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <ul className="divide-y rounded-xl border bg-card">
        {otherTools.map((tool) => (
          <li key={tool.id}>
            <Link
              href={`/tools/${tool.slug}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <DynamicIcon name={tool.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">{tool.name}</span>
                <span className="block truncate text-sm text-muted-foreground">
                  {tool.shortDescription}
                </span>
              </span>
              <AccessBadge type={tool.accessType} />
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
        {otherTools.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">
            Tidak ada tool lain di kategori ini.
          </li>
        )}
      </ul>
    </div>
  );
}
