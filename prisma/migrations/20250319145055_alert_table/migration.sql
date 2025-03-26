/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Alert` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContactPreference" AS ENUM ('YES', 'NO', 'ANONYMOUS');

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "category" TEXT,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "contactPreference" "ContactPreference" NOT NULL DEFAULT 'ANONYMOUS',
ADD COLUMN     "dateLieu" TIMESTAMP(3),
ADD COLUMN     "involvedPersons" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "step" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "alertId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alert_code_key" ON "Alert"("code");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
