import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@fleet.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
  const hash = await bcrypt.hash(adminPassword, 10);

  // upsert admin user
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: 'Admin', password: hash, role: 'admin' },
    create: { name: 'Admin', email: adminEmail, password: hash, role: 'admin' }
  });

  // sample vehicle
  await prisma.vehicle.upsert({
    where: { plate: 'ABC-1234' },
    update: {},
    create: { plate: 'ABC-1234', model: 'Uno', brand: 'Fiat', year: 2015, km: 123000 }
  });

  console.log('Seed finished. Admin:', adminEmail);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
