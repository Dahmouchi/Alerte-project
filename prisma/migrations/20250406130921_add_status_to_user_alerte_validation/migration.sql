/*
  Warnings:

  - The `analysteValidation` column on the `Alert` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `globalValidation` column on the `Alert` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `responsableValidation` column on the `Alert` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserAlertStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'INFORMATIONS_MANQUANTES');

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "analysteValidation",
ADD COLUMN     "analysteValidation" "UserAlertStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "globalValidation",
ADD COLUMN     "globalValidation" "UserAlertStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "responsableValidation",
ADD COLUMN     "responsableValidation" "UserAlertStatus" NOT NULL DEFAULT 'PENDING';
