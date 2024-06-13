/*
  Warnings:

  - You are about to drop the column `price` on the `Booked` table. All the data in the column will be lost.
  - You are about to drop the column `seatId` on the `Booked` table. All the data in the column will be lost.
  - You are about to drop the `SeatsInHall` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Hall` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hours` to the `Booked` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Booked` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Hall` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hallId` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusBooked" AS ENUM ('PROCESS', 'PENDING');

-- DropForeignKey
ALTER TABLE "Booked" DROP CONSTRAINT "Booked_seatId_fkey";

-- DropForeignKey
ALTER TABLE "SeatsInHall" DROP CONSTRAINT "SeatsInHall_hallId_fkey";

-- DropForeignKey
ALTER TABLE "SeatsInHall" DROP CONSTRAINT "SeatsInHall_seatId_fkey";

-- AlterTable
ALTER TABLE "Booked" DROP COLUMN "price",
DROP COLUMN "seatId",
ADD COLUMN     "hours" INTEGER NOT NULL,
ADD COLUMN     "status" "StatusBooked" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Hall" ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "hallId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET DEFAULT 0;

-- DropTable
DROP TABLE "SeatsInHall";

-- CreateTable
CREATE TABLE "Additionally" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Additionally_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookedToSeat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AdditionallyToBooked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookedToSeat_AB_unique" ON "_BookedToSeat"("A", "B");

-- CreateIndex
CREATE INDEX "_BookedToSeat_B_index" ON "_BookedToSeat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AdditionallyToBooked_AB_unique" ON "_AdditionallyToBooked"("A", "B");

-- CreateIndex
CREATE INDEX "_AdditionallyToBooked_B_index" ON "_AdditionallyToBooked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Hall_name_key" ON "Hall"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "Hall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookedToSeat" ADD CONSTRAINT "_BookedToSeat_A_fkey" FOREIGN KEY ("A") REFERENCES "Booked"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookedToSeat" ADD CONSTRAINT "_BookedToSeat_B_fkey" FOREIGN KEY ("B") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdditionallyToBooked" ADD CONSTRAINT "_AdditionallyToBooked_A_fkey" FOREIGN KEY ("A") REFERENCES "Additionally"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdditionallyToBooked" ADD CONSTRAINT "_AdditionallyToBooked_B_fkey" FOREIGN KEY ("B") REFERENCES "Booked"("id") ON DELETE CASCADE ON UPDATE CASCADE;
