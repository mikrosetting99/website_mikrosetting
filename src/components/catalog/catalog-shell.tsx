"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Coins, LogIn } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AccessBadge } from "./access-badge";
import { DynamicIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { UserMenu } from "@/components/layout/user-menu";
import type { Category, Tool, ToolAccessType } from "@/generated/prisma/client";

type ToolWithCategory = Tool & { category: Category };

interface CatalogShellProps {
  categories: Category[];
  tools: ToolWithCategory[];
  user: { name: string | null; email: string | null; role: "USER" | "ADMIN" } | null;
  coinBalance: number;
}

export function CatalogShell({ categories, tools, user, coinBalance }: CatalogShellProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (activeCategory !== "all" && tool.categoryId !== activeCategory) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.name.toLowerCase().includes(q)
      );
    });
  }, [tools, query, activeCategory]);

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link href="/" className="shrink-0 text-lg font-bold tracking-tight text-primary">
            MIKROSETTING
          </Link>

          <div className="relative hidden flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari tool, script, template..."
              className="pl-9"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden items-center gap-1.5 rounded-full border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground sm:flex">
                  <Coins className="h-4 w-4 text-primary" />
                  {coinBalance} Koin
                </div>
                <UserMenu user={user} />
              </>
            ) : (
              <Button size="sm" render={<Link href="/login" />}>
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>

        <div className="relative px-4 pb-3 md:hidden">
          <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari tool, script, template..."
            className="pl-9"
          />
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-3">
          <CategoryPill
            label="Semua"
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              label={category.name}
              icon={category.icon}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-3">
        {filteredTools.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
            <Search className="h-8 w-8" />
            <p>Tidak ada tool yang cocok dengan pencarian Anda.</p>
          </div>
        ) : (
          <ul className="divide-y rounded-lg border bg-card">
            {filteredTools.map((tool) => (
              <ToolRow key={tool.id} tool={tool} />
            ))}
          </ul>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}

function CategoryPill({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: string | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:bg-accent",
      )}
    >
      <DynamicIcon name={icon} className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function ToolRow({ tool }: { tool: ToolWithCategory }) {
  return (
    <li>
      <Link
        href={`/tools/${tool.slug}`}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/60"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <DynamicIcon name={tool.icon} className="h-5 w-5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-foreground">{tool.name}</span>
          <span className="block truncate text-sm text-muted-foreground">
            {tool.shortDescription}
          </span>
        </span>

        <AccessBadge type={tool.accessType as ToolAccessType} />

        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
}
