import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import DevtoolDetect from "@/app/devtool-detect";

export const metadata = {
  title: "Time Attendance System",
  description:
    "Phần mềm chấm công thông minh giúp quản lý thời gian làm việc hiệu quả.",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DevtoolDetect>{children}</DevtoolDetect>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
