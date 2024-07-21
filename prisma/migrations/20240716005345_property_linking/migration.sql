/*
  Warnings:

  - A unique constraint covering the columns `[propertyId]` on the table `Land` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `propertyId` to the `Land` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Land" ADD COLUMN     "propertyId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Land_propertyId_key" ON "Land"("propertyId");

-- AddForeignKey
ALTER TABLE "Land" ADD CONSTRAINT "Land_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
