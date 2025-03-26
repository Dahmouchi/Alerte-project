import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  console.log(session)
  if (!session?.user ||( session.user.twoFactorEnabled && !session.user.twoFactorVerified) ) {
    redirect("/user/login")
  } 
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 dark:bg-slate-900">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
