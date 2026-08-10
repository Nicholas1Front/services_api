import {PrismaClient} from '@prisma/client';

import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// npx prisma db seed - to execute this script

async function main() {
  console.log('Entrou na seed');

  const password = await bcrypt.hash('123456', 10);

  console.log('Hash criada');

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@gmail.com',
    },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gmail.com',
      passwordHash: password,
      role: 'ADMIN',
    },
  });

  console.log('Admin:', admin);

  const users = await prisma.user.findMany();

  console.log('Usuários no banco:', users);
}

main()
    .catch((error)=>{
        console.error(error);
        process.exit(1);
    })
    .finally(async ()=>{
        await prisma.$disconnect();
    })