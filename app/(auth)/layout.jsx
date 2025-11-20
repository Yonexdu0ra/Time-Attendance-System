import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Đăng nhập/Đăng ký",
  description: "",
};

export default async function AuthLayout({ children }) {
  const session = await auth();

  if (session && session.user) {
    return redirect("/");
  }
  return <main>{children}</main>;
}
