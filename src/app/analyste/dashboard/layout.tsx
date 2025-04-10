import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import AccessDenied from "@/components/access";
import Header from "../_components/Header2";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    (session.user.twoFactorEnabled && !session.user.twoFactorVerified)
  ) {
    redirect("/analyste/login");
  }
  if (session.user.role !== "ANALYSTE") {
    return <AccessDenied role={session.user.role} />;
  }
  return (
    <div className="">
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset className="lg:p-2 dark:bg-slate-800 bg-slate-100">
      <Header />
      <div className="flex flex-1 flex-col gap-4 lg:p-4 pt-0 bg-white dark:bg-slate-900 lg:rounded-b-lg">
        <div className="overflow-x-auto"> {/* ✅ Add this wrapper */}
          {children}
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</div>

  );
}
