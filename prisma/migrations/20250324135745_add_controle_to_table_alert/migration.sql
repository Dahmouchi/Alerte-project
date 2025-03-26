-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "involved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "textAudio" BOOLEAN NOT NULL DEFAULT true;
