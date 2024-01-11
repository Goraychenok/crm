/*
  Warnings:

  - You are about to drop the column `bitrixId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bitrixId",
ADD COLUMN     "bitrix_id" INTEGER;
