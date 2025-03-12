/*
  Warnings:

  - You are about to drop the column `rating` on the `Perfume` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Perfume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Perfume" DROP COLUMN "rating",
DROP COLUMN "tags";
