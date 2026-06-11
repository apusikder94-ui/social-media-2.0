"use client";

import Image from "next/image";
import React, { useState } from "react";
import img from "@/public/Hero.png";
import { Button } from "./ui/button";
import { Bell, Clapperboard, Home, Search, User } from "lucide-react";
import Post from "./Post";
import Link from "next/link";

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(false);
   const menu = [
    { id: 1, name: "Home", path: "/", icon: <Home size={20} /> },
    { id: 2, name: "Search", path: "/search", icon: <Search size={20} /> },
    { id: 3, name: "Notification", path: "/notifications", icon: <Bell size={20} /> },
    { id: 4, name: "Reel", path: "/reels", icon: <Clapperboard size={20} /> },
    { id: 5, name: "Profile", path: "/profile", icon: <User size={20} /> },
  ];

  return (
    <div className="pt-6 flex flex-col gap-6 items-start">
      {/* Logo */}
      <Image className="h-8 w-auto object-contain" src={img} alt="logo" />

      {/* Menu */}
      {menu.map((m) => (
        <Link
        key={m.id}
        className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer w-full
        hover:bg-blue-600 hover:text-white transition-all"
        href={m.path}
        >
          {m.icon}
          <p className="font-medium">{m.name}</p>
        </Link>
      ))}

      {/* Button */}
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 rounded-xl mt-2 w-full"
      >
        Create Post
      </Button>
      <Post open={open} setOpen={setOpen} />
    </div>
  );
};

export default Sidebar;
