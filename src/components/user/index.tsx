"use client";
import React from "react";
import { useSession } from "next-auth/react";
const User =  () => {
  const { data: session } = useSession();
  return <div>{session?.user.username}</div>;
};

export default User;
