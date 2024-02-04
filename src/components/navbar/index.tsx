import React from "react";
import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import User from "../user";
export default function Navbar () {
  
  const handleSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: `${window.location.origin}/signin`,
    });
  };
  return (
    <nav className="absolute w-full bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Inv. System
          </span>
        </a>

        <ul className="flex items-center gap-4">
          <li>
            <a
              href="/add"
              className=" p-2 text-black rounded-sm hover:bg-opacity-75"
            >
              Add Item
            </a>
          </li>
          <li>
            <button
              onClick={() => handleSignOut()}
              className="bg-red-500 p-2 text-white rounded-sm hover:bg-opacity-75"
            >
              Logout
            </button>
          </li>
          <li>
            <User />
          </li>
        </ul>
      </div>
    </nav>
  );
};

