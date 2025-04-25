/*
  Warnings:

  - You are about to drop the `Justif` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FileJustif" DROP CONSTRAINT "FileJustif_justifId_fkey";

-- DropForeignKey
ALTER TABLE "Justif" DROP CONSTRAINT "Justif_alertId_fkey";

-- DropTable
DROP TABLE "Justif";

-- AddForeignKey
ALTER TABLE "FileJustif" ADD CONSTRAINT "FileJustif_justifId_fkey" FOREIGN KEY ("justifId") REFERENCES "Conclusion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
