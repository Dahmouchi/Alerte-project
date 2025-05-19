import { delay } from '@/constants/mock-api';
import { RadarGraph } from '@/features/overview/components/radar';
import prisma from '@/lib/prisma';

export default async function RadarChart() {
  let alerts: Awaited<ReturnType<typeof prisma.alert.findMany>> = []; // Infer type from Prisma

  alerts = await prisma.alert.findMany({
    where: { step: 2 },
    orderBy: { createdAt: "desc" }, // Order by newest first
  });

  await delay(1000);
  await await delay(1000);

  return <RadarGraph alertes={alerts}/>;
}
