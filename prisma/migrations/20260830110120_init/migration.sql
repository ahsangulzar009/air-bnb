/*
  Warnings:

  - You are about to drop the column `expireAt` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "expireAt",
ADD COLUMN     "expires_at" INTEGER;
