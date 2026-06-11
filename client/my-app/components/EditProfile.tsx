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
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  // SET DEFAULT DATA
  useEffect(() => {
    if (users) {
      setValue("name", users.name);
      setValue("bio", users.bio);
      setImage(null);
    }
  }, [users, setValue]);

  // SUBMIT
  const onSubmit = async (data: any) => {
    if (loading) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("bio", data.bio);

      if (image) {
        formData.append("profilePic", image);
      }

      await updateProfile(formData).unwrap();

      toast.success("Profile updated successfully");

      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
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

          {/* IMAGE UPLOAD */}
          <div className="flex flex-col items-center gap-2">

            <div
              onClick={() => !loading && fileRef.current?.click()}
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
              disabled={loading}
            />

          </div>

          {/* NAME */}
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              {...register("name")}
              placeholder="Enter name"
              disabled={loading}
            />
          </div>

          {/* BIO */}
          <div className="space-y-1">
            <Label>Bio</Label>
            <Textarea
              {...register("bio")}
              placeholder="Write bio..."
              className="min-h-[90px]"
              disabled={loading}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 pt-2">

            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 min-w-[110px]"
            >
              {loading ? "Saving..." : "Save"}
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;