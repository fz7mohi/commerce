// scripts/setup-db.ts

const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const password = await hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password,
        role: 'ADMIN'
      }
    });

    console.log('✅ Database has been seeded:', {
      admin: admin.email
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
