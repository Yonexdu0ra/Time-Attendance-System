"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { lazy, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { ROUTES } from "@/app/constants/routes";
import { toast } from "sonner";
import useFingerprint from "@/hooks/useFingerprint";
const SignInWithGoogle = lazy(() => import("@/components/sign-in-with-google"));

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const fingerprint = useFingerprint();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const handleSubmit = async (e) => {
    const toastId = toast.loading("Signing in...");
    e.preventDefault(); // ⚠️ chặn reload trang

    try {
      if (!fingerprint)
        throw new Error(
          "Đang lấy thông tin thiết bị, vui lòng thử lại sau giây lát."
        );
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: redirect || "/",
      });

      if (res.error) throw new Error(res.code);

      toast.success("Signed in successfully!", {
        id: toastId,
      });
      router.push(res.url || "/");
    } catch (error) {
      toast.error(error.message, {
        id: toastId,
      });
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
          <h2 className="text-center text-xl font-semibold text-foreground">
            Đăng nhập vào tài hệ thống
          </h2>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <Label htmlFor="email" className="font-medium text-foreground">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Nhập email của bạn"
                className="mt-2"
                autoFocus
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password" className="font-medium text-foreground">
                Mật khẩu
              </Label>
              <Input
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                type="password"
                id="password"
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                className="mt-2"
                required
                autoComplete="off"

              />
            </div>

            <Button type="submit" className="mt-4 w-full cursor-pointer">
              Đăng nhập
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                hoặc với
              </span>
            </div>
          </div>

          <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <SignInWithGoogle redirectTo={redirect} />
          </Suspense>
          <Button
            type="submit"
            variant="outline"
            className="inline-flex w-full items-center justify-center space-x-2 cursor-pointer mt-4"
            asChild
          >
            <Link
              href={ROUTES.REGISTER}
              className="flex items-center justify-center w-full space-x-2"
            >
              <KeyRound className="size-5" aria-hidden />
              <span className="text-sm font-medium">Đăng ký với tài khoản</span>
            </Link>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <a href="#" className="underline underline-offset-4">
              điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="underline underline-offset-4">
              chính sách bảo mật
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
