"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  useOtherProfileQuery,
  useFollowOrUnFollowMutation,
  useGetProfileQuery,
} from "@/redux/authApi";

import EditProfile from "@/components/EditProfile";
import PostCard from "@/components/PostCard";

const Page = () => {
  // ================= CURRENT USER =================
  const { data: currentUserData } = useGetProfileQuery();
  const currentUser = currentUserData?.user;

  // ================= PARAM ID =================
  const params = useParams();

  const id = useMemo(() => {
    const raw = params?.id;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);
  if (!id) return null;
  // ================= OTHER PROFILE =================
  const { data, isLoading, isError, refetch } = useOtherProfileQuery(
    id as string,
    {
      skip: !id,
    },
  );

  const user = data?.user;

  const [followOrUnFollow] = useFollowOrUnFollowMutation();

  // ================= STATE =================
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  // ================= OWN PROFILE =================
  const isOwnProfile = currentUser?._id === user?._id;

  // ================= FOLLOW CHECK =================
  const isFollowing = user?._id
    ? currentUser?.following?.includes(user._id)
    : false;

  // ================= HANDLERS =================
  const handleEdit = () => {
    setEditUser(user);
    setOpen(true);
  };

  const handleFollow = async () => {
    if (!user) return;

    try {
      const res = await followOrUnFollow({ id: user._id }).unwrap();

      toast.success(res.followed ? "Followed ❤️" : "Unfollowed 💔");

      refetch?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
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
  if (isError || !user) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Profile not found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      {/* PROFILE CARD */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          {/* USER INFO */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback>{user?.name?.slice(0, 1)}</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-semibold text-lg">{user?.name}</h1>

              <p className="text-sm text-gray-500">{user?.email}</p>

              <p className="text-sm text-gray-600 mt-1">{user?.bio}</p>
            </div>
          </div>

          {/* BUTTON */}
          {isOwnProfile ? (
            <Button onClick={handleEdit} className="rounded-full">
              Edit
            </Button>
          ) : (
            <Button
              onClick={handleFollow}
              className={`rounded-full ${
                isFollowing ? "bg-gray-200 text-black" : "bg-black text-white"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {/* STATS */}
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
            <span className="font-semibold">{user?.bookmark?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="posts">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {/* POSTS */}
        <TabsContent value="posts">
          <div className="space-y-4 mt-4">
            {user?.post?.length ? (
              user.post.map((post: any) => (
                <PostCard key={post._id} post={post} refetch={refetch} />
              ))
            ) : (
              <p>No Posts Yet 🚀</p>
            )}
          </div>
        </TabsContent>

        {/* SAVED */}
        <TabsContent value="saved">
          <div className="space-y-4 mt-4">
            {user?.bookmark?.length ? (
              user.bookmark.map((post: any) => (
                <PostCard key={post._id} post={post} refetch={refetch} />
              ))
            ) : (
              <p>No Saved Posts 📌</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* EDIT MODAL */}
      <EditProfile open={open} setOpen={setOpen} users={editUser} />
    </div>
  );
};

export default Page;
