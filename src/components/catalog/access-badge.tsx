import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ToolAccessType } from "@/generated/prisma/client";

const LABELS: Record<ToolAccessType, string> = {
  FREE: "FREE",
  COIN: "PAKAI KOIN",
  SUBSCRIBER: "SUBSCRIBER",
};

const STYLES: Record<ToolAccessType, string> = {
  FREE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  COIN: "border-amber-200 bg-amber-50 text-amber-700",
  SUBSCRIBER: "border-violet-200 bg-violet-50 text-violet-700",
};

export function AccessBadge({ type, className }: { type: ToolAccessType; className?: string }) {
  return (
    <Badge variant="outline" className={cn(STYLES[type], "shrink-0 font-medium", className)}>
      {LABELS[type]}
    </Badge>
  );
}
