"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGetProfileQuery } from "@/redux/authApi";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, isError } = useGetProfileQuery();

  useEffect(() => {
    if (!isLoading) {
      // not logged in
      if (!data?.user) {
        router.push("/auth/signUp");
      }

      // logged in but trying to access auth pages
      if (data?.user && pathname.startsWith("/auth")) {
        router.push("/social");
      }
    }
  }, [data, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}