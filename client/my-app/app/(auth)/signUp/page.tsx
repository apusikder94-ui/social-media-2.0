"use client";

import React from "react";
import img from "@/public/Hero.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useSignUpMutation } from "@/redux/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Page = () => {
  const [signUp] = useSignUpMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await signUp(data).unwrap();
    toast.success("Account create successfully 🎉");
    reset();
    router.push("/signIn");
  };

  return (
    <div className="max-w-7xl mx-auto w-full h-screen px-6 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen items-center gap-10">
        {/* LEFT */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center">
            <div className="w-60 h-60 absolute bg-blue-600 blur-2xl opacity-30"></div>
            <Image
              className="h-60 w-120 object-contain"
              src={img}
              alt="signUp"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center gap-6 w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full md:w-114 p-6 border rounded-2xl space-y-5"
          >
            <h3 className="text-2xl font-semibold text-blue-600 text-center">
              Sign Up
            </h3>

            {/* NAME */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Enter your name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Enter your email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Enter your password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <Button type="submit" className="w-full bg-blue-600">
              Sign Up
            </Button>

            <p className="text-sm text-gray-700 text-center">
              already have an account?{" "}
              <Link href="/signIn" className="text-blue-700">
                signIn
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
