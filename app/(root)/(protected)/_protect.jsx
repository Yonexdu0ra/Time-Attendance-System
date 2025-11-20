"use client";

import { ROUTES } from "@/app/constants/routes";
import { redirect, usePathname } from "next/navigation";

export default function Protected({ children, isLogin = false }) {
  const pathname = usePathname();
  if (isLogin) {
    redirect(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(pathname)}` );
  }
  return <>{children}</>;
}
