
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Loading from "@/components/Loading";
import SettingsPage from "@/app/analyste/_components/Settings";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);


  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id},
    });
    return (
      <div className="">
       <SettingsPage user={user}/>
      </div>
    );
  }else{
    return <Loading />
  }
 
};

export default Dashboard;
