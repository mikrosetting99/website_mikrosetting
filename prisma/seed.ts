import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { name: "MikroTik", slug: "mikrotik", icon: "router", sortOrder: 1 },
  { name: "Hotspot", slug: "hotspot", icon: "wifi", sortOrder: 2 },
  { name: "OLT", slug: "olt", icon: "network", sortOrder: 3 },
  { name: "VPN", slug: "vpn", icon: "shield", sortOrder: 4 },
  { name: "Tools", slug: "tools", icon: "wrench", sortOrder: 5 },
  { name: "Website", slug: "website", icon: "globe", sortOrder: 6 },
  { name: "Lainnya", slug: "lainnya", icon: "grid", sortOrder: 7 },
];

const TOOLS = [
  {
    categorySlug: "mikrotik",
    name: "Setting MikroTik",
    slug: "setting-mikrotik",
    shortDescription: "Konfigurasi MikroTik untuk berbagai kebutuhan jaringan.",
    description: "Kumpulan script dasar untuk konfigurasi router MikroTik: interface, IP address, dan routing.",
    icon: "router",
    accessType: "FREE" as const,
    coinCost: 0,
    sortOrder: 1,
    isFeatured: true,
  },
  {
    categorySlug: "hotspot",
    name: "Login Page Hotspot",
    slug: "login-page-hotspot",
    shortDescription: "Template halaman login hotspot MikroTik.",
    description: "Generator template halaman login hotspot yang bisa disesuaikan dengan branding Anda.",
    icon: "wifi",
    accessType: "FREE" as const,
    coinCost: 0,
    sortOrder: 2,
    isFeatured: true,
  },
  {
    categorySlug: "vpn",
    name: "VPN MikroTik",
    slug: "vpn-mikrotik",
    shortDescription: "Generator konfigurasi VPN MikroTik.",
    description: "Generate konfigurasi VPN client MikroTik untuk protokol L2TP, PPTP, WireGuard, dan OpenVPN.",
    icon: "shield",
    accessType: "COIN" as const,
    coinCost: 10,
    sortOrder: 3,
    isFeatured: true,
  },
  {
    categorySlug: "mikrotik",
    name: "Script FUP PPPoE",
    slug: "script-fup-pppoe",
    shortDescription: "Script Fair Usage Policy untuk pelanggan PPPoE.",
    description: "Generate script FUP (Fair Usage Policy) untuk membatasi kecepatan pelanggan PPPoE setelah kuota tertentu.",
    icon: "router",
    accessType: "COIN" as const,
    coinCost: 10,
    sortOrder: 4,
    isFeatured: true,
  },
  {
    categorySlug: "tools",
    name: "IP Calculator",
    slug: "ip-calculator",
    shortDescription: "Hitung network, broadcast, dan range IP dari CIDR.",
    description: "Kalkulator subnetting IPv4: masukkan alamat IP dan prefix CIDR untuk mendapatkan network, broadcast, netmask, dan range host.",
    icon: "wrench",
    accessType: "FREE" as const,
    coinCost: 0,
    sortOrder: 5,
  },
  {
    categorySlug: "tools",
    name: "Speed Test Bypass",
    slug: "speed-test-bypass",
    shortDescription: "Script bypass speed test untuk pengujian bandwidth.",
    description: "Script untuk mengecualikan trafik speed test dari queue/simple queue agar hasil pengujian lebih akurat.",
    icon: "wrench",
    accessType: "COIN" as const,
    coinCost: 5,
    sortOrder: 6,
  },
  {
    categorySlug: "website",
    name: "Website Isolir",
    slug: "website-isolir",
    shortDescription: "Template halaman isolir pelanggan.",
    description: "Generator halaman redirect isolir untuk pelanggan yang belum melakukan pembayaran.",
    icon: "globe",
    accessType: "COIN" as const,
    coinCost: 10,
    sortOrder: 7,
  },
  {
    categorySlug: "olt",
    name: "OLT Configuration",
    slug: "olt-configuration",
    shortDescription: "Konfigurasi OLT untuk layanan fiber optik.",
    description: "Panduan dan script konfigurasi OLT untuk provisioning ONT pelanggan fiber optik. Khusus subscriber aktif.",
    icon: "network",
    accessType: "SUBSCRIBER" as const,
    coinCost: 0,
    sortOrder: 8,
  },
  {
    categorySlug: "mikrotik",
    name: "Backup & Restore MikroTik",
    slug: "backup-restore-mikrotik",
    shortDescription: "Script backup dan restore konfigurasi MikroTik.",
    description: "Script untuk backup konfigurasi RouterOS secara terjadwal dan restore saat dibutuhkan.",
    icon: "router",
    accessType: "FREE" as const,
    coinCost: 0,
    sortOrder: 9,
  },
];

const COIN_PACKAGES = [
  { name: "100 Koin", coinAmount: 100, price: 15000, bonusCoin: 0, sortOrder: 1 },
  { name: "250 Koin", coinAmount: 250, price: 35000, bonusCoin: 10, sortOrder: 2 },
  { name: "500 Koin", coinAmount: 500, price: 65000, bonusCoin: 30, sortOrder: 3 },
  { name: "1000 Koin", coinAmount: 1000, price: 120000, bonusCoin: 100, sortOrder: 4 },
];

const SUBSCRIPTION_PLANS = [
  { name: "Subscriber Bulanan", price: 50000, durationDays: 30 },
  { name: "Subscriber Tahunan", price: 500000, durationDays: 365 },
];

async function main() {
  console.log("Seeding categories...");
  const categoryMap = new Map<string, string>();
  for (const category of CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, icon: category.icon, sortOrder: category.sortOrder },
      create: category,
    });
    categoryMap.set(category.slug, record.id);
  }

  console.log("Seeding tools...");
  for (const tool of TOOLS) {
    const categoryId = categoryMap.get(tool.categorySlug);
    if (!categoryId) continue;
    const data = {
      categoryId,
      name: tool.name,
      slug: tool.slug,
      shortDescription: tool.shortDescription,
      description: tool.description,
      icon: tool.icon,
      accessType: tool.accessType,
      coinCost: tool.coinCost,
      sortOrder: tool.sortOrder,
      isFeatured: tool.isFeatured ?? false,
    };
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: data,
      create: data,
    });
  }

  console.log("Seeding coin packages...");
  for (const pkg of COIN_PACKAGES) {
    const existing = await prisma.coinPackage.findFirst({ where: { name: pkg.name } });
    if (existing) {
      await prisma.coinPackage.update({ where: { id: existing.id }, data: pkg });
    } else {
      await prisma.coinPackage.create({ data: pkg });
    }
  }

  console.log("Seeding subscription plans...");
  for (const plan of SUBSCRIPTION_PLANS) {
    const existing = await prisma.subscriptionPlan.findFirst({ where: { name: plan.name } });
    if (existing) {
      await prisma.subscriptionPlan.update({ where: { id: existing.id }, data: plan });
    } else {
      await prisma.subscriptionPlan.create({ data: plan });
    }
  }

  console.log("Seed selesai.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
