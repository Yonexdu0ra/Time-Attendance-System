import { SidebarProvider } from "@/components/ui/sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";

import { lazy, Suspense } from "react";
import { cookies } from "next/headers";
const UISidebar = lazy(() => import("@/components/sidebar"));
export const metadata = {
  title: "Tuyết Công CB - Phần mềm chấm công",
  description:
    "Phần mềm chấm công thông minh giúp doanh nghiệp quản lý nhân viên hiệu quả và chính xác.",
};

export default async function RootLayout({ children }) {
  const cookiesList = await cookies();
  const openDefault = Boolean(cookiesList.get("sidebar_state")?.value === "true");
  return (
    <SidebarProvider defaultOpen={openDefault}>
      <div className="flex min-h-dvh w-full">
        <Suspense fallback={<></>}>
          <UISidebar>
            {/* <div className="border-sidebar-foreground/10 m-6 h-full rounded-md border bg-[repeating-linear-gradient(45deg,color-mix(in_oklab,var(--sidebar-foreground)10%,transparent),color-mix(in_oklab,var(--sidebar-foreground)10%,transparent)_1px,var(--sidebar)_2px,var(--sidebar)_15px)]" /> */}
          </UISidebar>
        </Suspense>
        <div className="flex flex-1 flex-col">
          <Header />
          {/* max-w-7xl */}
          <main className="mx-auto size-full  flex-1 px-4 py-6 sm:px-6">
            {children}
          </main>
          {/* <Footer /> */}
        </div>
      </div>
    </SidebarProvider>
  );
}
