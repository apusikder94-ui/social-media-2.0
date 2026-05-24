"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "@/redux/authApi";
import { toast } from "sonner";
import { IAuthor } from "@/type/type";

export interface IDialog {
  open: boolean;
  setOpen: (v: boolean) => void;
  users: IAuthor;
}

const EditProfile = ({ open, setOpen, users }: IDialog) => {
  const [updateProfile] = useUpdateProfileMutation();
  const { register, handleSubmit, setValue } = useForm();

  const [image, setImage] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // ✅ AUTO SET USER DATA
  useEffect(() => {
    if (users) {
      setValue("name", users.name);
      setValue("bio", users.bio);

      // if user has existing image url
      if (users.profilePic) {
        setImage(null); // file না, শুধু preview দেখাবে URL থেকে
      }
    }
  }, [users, setValue]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("bio", data.bio);

    if (image) {
      formData.append("profilePic", image);
    }

    const res = await updateProfile(formData);

    toast.success("Profile updated successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Image */}
          <div className="flex flex-col items-center gap-2">
            <div
              onClick={() => fileRef.current?.click()}
              className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden border"
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  className="h-full w-full object-cover"
                />
              ) : users?.profilePic ? (
                <img
                  src={users.profilePic}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Camera className="text-gray-400" />
              )}
            </div>

            <input
              type="file"
              ref={fileRef}
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              {...register("name")}
              placeholder="Enter name"
              className="h-10"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <Label>Bio</Label>
            <Textarea
              {...register("bio")}
              placeholder="Write bio..."
              className="min-h-[90px]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;