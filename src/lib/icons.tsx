import {
  Router,
  Wifi,
  Network,
  Shield,
  Wrench,
  Globe,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  router: Router,
  wifi: Wifi,
  network: Network,
  shield: Shield,
  wrench: Wrench,
  globe: Globe,
  grid: LayoutGrid,
};

export function resolveIcon(icon?: string | null): LucideIcon {
  if (!icon) return Wrench;
  return CATEGORY_ICON_MAP[icon] ?? Wrench;
}

/**
 * Renders a category/tool icon by key. A single stable component (rather
 * than callers assigning `resolveIcon(icon)` to a local PascalCase variable
 * and rendering that) so the icon lookup itself can safely vary per prop.
 */
export function DynamicIcon({ name, className }: { name?: string | null; className?: string }) {
  // Icon is always one of the fixed, module-level components in
  // CATEGORY_ICON_MAP (never created fresh) — safe despite the lint rule's
  // generic "component created during render" heuristic.
  /* eslint-disable react-hooks/static-components */
  const Icon = resolveIcon(name);
  return <Icon className={className} />;
  /* eslint-enable react-hooks/static-components */
}
