import {config} from 'dotenv';
import path, {join} from 'path';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


config({ path: join(__dirname, ".env") });

let prisma: PrismaClient | null = null;

const prismaClient = (): PrismaClient => {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
};

export default prismaClient()
