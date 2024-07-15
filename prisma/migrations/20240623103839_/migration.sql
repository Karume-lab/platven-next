-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "merchantRequestId" DROP NOT NULL,
ALTER COLUMN "checkoutRequestId" DROP NOT NULL;
