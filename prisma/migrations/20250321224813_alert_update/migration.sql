/*
  Warnings:

  - You are about to drop the column `involvedPersons` on the `Alert` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "involvedPersons",
ADD COLUMN     "nom" TEXT,
ADD COLUMN     "prenom" TEXT;

-- CreateTable
CREATE TABLE "Persons" (
    "id" TEXT NOT NULL,
    "codeAlert" TEXT NOT NULL,
    "nom" TEXT,
    "prenom" TEXT,

    CONSTRAINT "Persons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Persons" ADD CONSTRAINT "Persons_codeAlert_fkey" FOREIGN KEY ("codeAlert") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
