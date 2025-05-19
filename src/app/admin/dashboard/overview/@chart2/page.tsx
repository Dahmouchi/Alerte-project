import { delay } from '@/constants/mock-api';
import { ChartCirculare } from '@/features/overview/components/chartCircualre';
import prisma from '@/lib/prisma';

export default async function Chart2() {

  let alerts: Awaited<ReturnType<typeof prisma.alert.findMany>> = []; // Infer type from Prisma

  alerts = await prisma.alert.findMany({
    where: { step: 2 },
    orderBy: { createdAt: "desc" }, // Order by newest first
  });

  await delay(1000);
  return <ChartCirculare alerts={alerts}/>;
}
