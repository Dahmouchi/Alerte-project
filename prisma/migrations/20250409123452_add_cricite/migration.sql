/*
  Warnings:

  - A unique constraint covering the columns `[alertId]` on the table `AlertChat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "criticite" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "AlertChat_alertId_key" ON "AlertChat"("alertId");
