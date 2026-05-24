"use client";

import React, { useState } from "react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Bookmark,
  Edit,
  EllipsisVertical,
  Heart,
  MessageCircle,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { IPost } from "@/type/type";

import Comment from "./Comment";
import Post from "./Post";

import {
  useBookmarkUnBookmarkMutation,
  useGetProfileQuery,
} from "@/redux/authApi";

import {
  useDeletePostMutation,
  useLikeOrUnLikeMutation,
} from "@/redux/postApi";

type Props = {
  post: IPost;
  refetch: () => void;
};

const PostCard = ({ post, refetch }: Props) => {
  const { data } = useGetProfileQuery();

  const currentUser = data?.user;

  // ================= STATE =================
  const [commentOpen, setCommentOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedPost, setSelectedPost] =
    useState<IPost | null>(null);

  // ================= API =================
  const [deletePost] = useDeletePostMutation();

  const [likeOrUnLike] = useLikeOrUnLikeMutation();

  const [bookmarkUnBookmark] =
    useBookmarkUnBookmarkMutation();

  // ================= LIKE =================
  const handleLike = async () => {
    try {
      const res = await likeOrUnLike({
        id: post._id,
      }).unwrap();

      toast.success(
        res?.liked ? "Liked ❤️" : "Unliked 💔"
      );

      refetch?.();
    } catch {
      toast.error("Like failed");
    }
  };

  // ================= BOOKMARK =================
  const handleBookmark = async () => {
    try {
      const res = await bookmarkUnBookmark({
        id: post._id,
      }).unwrap();

      toast.success(
        res?.bookmarked
          ? "Removed Bookmark ❌"
          : "Bookmarked 📌"
      );

      refetch?.();
    } catch {
      toast.error("Bookmark failed");
    }
  };

  // ================= COMMENT =================
  const handleComment = () => {
    setSelectedPost(post);
    setCommentOpen(true);
  };

  // ================= EDIT =================
  const handleEdit = () => {
    setSelectedPost(post);
    setEditOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await deletePost({ id: post._id }).unwrap();

      toast.success("Post deleted 🗑️");

      refetch?.();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= CHECKS =================
  const isOwnPost =
    currentUser?._id === post.author?._id;

  const isBookmarked =
    currentUser?.bookmark?.includes(post._id);

  return (
    <div className="border rounded-2xl p-4 space-y-4 bg-white w-full">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">

        {/* USER */}
        <div className="flex items-center gap-3">
          <Link
            href={`/social/profile/${post.author?._id}`}
          >
            <Avatar>
              <AvatarImage
                src={post.author?.profilePic}
              />

              <AvatarFallback>
                {post.author?.name?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div>
            <h1 className="font-semibold">
              {post.author?.name}
            </h1>

            <p className="text-sm text-gray-500">
              @{post.author?.name}
            </p>
          </div>
        </div>

        {/* DROPDOWN */}
        {isOwnPost && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40">
              <DropdownMenuGroup>

                <DropdownMenuLabel>
                  Actions
                </DropdownMenuLabel>

                {/* EDIT */}
                <DropdownMenuItem
                  onClick={handleEdit}
                >
                  <Edit size={16} />
                  Edit
                </DropdownMenuItem>

                {/* DELETE */}
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                  Delete
                </DropdownMenuItem>

              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* ================= IMAGE ================= */}
      {post.post && (
        <img
          src={post.post}
          className="w-full h-72 object-cover rounded-xl"
        />
      )}

      {/* ================= ACTIONS ================= */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-5">

          {/* LIKE */}
          <div className="flex items-center gap-2">
            <Heart
              onClick={handleLike}
            />

            <span>
              {post.like?.length || 0}
            </span>
          </div>

          {/* COMMENT */}
          <div className="flex items-center gap-2">
            <MessageCircle
              onClick={handleComment}
              className="cursor-pointer"
            />

            <span>
              {post.comments?.length || 0}
            </span>
          </div>
        </div>

        {/* BOOKMARK */}
        <Bookmark
          onClick={handleBookmark}
          className={`cursor-pointer ${isBookmarked
              ? "fill-black"
              : ""
            }`}
        />
      </div>

      {/* ================= CAPTION ================= */}
      <p className="text-sm">
        <span className="font-semibold mr-2">
          {post.author?.name}
        </span>

        {post.title}
      </p>

      {/* ================= COMMENT MODAL ================= */}
      <Comment
        open={commentOpen}
        setOpen={setCommentOpen}
        post={selectedPost}
        refetch={refetch}
      />

      {/* ================= EDIT MODAL ================= */}
      {editOpen && selectedPost && (
        <Post
          open={editOpen}
          setOpen={setEditOpen}
          post={selectedPost}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default PostCard;