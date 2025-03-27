"use client"

import { useSession } from "next-auth/react"
import AlertForm from "./form";

const Create = () => {
 const session = useSession();
  return (
    <div>
      {session.data &&   <AlertForm userId={session.data?.user.id}/>}
    </div>
  )
}

export default Create