"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { logout } from "@/actions/userAction";

export default function SignOut({ callbackUrl = "/login" }) {
  return (
    <form action={logout}>
      <Button
      variant="ghost"
      type="submit"
      className="w-full justify-start cursor-pointer text-destructive"
     
    >
      <LogOutIcon className="mr-2 h-4 w-4" />
      Logout
    </Button>
    </form>
  );
}
