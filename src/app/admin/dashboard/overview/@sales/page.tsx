import { delay } from '@/constants/mock-api';
import { RecentSales } from '@/features/overview/components/recent-sales';
import prisma from '@/lib/prisma';

export default async function Sales() {

  let alerts: Awaited<ReturnType<typeof prisma.alert.findMany>> = []; // Infer type from Prisma

  alerts = await prisma.alert.findMany({
    where: { step: 2 },
  include: { persons: true },
  orderBy: { createdAt: "desc" }, // Order by newest first
  take: 10, // Limit to 10 alerts
  });

  await delay(2000);
  return <RecentSales alerts={alerts}/>;
}
