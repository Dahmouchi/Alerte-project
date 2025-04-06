/*
  Warnings:

  - Added the required column `createdById` to the `Conclusion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conclusion" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Conclusion" ADD CONSTRAINT "Conclusion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
