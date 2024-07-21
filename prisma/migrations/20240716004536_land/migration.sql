/*
  Warnings:

  - You are about to drop the column `roadAccessNature` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "roadAccessNature",
DROP COLUMN "size";

-- CreateTable
CREATE TABLE "Land" (
    "id" UUID NOT NULL,
    "roadAccessNature" "PropertyRoadAccessNature" NOT NULL,
    "size" TEXT,

    CONSTRAINT "Land_pkey" PRIMARY KEY ("id")
);
