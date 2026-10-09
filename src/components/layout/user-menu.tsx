"use client";

import Link from "next/link";
import { LayoutDashboard, History, LogOut, User as UserIcon, Coins } from "lucide-react";

import { signOutAction } from "@/app/(auth)/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMenuProps {
  user: { name: string | null; email: string | null; role: "USER" | "ADMIN" };
}

export function UserMenu({ user }: UserMenuProps) {
  const initial = (user.name ?? user.email ?? "U").charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex items-center gap-2 rounded-full border px-1.5 py-1.5 transition-colors hover:bg-accent" />
        }
      >
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-primary text-xs text-primary-foreground">
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{user.name ?? user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/profile" />}>
            <UserIcon className="h-4 w-4" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/coins" />}>
            <Coins className="h-4 w-4" />
            Beli Koin
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/history" />}>
            <History className="h-4 w-4" />
            Riwayat Tool
          </DropdownMenuItem>
          {user.role === "ADMIN" && (
            <DropdownMenuItem render={<Link href="/admin" />}>
              <LayoutDashboard className="h-4 w-4" />
              Admin Panel
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOutAction()}>
          <LogOut className="h-4 w-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
