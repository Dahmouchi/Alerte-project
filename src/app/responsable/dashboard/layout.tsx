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
  console.log(session)
  if (
    !session?.user ||
    (session.user.twoFactorEnabled && !session.user.twoFactorVerified)
  ) {
    redirect("/responsable/login");
  }
  if (session.user.role !== "RESPONSABLE"  && session.user.role !== "ADMIN_RESPONSABLE") {
    return <AccessDenied role={session.user.role} />;
  }
  if (!session.user.statut) {
    return <SusponsionPage role={session.user.role} />;
  }
  return (
    <div className="">
   <SidebarProvider>
     <AppSidebar />
     <SidebarInset className=" lg:py-2 lg:pr-2 dark:bg-slate-800 bg-slate-200 ">
     <Header />
       <div className="flex flex-1 flex-col gap-4 lg:p-4 pt-0 bg-white dark:bg-slate-900 rounded-b-lg">
         <div className="overflow-x-auto">
           {children}
         </div>
       </div>
     </SidebarInset>
   </SidebarProvider>
</div>

  );
}
