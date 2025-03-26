import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Redirect to login if not authenticated
    redirect("/admin/login");
  }

  return <div>{children}</div>;
}
