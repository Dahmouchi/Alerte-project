-- AlterTable
ALTER TABLE "Justif" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "archive" BOOLEAN NOT NULL DEFAULT false;
