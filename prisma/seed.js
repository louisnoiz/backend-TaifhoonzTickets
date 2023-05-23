const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seed() {
    const louissarun = await prisma.user.create({
        data: {
            username: 'louissarun',
            email: 'louissarun@hotmail.com',
            password: '12345678',
            fullName: 'Sarun Viwatborvornwong',
            phone: '0904397944',
        },
    });
    console.log(`Created user ${louissarun.username} with id: ${louissarun.id}`);

    const taxwrn = await prisma.user.create({
        data: {
            username: 'taxwrn',
            email: 'taxwrn@hotmail.com',
            password: '12345678',
            fullName: 'Woranun eiei',
            phone: '0859209787',
        },
    });
    console.log(`Created user ${taxwrn.username} with id: ${taxwrn.id}`);

    const taifhoon = await prisma.user.create({
        data: {
            username: 'taifhoon',
            email: 'taifhoon@hotmail.com',
            password: '12345678',
            fullName: 'Ariyapon Unakul',
            phone: '0812345678',
        },
    });
    console.log(`Created user ${taifhoon.username} with id: ${taifhoon.id}`);
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });