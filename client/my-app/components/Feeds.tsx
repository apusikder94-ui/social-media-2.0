"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetAllPostQuery, useISFollowingQuery } from "@/redux/postApi";

import { IPost } from "@/type/type";
import PostCard from "./PostCard";

const Feeds = () => {
  // Get all posts
  const {
    data: allPostsData,
    isLoading,
    error,
    refetch
  } = useGetAllPostQuery();

  // Get following posts
  const { data: followingData } = useISFollowingQuery();
  // Store posts in variable
  const posts: IPost[] = allPostsData?.post || [];

  // Store following posts
  const followingPosts: IPost[] = followingData?.posts || [];

  // Loading state
  if (isLoading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading...
      </p>
    );
  }

  // Error state
  if (error) {
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load posts
      </p>
    );
  }

  return (
    <div className="w-full">
      {/* Tabs */}
      <Tabs defaultValue="foryou" className="pt-4 md:pt-0">

        {/* Tab Buttons */}
        <TabsList className="grid grid-cols-2 w-full h-14 mb-6">
          <TabsTrigger value="foryou" className="text-lg md:text-sm">
            For You
          </TabsTrigger>

          <TabsTrigger value="following" className="text-lg md:text-sm">
            Following
          </TabsTrigger>
        </TabsList>

        {/* ================= FOR YOU POSTS ================= */}
        <TabsContent value="foryou" className="space-y-5">

          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="rounded-xl p-4"
              >
                {/* Post Card */}
                <PostCard post={post} refetch={refetch}/>
              </div>
            ))
          ) : (
            <p className="text-center py-10">
              No Posts Found
            </p>
          )}

        </TabsContent>

        {/* ================= FOLLOWING POSTS ================= */}
        <TabsContent value="following" className="space-y-5">

          {followingPosts.length > 0 ? (
            followingPosts.map((post) => (
              <div
                key={post._id}
                className="rounded-xl p-4"
              >
                {/* Post Card */}
                <PostCard post={post} refetch={refetch}/>
              </div>
            ))
          ) : (
            <p className="text-center py-10">
              No Following Posts
            </p>
          )}

        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Feeds;