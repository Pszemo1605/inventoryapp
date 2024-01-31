import React from "react";
import { authOptions } from "./../../../../lib/auth";
import { getServerSession } from "next-auth";

const Home = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (session?.user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2>Admin page - welcome back {session?.user.username}</h2>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-4xl text-center ">
        Please login to see this admin panel
      </h1>
    </div>
  );
};

export default Home;
