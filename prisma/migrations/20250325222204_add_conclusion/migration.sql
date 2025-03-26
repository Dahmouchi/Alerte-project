/*
  Warnings:

  - The values [EN_COURS_VALIDATION,VALIDE] on the enum `AlertStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AlertStatus_new" AS ENUM ('EN_COURS_TRAITEMENT', 'TRAITE', 'REJETE', 'INFORMATIONS_MANQUANTES');
ALTER TABLE "Alert" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Alert" ALTER COLUMN "status" TYPE "AlertStatus_new" USING ("status"::text::"AlertStatus_new");
ALTER TYPE "AlertStatus" RENAME TO "AlertStatus_old";
ALTER TYPE "AlertStatus_new" RENAME TO "AlertStatus";
DROP TYPE "AlertStatus_old";
ALTER TABLE "Alert" ALTER COLUMN "status" SET DEFAULT 'EN_COURS_TRAITEMENT';
COMMIT;

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "conclusion" TEXT,
ALTER COLUMN "status" SET DEFAULT 'EN_COURS_TRAITEMENT';

-- CreateTable
CREATE TABLE "Conclusion" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "alertId" TEXT NOT NULL,

    CONSTRAINT "Conclusion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Conclusion" ADD CONSTRAINT "Conclusion_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
