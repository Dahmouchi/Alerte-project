-- CreateTable
CREATE TABLE "Justif" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Justif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileJustif" (
    "id" SERIAL NOT NULL,
    "justifId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileJustif_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Justif_alertId_key" ON "Justif"("alertId");

-- AddForeignKey
ALTER TABLE "Justif" ADD CONSTRAINT "Justif_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileJustif" ADD CONSTRAINT "FileJustif_justifId_fkey" FOREIGN KEY ("justifId") REFERENCES "Justif"("id") ON DELETE CASCADE ON UPDATE CASCADE;
