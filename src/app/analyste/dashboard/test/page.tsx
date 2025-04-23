/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const User = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
    socket.on("notifyUser", (message) => {
      setMessage(message);
    });
    // Cleanup function to remove the event listener
    return () => {
      socket.off("notifyUser");
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div>
        <p>User Page</p>
      </div>
    </div>
  );
};

export default User;