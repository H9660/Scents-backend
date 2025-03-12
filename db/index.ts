import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {PrismaClient} from "@prisma/client"

// Load env file from the db package directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
config({ path: join(__dirname, ".env") });

let prisma: PrismaClient | null = null;

const prismaClient = (): PrismaClient => {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
};

export default prismaClient()
