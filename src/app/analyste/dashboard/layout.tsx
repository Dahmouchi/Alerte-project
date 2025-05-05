import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/app-sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import AccessDenied from "@/components/access";
import Header from "../_components/Header2";
import SusponsionPage from "@/components/susponsionPage";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (
    !session?.user ||
    (session.user.twoFactorEnabled && !session.user.twoFactorVerified)
  ) {
    redirect("/analyste/login");
  }
  if (session.user.role !== "ANALYSTE") {
    return <AccessDenied role={session.user.role} />;
  }
  if (!session.user.statut) {
    return <SusponsionPage role={session.user.role} />;
  }
  return (
    <div className="">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className=" lg:py-2 lg:px-3 dark:bg-slate-800 bg-white ">
          <Header />
          <div className="flex flex-1 flex-col gap-4 lg:p-4 pt-0 bg-white dark:bg-slate-900 rounded-lg border-x border-b shadow-[-4px_5px_10px_0px_rgba(0,_0,_0,_0.1)]">
            <div className="overflow-x-auto">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
