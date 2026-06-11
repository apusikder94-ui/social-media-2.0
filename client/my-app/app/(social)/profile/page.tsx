"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Bookmark, LogOut, Pencil } from "lucide-react";

import {
  useGetProfileQuery,
  useLogoutMutation,
} from "@/redux/authApi";

import EditProfile from "@/components/EditProfile";
import PostCard from "@/components/PostCard";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<any>(null);

  const router = useRouter();
  const [logout] = useLogoutMutation();

  const { data, isLoading, isError, refetch } =
    useGetProfileQuery();

  const user = data?.user;

  // EDIT
  const handleEdit = (user: any) => {
    setUsers(user);
    setOpen(true);
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/signIn");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Error loading profile
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-5 py-5 space-y-6">

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* USER INFO */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">

            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback>
                {user?.name?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold">
                {user?.name}
              </h1>

              <p className="text-sm text-gray-500 break-all">
                {user?.email}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                {user?.bio || "No bio available"}
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            <Button
              onClick={() => handleEdit(user)}
              className="w-full sm:w-auto rounded-full flex items-center gap-2"
            >
              <Pencil size={16} />
              Edit
            </Button>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full sm:w-auto rounded-full flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>

          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-3 gap-4 mt-6 border-t pt-5 text-center">

          <div>
            <p className="font-bold text-lg">
              {user?.followers?.length || 0}
            </p>
            <p className="text-gray-500 text-sm">
              Followers
            </p>
          </div>

          <div>
            <p className="font-bold text-lg">
              {user?.following?.length || 0}
            </p>
            <p className="text-gray-500 text-sm">
              Following
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-bold text-lg">
              {user?.bookmark?.length || 0}
            </p>

            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Bookmark size={14} />
              Saved
            </div>
          </div>

        </div>
      </div>

      {/* ================= TABS ================= */}
      <Tabs defaultValue="posts">

        <TabsList className="grid grid-cols-2 w-full">

          <TabsTrigger value="posts">
            Posts
          </TabsTrigger>

          <TabsTrigger value="saved">
            Saved
          </TabsTrigger>

        </TabsList>

        {/* POSTS */}
        <TabsContent value="posts">
          <div className="space-y-4 mt-4">

            {user?.post?.length ? (
              user.post.map((post: any) => (
                <PostCard
                  key={post._id}
                  post={post}
                  refetch={refetch}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No Posts Yet 🚀
              </p>
            )}

          </div>
        </TabsContent>

        {/* SAVED */}
        <TabsContent value="saved">
          <div className="space-y-4 mt-4">

            {user?.bookmark?.length ? (
              user.bookmark.map((post: any) => (
                <PostCard
                  key={post._id}
                  post={post}
                  refetch={refetch}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No Saved Posts 📌
              </p>
            )}

          </div>
        </TabsContent>

      </Tabs>

      {/* ================= EDIT MODAL ================= */}
      <EditProfile
        open={open}
        setOpen={setOpen}
        users={users}
      />

    </div>
  );
};

export default Page;