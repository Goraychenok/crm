import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

dotenv.config();
const prisma = new PrismaClient();

const createAdmin = async () => {
  await prisma.user.create({
    data: {
      email: 'goryachev.na72@gmail.com',
      password: await hash('5u33nCA5'),
      name: 'Горячев Никита',
      phone: '+79199351201',
      role: 'ADMIN',
      bitrixId: 82,
    },
  });
};

async function main() {
  console.log('Start seeding ...');
  await createAdmin();
  console.log('Seeding complete!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
