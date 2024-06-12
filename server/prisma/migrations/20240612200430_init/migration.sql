/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Hall` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Hall_name_key" ON "Hall"("name");
