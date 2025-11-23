import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gestfrota.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@gestfrota.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Sample Vehicles
  const vehicle1 = await prisma.vehicle.upsert({
    where: { plate: 'ABC-1234' },
    update: {},
    create: {
      plate: 'ABC-1234',
      model: 'Uno',
      brand: 'Fiat',
      year: 2020,
      km: 50000,
      status: 'active',
    },
  });

  const vehicle2 = await prisma.vehicle.upsert({
    where: { plate: 'XYZ-5678' },
    update: {},
    create: {
      plate: 'XYZ-5678',
      model: 'Gol',
      brand: 'Volkswagen',
      year: 2019,
      km: 75000,
      status: 'active',
    },
  });
  console.log('✅ Sample vehicles created');

  // Create Sample Partner
  const partner = await prisma.partner.upsert({
    where: { cnpj: '12345678000190' },
    update: {},
    create: {
      name: 'Oficina Central',
      cnpj: '12345678000190',
      phone: '(11) 98765-4321',
      email: 'contato@oficinacentral.com',
      address: 'Rua das Flores, 123',
    },
  });
  console.log('✅ Sample partner created');

  // Create Sample Inspection
  await prisma.inspection.create({
    data: {
      vehicleId: vehicle1.id,
      partnerId: partner.id,
      date: new Date().toISOString(),
      km: 50500,
      status: 'PASSED',
      notes: 'Veículo em boas condições',
    },
  });
  console.log('✅ Sample inspection created');

  // Create Sample Refueling
  await prisma.refueling.create({
    data: {
      vehicleId: vehicle1.id,
      date: new Date().toISOString(),
      km: 50300,
      liters: 45.5,
      pricePerLiter: 5.89,
      totalCost: 45.5 * 5.89,
      fuelType: 'GASOLINE',
    },
  });

  await prisma.refueling.create({
    data: {
      vehicleId: vehicle2.id,
      date: new Date().toISOString(),
      km: 75200,
      liters: 50.0,
      pricePerLiter: 5.89,
      totalCost: 50.0 * 5.89,
      fuelType: 'GASOLINE',
    },
  });
  console.log('✅ Sample refuelings created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
