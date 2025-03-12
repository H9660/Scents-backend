/*
  Warnings:

  - The primary key for the `OTP` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `OTP` table. All the data in the column will be lost.
  - Added the required column `phone` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_userId_fkey";

-- AlterTable
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_pkey",
DROP COLUMN "userId",
ADD COLUMN     "phone" TEXT NOT NULL,
ADD CONSTRAINT "OTP_pkey" PRIMARY KEY ("phone");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");
