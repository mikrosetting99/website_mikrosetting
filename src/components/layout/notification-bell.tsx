"use client";

import { useEffect, useState } from "react";
import { Bell, Info, CheckCircle2, AlertTriangle, Gift } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/generated/prisma/client";

const STORAGE_KEY = "mikrosetting:notifications:lastSeenAt";

const TYPE_ICON: Record<NotificationType, typeof Info> = {
  INFO: Info,
  SUCCESS: CheckCircle2,
  WARNING: AlertTriangle,
  PROMO: Gift,
};

const TYPE_STYLE: Record<NotificationType, string> = {
  INFO: "bg-blue-100 text-blue-600",
  SUCCESS: "bg-emerald-100 text-emerald-600",
  WARNING: "bg-amber-100 text-amber-600",
  PROMO: "bg-violet-100 text-violet-600",
};

export function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const [lastSeenAt, setLastSeenAt] = useState<number>(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Reads browser-only storage after mount (SSR has no localStorage, and a
    // lazy useState initializer would hydration-mismatch) — a single,
    // one-time sync, not the cascading-render pattern this lint rule targets.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setLastSeenAt(Number(stored));
    } catch {
      // ignore (private browsing / blocked storage)
    }
  }, []);

  const unreadCount = notifications.filter(
    (n) => new Date(n.createdAt).getTime() > lastSeenAt,
  ).length;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen && notifications.length > 0) {
      const latest = Math.max(...notifications.map((n) => new Date(n.createdAt).getTime()));
      setLastSeenAt(latest);
      try {
        localStorage.setItem(STORAGE_KEY, String(latest));
      } catch {
        // ignore
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="relative flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground hover:bg-accent"
            aria-label="Notifikasi"
          />
        }
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-3 py-2.5">
          <p className="text-sm font-semibold">Notifikasi</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Belum ada notifikasi.
            </p>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => {
                const Icon = TYPE_ICON[notification.type];
                return (
                  <li key={notification.id} className="flex gap-2.5 px-3 py-2.5">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        TYPE_STYLE[notification.type],
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{notification.message}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
