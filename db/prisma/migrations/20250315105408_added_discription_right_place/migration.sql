/*
  Warnings:

  - You are about to drop the column `discription` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Perfume" ADD COLUMN     "discription" TEXT NOT NULL DEFAULT 'Elegant Fragrance';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "discription";
