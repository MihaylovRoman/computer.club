-- AlterEnum
ALTER TYPE "StatusBooked" ADD VALUE 'CLOSE';

-- AlterTable
ALTER TABLE "Booked" ADD COLUMN     "dateStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;