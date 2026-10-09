import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName: string;
  trendPercent: number | null;
}

export function StatCard({ label, value, icon: Icon, iconClassName, trendPercent }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconClassName)}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
        {trendPercent !== null && (
          <p
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trendPercent >= 0 ? "text-emerald-600" : "text-destructive",
            )}
          >
            {trendPercent >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trendPercent >= 0 ? "+" : ""}
            {trendPercent}% <span className="font-normal text-muted-foreground">dari 30 hari lalu</span>
          </p>
        )}
      </div>
    </div>
  );
}
