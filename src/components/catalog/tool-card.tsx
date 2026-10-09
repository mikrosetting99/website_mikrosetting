import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { AccessBadge } from "./access-badge";
import { DynamicIcon } from "@/lib/icons";
import type { Tool } from "@/generated/prisma/client";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <DynamicIcon name={tool.icon} className="h-5 w-5" />
        </span>
        <AccessBadge type={tool.accessType} />
      </div>

      <div>
        <h3 className="font-semibold text-foreground">{tool.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{tool.shortDescription}</p>
      </div>

      <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
        Buka Tool
        <ChevronRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
