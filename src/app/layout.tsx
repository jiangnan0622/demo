import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalFeedbackProvider } from "@/components/feedback/global-feedback-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "REAL 后台 Demo",
    template: "%s · REAL 后台 Demo",
  },
  description: "做市上架 / 回购上架最小可运行演示版本。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <GlobalFeedbackProvider>{children}</GlobalFeedbackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
