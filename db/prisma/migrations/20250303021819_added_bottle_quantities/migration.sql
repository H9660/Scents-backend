-- CreateEnum
CREATE TYPE "Quantity" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- AlterTable
ALTER TABLE "Perfume" ADD COLUMN     "quantity" "Quantity" NOT NULL DEFAULT 'SMALL';
