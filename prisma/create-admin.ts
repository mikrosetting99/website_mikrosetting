import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL ?? process.argv[2];
  const password = process.env.ADMIN_PASSWORD ?? process.argv[3];
  const name = process.env.ADMIN_NAME ?? process.argv[4] ?? "Admin";

  if (!email || !password) {
    console.error(
      "Gunakan: npm run create-admin -- <email> <password> [nama]\n" +
        "atau set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME di environment.",
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash, name },
    create: { email, passwordHash, name, role: "ADMIN" },
  });

  console.log(`Admin siap: ${user.email} (role: ${user.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
