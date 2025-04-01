-- CreateEnum
CREATE TYPE "AdminAlertStatus" AS ENUM ('PENDING', 'ASSIGNED', 'APPROVED', 'DECLINED', 'ESCALATED');

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "adminStatus" "AdminAlertStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "audioUrl" TEXT;
