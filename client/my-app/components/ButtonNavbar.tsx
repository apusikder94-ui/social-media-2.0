"use client";

import React, { useState } from "react";
import {
  Home,
  Search,
  Plus,
  Clapperboard,
} from "lucide-react";
import { useGetProfileQuery } from "@/redux/authApi";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import Post from "./Post";

const ButtonNavbar = () => {
  const [open, setOpen] = useState(false);

  const { data } = useGetProfileQuery();
  const user = data?.user;

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full border-t bg-white/80 backdrop-blur-md shadow-lg z-50 md:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between px-6 py-3">
          {/* Home */}
          <button
            onClick={() => router.push("/")}
            className={`flex flex-col items-center transition ${
              isActive("/")
                ? "text-black"
                : "text-gray-500"
            }`}
          >
            <Home size={24} />
            <span className="text-[10px] mt-1">Home</span>
          </button>

          {/* Search */}
          <button
            onClick={() => router.push("/search")}
            className={`flex flex-col items-center transition ${
              isActive("/search")
                ? "text-black"
                : "text-gray-500"
            }`}
          >
            <Search size={24} />
            <span className="text-[10px] mt-1">Search</span>
          </button>

          {/* Add Post */}
          <button
            onClick={() => setOpen(true)}
            className="bg-black text-white p-4 rounded-full shadow-xl -translate-y-6 hover:scale-105 transition"
          >
            <Plus size={22} />
          </button>

          {/* Reels */}
          <button
            // onClick={() => router.push("/reels")}
            className={`flex flex-col items-center transition ${
              isActive("/reels")
                ? "text-black"
                : "text-gray-500"
            }`}
          >
            <Clapperboard size={24} />
            <span className="text-[10px] mt-1">Reels</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => router.push(`/profile`)}
            className="flex flex-col items-center"
          >
            <Avatar className="h-8 w-8 border-2 border-gray-200">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback>
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <span className="text-[10px] mt-1 text-gray-500">
              Profile
            </span>
          </button>
        </div>
      </div>

      <Post open={open} setOpen={setOpen} />
    </>
  );
};

export default ButtonNavbar;