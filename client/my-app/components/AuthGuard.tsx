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

  const { data, isLoading } = useGetProfileQuery();

  const user = data?.user;

  const publicRoutes = ["/signIn", "/signUp"];

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    // ❌ Not logged in → allow ONLY public routes
    if (!user && !isPublicRoute) {
      router.replace("/signIn");
      return;
    }

    // ❌ Logged in → block auth pages
    if (user && isPublicRoute) {
      router.replace("/");
      return;
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}