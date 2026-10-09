"use server";

import { auth } from "@/auth";
import { accessTool } from "@/lib/services/tool-access.service";
import {
  InsufficientCoinError,
  SubscriptionRequiredError,
  ToolNotFoundError,
  UnauthorizedError,
} from "@/lib/services/errors";

export type ToolAccessResult =
  | { ok: true; coinSpent: number; balanceAfter?: number }
  | { ok: false; code: "UNAUTHORIZED" | "INSUFFICIENT_COIN" | "SUBSCRIPTION_REQUIRED" | "NOT_FOUND" | "UNKNOWN"; message: string; required?: number; balance?: number };

/**
 * Backend-enforced entry point for "Gunakan X Koin" / opening a tool.
 * The frontend never decides access or deducts balance — this server
 * action is the only place that does, via the tool-access service.
 */
export async function openToolAction(toolSlug: string): Promise<ToolAccessResult> {
  const session = await auth();

  try {
    const result = await accessTool(session?.user?.id ?? null, toolSlug);
    return { ok: true, coinSpent: result.coinSpent, balanceAfter: "balanceAfter" in result ? result.balanceAfter : undefined };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return { ok: false, code: "UNAUTHORIZED", message: error.message };
    }
    if (error instanceof InsufficientCoinError) {
      return {
        ok: false,
        code: "INSUFFICIENT_COIN",
        message: error.message,
        required: error.required,
        balance: error.balance,
      };
    }
    if (error instanceof SubscriptionRequiredError) {
      return { ok: false, code: "SUBSCRIPTION_REQUIRED", message: error.message };
    }
    if (error instanceof ToolNotFoundError) {
      return { ok: false, code: "NOT_FOUND", message: error.message };
    }
    console.error("openToolAction failed", error);
    return { ok: false, code: "UNKNOWN", message: "Terjadi kesalahan. Silakan coba lagi." };
  }
}
