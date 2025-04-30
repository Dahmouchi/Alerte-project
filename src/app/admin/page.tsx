
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";

export default async function Admin() {
    const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return redirect('/admin/login');
  } else {
    redirect('/admin/dashboard/overview');
  }
}