"use client";

import Link from "next/link";
import { LayoutGrid, History, Coins, User, Settings } from "lucide-react";

import { DynamicIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Category } from "@/generated/prisma/client";

const STATIC_LINKS = [
  { href: "/history", label: "Riwayat Tool", icon: History },
  { href: "/coins", label: "Beli Koin", icon: Coins },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/profile", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function Sidebar({ categories, activeCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 border-r bg-background md:flex md:flex-col">
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        <SidebarButton
          label="Beranda"
          active={activeCategory === "all"}
          onClick={() => onSelectCategory("all")}
        >
          <LayoutGrid className="h-4 w-4" />
        </SidebarButton>

        {categories.map((category) => (
          <SidebarButton
            key={category.id}
            label={category.name}
            active={activeCategory === category.id}
            onClick={() => onSelectCategory(category.id)}
          >
            <DynamicIcon name={category.icon} className="h-4 w-4" />
          </SidebarButton>
        ))}

        <div className="my-2 border-t" />

        {STATIC_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function SidebarButton({
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
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground/80 hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
      {label}
    </button>
  );
}
