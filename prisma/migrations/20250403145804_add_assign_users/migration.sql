-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "analysteValidation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "assignedAnalystId" TEXT,
ADD COLUMN     "assignedResponsableId" TEXT,
ADD COLUMN     "globalValidation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "responsableValidation" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_assignedAnalystId_fkey" FOREIGN KEY ("assignedAnalystId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_assignedResponsableId_fkey" FOREIGN KEY ("assignedResponsableId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
