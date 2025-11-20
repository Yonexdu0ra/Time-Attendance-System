"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

function UISidebar({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchSidebar() {
      try {
        const res = await fetch("/api/sidebar");
        const sidebarData = await res.json();
        setData(sidebarData);
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSidebar();
  }, []);
  const pathname = usePathname();
  return (
    <Sidebar>
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-full rounded-md "/>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Array.from({ length: 5 }).map((item, index) => {
                    // const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton asChild>
                          <Skeleton className="h-8 w-full rounded-md"/>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {children}
          </SidebarContent>
        </>
      ) : (
        <>
          <SidebarHeader>Phần mềm chấm công</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>{item.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {children}
          </SidebarContent>
        </>
      )}
    </Sidebar>
  );
}

export default UISidebar;
