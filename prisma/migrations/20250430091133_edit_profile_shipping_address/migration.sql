-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "shippingAddress" VARCHAR(54) NOT NULL DEFAULT '';
