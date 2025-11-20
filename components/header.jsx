import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ProfileDropdown = lazy(() => import("@/components/dropdown-profile"));
const ModeToggle = lazy(() => import("@/components/toggle-theme"));

import { auth } from "@/auth";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/app/constants/routes";
import getInitials from "@/lib/getInitials";

const Header = async () => {
  const session = await auth();
  
  return (
    <header className="bg-card sticky top-0 z-50 border-b">
      {/* max-w-7xl */}
      <div className="mx-auto flex items-center justify-between gap-6 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="[&_svg]:size-5! cursor-pointer" />
        </div>
        <div className="flex items-center gap-1.5">
          <Suspense fallback={<Spinner />}>
            <ModeToggle />
          </Suspense>

          {session?.user ? (
            <Suspense fallback={<Spinner />}>
              <ProfileDropdown
                trigger={
                  <Button variant="ghost" size="icon" className="size-9.5 cursor-pointer">
                    <Avatar className="size-9.5 rounded-full">
                      <AvatarImage src={session.user.image} />
                      <AvatarFallback>
                        {getInitials(session.user.name) ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
                user={session.user}
              />
            </Suspense>
          ) : (
            <Link href={ROUTES.LOGIN}>
              <Button className="w-full cursor-pointer">Đăng nhập</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
