"use client";

import React, { useState } from "react";

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
import { Bookmark } from "lucide-react";

import { useGetProfileQuery } from "@/redux/authApi";

import EditProfile from "@/components/EditProfile";
import PostCard from "@/components/PostCard";

const Page = () => {
  // ================= STATE =================
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<any>(null);

  // ================= API =================
  const { data, isLoading, isError, refetch } =
    useGetProfileQuery();

  const user = data?.user;

  // ================= EDIT PROFILE =================
  const handleEdit = (user: any) => {
    setUsers(user);
    setOpen(true);
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ================= ERROR =================
  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Error loading profile
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">

        <div className="flex items-center justify-between">

          {/* USER INFO */}
          <div className="flex items-center gap-4">

            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback>
                {user?.name?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-semibold text-lg">
                {user?.name}
              </h1>

              <p className="text-sm text-gray-500">
                {user?.email}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                {user?.bio}
              </p>
            </div>

          </div>

          {/* EDIT BUTTON */}
          <Button
            onClick={() => handleEdit(user)}
            className="rounded-full"
          >
            Edit
          </Button>

        </div>

        {/* ================= STATS ================= */}
        <div className="flex justify-between mt-6 text-sm">

          <div>
            <span className="font-semibold">
              {user?.followers?.length || 0}
            </span>{" "}
            Followers
          </div>

          <div>
            <span className="font-semibold">
              {user?.following?.length || 0}
            </span>{" "}
            Following
          </div>

          <div className="flex items-center gap-1">
            <Bookmark size={14} />

            <span className="font-semibold">
              {user?.bookmark?.length || 0}
            </span>
          </div>

        </div>
      </div>

      {/* ================= TABS ================= */}
      <Tabs defaultValue="posts">

        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {/* ================= POSTS ================= */}
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

        {/* ================= SAVED ================= */}
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