/*
  Warnings:

  - The `subtotal` column on the `Transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "subtotal",
ADD COLUMN     "subtotal" INTEGER NOT NULL DEFAULT 0;
