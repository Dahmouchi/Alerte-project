import Link from "next/link";
import  prisma from "@/lib/prisma";

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Alerts</h1>
      <Link href="/dashboard/alerts/create">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4">+ Create New Alert</button>
      </Link>
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <p className="text-gray-500">No alerts found. Start by creating one!</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="border p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Code: {alert.code}</h2>
                <p className="text-gray-600">Category: {alert.category || "Not set"}</p>
                <p className="text-gray-500">Step: {alert.step} / 4</p>
              </div>
              <Link href={`/user/dashboard/alerte/create/${alert.code}`}>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Resume</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
