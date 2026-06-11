"use client";

import React from "react";
import img from "@/public/Hero.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useSignInMutation } from "@/redux/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
};

const Page = () => {
  const [signIn, { isLoading }] = useSignInMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await signIn(data).unwrap();

      toast.success(res?.message || "Login successful 🎉");

      reset();

      // small delay helps cookie sync
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full h-screen px-6 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen items-center gap-10">

        {/* LEFT SIDE */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center relative">
            <div className="w-60 h-60 absolute bg-blue-600 blur-2xl opacity-30"></div>
            <Image
              className="h-60 w-auto object-contain"
              src={img}
              alt="signIn"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-center gap-6 w-full">

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md p-6 border rounded-2xl space-y-5"
          >
            <h3 className="text-2xl font-semibold text-blue-600 text-center">
              Sign In
            </h3>

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
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
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
            <Button
              type="submit"
              className="w-full bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-sm text-gray-700 text-center">
              don’t have an account?{" "}
              <Link href="/signUp" className="text-blue-700">
                Sign Up
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Page;