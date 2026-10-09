"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";

import { AccessBadge } from "./access-badge";
import { ToolCard } from "./tool-card";
import { HeroBanner } from "./hero-banner";
import { CategoryIconGrid } from "./category-icon-grid";
import { CategoryBreakdown } from "./category-breakdown";
import { DynamicIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import type { Category, Notification, Tool } from "@/generated/prisma/client";

type ToolWithCategory = Tool & { category: Category };

interface CatalogShellProps {
  categories: Category[];
  tools: ToolWithCategory[];
  user: { name: string | null; email: string | null; role: "USER" | "ADMIN" } | null;
  coinBalance: number;
  siteName: string;
  logoUrl?: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  notifications: Notification[];
}

export function CatalogShell({
  categories,
  tools,
  user,
  coinBalance,
  siteName,
  logoUrl,
  heroBadge,
  heroTitle,
  heroSubtitle,
  notifications,
}: CatalogShellProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showAllList, setShowAllList] = useState(false);

  function handleSelectCategory(categoryId: string) {
    setActiveCategory(categoryId);
    setShowAllList(false);
  }

  function handleShowAll() {
    setActiveCategory("all");
    setShowAllList(true);
  }

  const isListView = query.trim() !== "" || activeCategory !== "all" || showAllList;

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

  const featuredTools = useMemo(() => tools.filter((tool) => tool.isFeatured).slice(0, 4), [tools]);

  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tool of tools) {
      counts[tool.categoryId] = (counts[tool.categoryId] ?? 0) + 1;
    }
    return counts;
  }, [tools]);

  const otherTools = useMemo(() => {
    const featuredIds = new Set(featuredTools.map((t) => t.id));
    return tools.filter((tool) => !featuredIds.has(tool.id)).slice(0, 8);
  }, [tools, featuredTools]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/20 pb-16 md:pb-0">
      <TopBar
        user={user}
        coinBalance={coinBalance}
        siteName={siteName}
        logoUrl={logoUrl}
        notifications={notifications}
      />

      <div className="flex flex-1">
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        <main className="w-full min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6">
          {isListView && (
            <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
              <CategoryPill
                label="Semua"
                active={activeCategory === "all"}
                onClick={() => handleSelectCategory("all")}
              />
              {categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  label={category.name}
                  icon={category.icon}
                  active={activeCategory === category.id}
                  onClick={() => handleSelectCategory(category.id)}
                />
              ))}
            </div>
          )}

          {isListView ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setQuery("");
                    handleSelectCategory("all");
                  }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" /> Kembali ke Beranda
                </button>
                <span className="text-sm text-muted-foreground">
                  {filteredTools.length} tool ditemukan
                </span>
              </div>
              <div className="relative max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari tool, template, atau script..."
                  className="pl-9"
                />
              </div>
              <ToolListView tools={filteredTools} />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <HeroBanner
                query={query}
                onQueryChange={setQuery}
                badge={heroBadge}
                title={heroTitle}
                subtitle={heroSubtitle}
              />

              <CategoryIconGrid
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
              />

              {featuredTools.length > 0 && (
                <section className="flex flex-col gap-3">
                  <SectionHeader title="Tool Populer" onShowAll={handleShowAll} />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredTools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </section>
              )}

              <section className="flex flex-col gap-3">
                <SectionHeader title="Kategori Lainnya" onShowAll={handleShowAll} />
                <CategoryBreakdown
                  categories={categories}
                  toolCounts={toolCounts}
                  otherTools={otherTools}
                  activeCategory={activeCategory}
                  onSelectCategory={handleSelectCategory}
                />
              </section>
            </div>
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}

function SectionHeader({ title, onShowAll }: { title: string; onShowAll: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <button
        onClick={onShowAll}
        className="inline-flex items-center gap-0.5 text-sm font-medium text-primary hover:underline"
      >
        Lihat Semua
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ToolListView({ tools }: { tools: ToolWithCategory[] }) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
        <Search className="h-8 w-8" />
        <p>Tidak ada tool yang cocok dengan pencarian Anda.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-xl border bg-card">
      {tools.map((tool) => (
        <ToolRow key={tool.id} tool={tool} />
      ))}
    </ul>
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

        <AccessBadge type={tool.accessType} />

        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
}
