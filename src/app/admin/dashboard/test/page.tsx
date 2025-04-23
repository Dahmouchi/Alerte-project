/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {  toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const [message, setMessage] = useState("");
  const sendNotification = () => {
    const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
    socket.emit("notifyUser");
    toast("Notification Sent");
  };

  return (
    <div>
      <div>
        <p>Admin Page</p>
      </div>
      <div>
        <Button onClick={sendNotification}>
          Notify All Users
        </Button>
      </div>
    </div>
  );
};

export default Admin;