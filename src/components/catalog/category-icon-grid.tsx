"use client";

import { LayoutGrid } from "lucide-react";

import { DynamicIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Category } from "@/generated/prisma/client";

interface CategoryIconGridProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryIconGrid({ categories, activeCategory, onSelectCategory }: CategoryIconGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      <CategoryCard
        label="Semua"
        active={activeCategory === "all"}
        onClick={() => onSelectCategory("all")}
      >
        <LayoutGrid className="h-5 w-5" />
      </CategoryCard>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          label={category.name}
          active={activeCategory === category.id}
          onClick={() => onSelectCategory(category.id)}
        >
          <DynamicIcon name={category.icon} className="h-5 w-5" />
        </CategoryCard>
      ))}
    </div>
  );
}

function CategoryCard({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border p-3 text-center text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      {children}
      <span className="line-clamp-1">{label}</span>
    </button>
  );
}
