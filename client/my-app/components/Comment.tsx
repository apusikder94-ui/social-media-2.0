"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useForm } from "react-hook-form";

import {
  useCreateCommentMutation,
  useGetAllCommentQuery,
} from "@/redux/commentApi";

import { IPost } from "@/type/type";

interface CommentProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  post: IPost | null;
  refetch?: () => void;
}

type FormData = {
  comment: string;
};

const Comment = ({ open, setOpen, post, refetch }: CommentProps) => {
  const postId = post?._id;

  const { data } = useGetAllCommentQuery(
    { id: postId as string },
    { skip: !postId }
  );

  const [createComment] = useCreateCommentMutation();

  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    if (!postId) return;

    try {
      await createComment({
        id: postId,
        comment: formData.comment,
      }).unwrap();

      refetch?.();
      reset();
    } catch (error) {
      console.log("Comment failed", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:min-w-5xl p-0 overflow-hidden rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 h-125">

          {/* LEFT IMAGE */}
          <div className="hidden md:block">
            <div className="relative bg-black w-full h-full">
              {post?.post && (
                <Image src={post.post} alt="post" fill className="object-cover" />
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col h-full min-h-0">

            {/* USER HEADER */}
            <div className="flex items-center gap-3 p-4 border-b">
              <Link href={`/social/profile/${post?.author?._id}`}>
                <Avatar>
                  <AvatarImage src={post?.author?.profilePic} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <p className="font-semibold text-sm">
                  {post?.author?.name}
                </p>
                <p className="text-xs text-gray-500">
                  @{post?.author?.name}
                </p>
              </div>
            </div>

            {/* COMMENTS (SCROLL FIX HERE) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
              {data?.comment?.length ? (
                data.comment.map((c: any) => (
                  <div key={c._id} className="flex gap-3">
                    <Link href={`/social/profile/${c?.author?._id}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={c?.author?.profilePic} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Link>

                    <div>
                      <p className="text-sm font-medium">
                        {c?.author?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {c.comment}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  No comments yet
                </p>
              )}
            </div>

            {/* INPUT */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-4 border-t flex gap-2"
            >
              <Input
                {...register("comment", { required: true })}
                placeholder="Write a comment..."
                className="rounded-full"
              />

              <Button type="submit" className="rounded-full bg-blue-500">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Comment;