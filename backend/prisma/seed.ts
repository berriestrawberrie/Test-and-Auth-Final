import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seed = async () => {
    console.log("seeding! But not really!");
};

seed()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
