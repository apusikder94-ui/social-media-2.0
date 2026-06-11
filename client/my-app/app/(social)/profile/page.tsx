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

import {
  Bookmark,
  LogOut,
  Pencil,
  Users,
  UserPlus,
} from "lucide-react";

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

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetProfileQuery();

  const user = data?.user;

  const handleEdit = (user: any) => {
    setUsers(user);
    setOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/signIn");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-medium">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Error loading profile
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5 py-5">
      {/* Profile Card */}
      <div className="bg-white border rounded-3xl shadow-sm p-5 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
          {/* User Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback className="text-2xl">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">
                {user?.name}
              </h1>

              <p className="text-gray-500 break-all">
                {user?.email}
              </p>

              <p className="text-sm text-gray-600 mt-3 max-w-lg">
                {user?.bio || "No bio available"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              onClick={() => handleEdit(user)}
              className="w-full sm:w-auto rounded-full"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>

            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full sm:w-auto rounded-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 border-t pt-6">
          <div className="text-center">
            <h2 className="font-bold text-xl">
              {user?.followers?.length || 0}
            </h2>

            <div className="flex justify-center items-center gap-1 text-gray-500 text-sm">
              <Users size={15} />
              Followers
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-bold text-xl">
              {user?.following?.length || 0}
            </h2>

            <div className="flex justify-center items-center gap-1 text-gray-500 text-sm">
              <UserPlus size={15} />
              Following
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-bold text-xl">
              {user?.bookmark?.length || 0}
            </h2>

            <div className="flex justify-center items-center gap-1 text-gray-500 text-sm">
              <Bookmark size={15} />
              Saved
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="posts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">
              Posts
            </TabsTrigger>

            <TabsTrigger value="saved">
              Saved
            </TabsTrigger>
          </TabsList>

          {/* Posts */}
          <TabsContent value="posts">
            <div className="mt-5 space-y-5">
              {user?.post?.length > 0 ? (
                user.post.map((post: any) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    refetch={refetch}
                  />
                ))
              ) : (
                <div className="border rounded-xl p-8 text-center text-gray-500">
                  No Posts Yet 🚀
                </div>
              )}
            </div>
          </TabsContent>

          {/* Saved Posts */}
          <TabsContent value="saved">
            <div className="mt-5 space-y-5">
              {user?.bookmark?.length > 0 ? (
                user.bookmark.map((post: any) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    refetch={refetch}
                  />
                ))
              ) : (
                <div className="border rounded-xl p-8 text-center text-gray-500">
                  No Saved Posts 📌
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Modal */}
      <EditProfile
        open={open}
        setOpen={setOpen}
        users={users}
      />
    </div>
  );
};

export default Page;