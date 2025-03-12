/*
  Warnings:

  - The `tags` column on the `Perfume` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `price` on the `Perfume` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Perfume" DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Perfume_name_idx" ON "Perfume"("name");
