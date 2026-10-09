import Link from "next/link";
import { Lock, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginRequiredCard() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/30 px-6 py-10 text-center">
      <Lock className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Silakan login terlebih dahulu untuk menggunakan tool ini.
      </p>
      <Button render={<Link href="/login" />}>
        <LogIn className="h-4 w-4" />
        Login
      </Button>
    </div>
  );
}

export function SubscriberRequiredCard() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/30 px-6 py-10 text-center">
      <Sparkles className="h-8 w-8 text-violet-500" />
      <p className="text-sm text-muted-foreground">
        Tool ini hanya untuk subscriber aktif. Berlangganan untuk membuka akses.
      </p>
      <Button render={<Link href="/coins" />}>Lihat Paket Subscriber</Button>
    </div>
  );
}
