/*
  Warnings:

  - You are about to drop the column `isActive` on the `PropertyRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PropertyRequest" DROP COLUMN "isActive",
ADD COLUMN     "isAddressed" BOOLEAN NOT NULL DEFAULT false;
