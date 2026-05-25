import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalFeedbackProvider } from "@/components/feedback/global-feedback-provider";
import { RwaAppStateProvider } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import { InsuranceDemoProvider } from "@/projects/realrwa-demo/components/realrwa/insurance-demo-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VANTA",
    template: "%s · VANTA",
  },
  description: "VANTA 的编辑型多页面产品站，强调品牌审美、交互完成度与高级材质语言。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`} suppressHydrationWarning>
        <Script id="suppress-known-extension-chainid-error" strategy="beforeInteractive">
          {`(function () {
  function isKnownChainIdError(errorLike, source) {
    var message = "";
    if (typeof errorLike === "string") message = errorLike;
    else if (errorLike && typeof errorLike.message === "string") message = errorLike.message;
    var isChainIdMutationError = message.indexOf("Cannot set property chainId of #<d> which has only a getter") !== -1;
    var isExtensionSource = typeof source === "string" && source.indexOf("chrome-extension://") === 0;
    return isChainIdMutationError && isExtensionSource;
  }
  window.addEventListener("error", function (event) {
    if (isKnownChainIdError(event.error || event.message, event.filename)) {
      event.preventDefault();
    }
  });
  window.addEventListener("unhandledrejection", function (event) {
    var reason = event.reason;
    var stack = reason && typeof reason.stack === "string" ? reason.stack : "";
    var match = stack.match(/chrome-extension:\\/\\/[^\\s)]+/);
    var extensionSource = match ? match[0] : "";
    if (isKnownChainIdError(reason, extensionSource)) {
      event.preventDefault();
    }
  });
})();`}
        </Script>
        <ThemeProvider>
          <GlobalFeedbackProvider>
            <RwaAppStateProvider>
              <InsuranceDemoProvider>{children}</InsuranceDemoProvider>
            </RwaAppStateProvider>
          </GlobalFeedbackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
