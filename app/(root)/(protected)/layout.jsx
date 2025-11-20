import { auth, useAuth } from "@/auth";
import { redirect } from "next/navigation";
import Protected from "./_protect";
async function ProtectedLayout({ children }) {
  const session = await auth();
  const isLogin = !session || !session.user;
  return <Protected isLogin={isLogin}>{children}</Protected>;
}

export default ProtectedLayout;
