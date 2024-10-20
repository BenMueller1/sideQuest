/*
  Warnings:

  - You are about to drop the column `Hometown` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Hometown",
ADD COLUMN     "hometown" TEXT;
