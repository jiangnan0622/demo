"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Copy, Globe, LogOut, Menu, UserSquare2, WalletCards, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { publicAsset } from "@/lib/public-asset";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import { REALRWA_ROUTES } from "@/projects/realrwa-demo/lib/realrwa-routes";

type TopNavProps = {
  activeIndex?: number;
  defaultWalletMenuOpen?: boolean;
  onConnectWallet?: () => void;
  onOpenIdentityVerification?: () => void;
  rightAction?: ReactNode;
};

const routeMap = [
  REALRWA_ROUTES.market,
  REALRWA_ROUTES.home,
  REALRWA_ROUTES.tokenized,
  REALRWA_ROUTES.staked,
  REALRWA_ROUTES.home,
  REALRWA_ROUTES.home,
  REALRWA_ROUTES.invitation,
] as const;

const desktopNavItems = 7;

const topNavAlignmentCss = `
  .real-topnav-shell .real-topnav-wrap {
    width: 100% !important;
    max-width: none !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    height: 72px !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    column-gap: 18px !important;
  }

  .real-topnav-shell .real-brand-lockup {
    gap: 8px !important;
  }

  .real-topnav-shell .real-topnav-brand {
    font-family: -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    line-height: 20.7px !important;
    letter-spacing: 0 !important;
  }

  .real-topnav-shell .real-topnav-logo {
    width: 46px !important;
    height: 32px !important;
  }

  .real-topnav-shell .real-topnav-nav {
    gap: 8px !important;
  }

  .real-topnav-shell .real-topnav-item {
    display: flex !important;
    height: 39px !important;
    min-width: unset !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 13px !important;
    border-radius: 10px !important;
    font-family: -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
    font-size: 16px !important;
    font-weight: 400 !important;
    line-height: 18.4px !important;
    letter-spacing: 0 !important;
  }

  .real-topnav-shell .real-topnav-item[aria-current="page"] {
    font-weight: 500 !important;
  }
`;

export function TopNav({
  activeIndex = 0,
  defaultWalletMenuOpen = false,
  onConnectWallet,
  onOpenIdentityVerification,
  rightAction,
}: TopNavProps) {
  const router = useRouter();
  const {
    lang,
    text,
    walletConnected,
    walletAddress,
    identityBound,
    identityEmail,
    displayIdentity,
    disconnectWallet,
    toggleLang,
  } = useRwaAppState();
  const [menuOpen, setMenuOpen] = useState(defaultWalletMenuOpen);
  const [mobileOpen, setMobileOpen] = useState(false);

  const statusLabel = identityBound
    ? lang === "en"
      ? "Verified"
      : "已认证"
    : lang === "en"
      ? "Unverified"
      : "未认证";

  const identityLabel = identityBound
    ? displayIdentity || identityEmail || walletAddress
    : lang === "en"
      ? "Complete Verification"
      : "未认证";

  const navigateByIndex = (index: number) => {
    const targetRoute = routeMap[index];
    if (targetRoute) {
      setMenuOpen(false);
      setMobileOpen(false);
      router.push(targetRoute);
    }
  };

  const handleCopyWallet = () => {
    navigator.clipboard?.writeText(walletAddress);
  };

  return (
    <header className="real-topnav-shell fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-black">
      <style>{topNavAlignmentCss}</style>
      <div className="real-page-wrap real-topnav-wrap mx-auto hidden h-[72px] max-w-none grid-cols-[auto_1fr_auto] items-center gap-6 px-5 lg:grid">
        <button
          type="button"
          className="real-brand-lockup flex items-center gap-2"
          onClick={() => router.push("/")}
        >
          <Image
            src={publicAsset("/realrwa/figma/real-logo-gold-cropped.png")}
            alt="REAL"
            width={46}
            height={32}
            className="real-topnav-logo h-8 w-[46px] object-contain"
            priority
          />
          <span className="real-topnav-brand text-[18px] font-bold leading-[20.7px] tracking-normal text-zinc-100">REAL</span>
        </button>

        <nav className="real-topnav-nav flex items-center justify-start gap-2">
          {text.nav.slice(0, desktopNavItems).map((item, i) => (
            <button
              key={item}
              className={`real-topnav-item rounded-[10px] px-5 py-2 text-[16px] transition ${
                i === activeIndex
                  ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-white/60 hover:bg-white/[0.04] hover:text-white"
              }`}
              aria-current={i === activeIndex ? "page" : undefined}
              type="button"
              onClick={() => navigateByIndex(i)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="real-topnav-right flex items-center justify-end gap-3">
          <button
            className="hidden items-center gap-1 text-[16px] text-white/55 transition hover:text-white sm:flex"
            onClick={toggleLang}
            type="button"
          >
            <Globe className="size-6" />
            {lang === "cn" ? "简体中文" : "EN"}
          </button>

          {rightAction ? <div className="hidden items-center sm:flex">{rightAction}</div> : null}

          {walletConnected ? (
            <div className="relative">
              <button
                className="flex h-[38px] w-[210px] items-center gap-1 rounded-[8px] border border-white/25 bg-transparent p-2"
                onClick={() => setMenuOpen((prev) => !prev)}
                type="button"
              >
                <span className="min-w-0 flex-1 truncate text-left text-[14px] leading-[22px] text-white/90">
                  <span>{identityBound ? identityLabel : walletAddress}</span>
                </span>
                {identityBound ? (
                  <span className="rounded-[4px] bg-[#0B3F2C] px-1.5 py-0.5 text-[12px] leading-4 text-[#14D596]">
                    已认证
                  </span>
                ) : null}
                <span className="flex items-center text-white/40">
                  <ChevronDown className="size-5" />
                </span>
              </button>

              {menuOpen ? (
                <div className="real-topnav-dropdown absolute right-0 top-[43px] w-[210px] overflow-hidden rounded-[8px] bg-[#201F1C] text-[14px] shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
                  <button
                    className="flex w-full items-center justify-between gap-1 bg-white/10 p-2 text-left text-white transition hover:bg-white/[0.14]"
                    onClick={handleCopyWallet}
                    type="button"
                  >
                    <span className="truncate leading-[22px]">{walletAddress}</span>
                    <Copy className="size-5 shrink-0 text-white/40" />
                  </button>

                  <button
                    className="flex w-full items-center justify-between bg-white/[0.04] p-2 text-left text-white transition hover:bg-white/[0.08]"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push(REALRWA_ROUTES.balance);
                    }}
                    type="button"
                  >
                    <span className="leading-[22px]">{lang === "cn" ? "我的订单" : "My Orders"}</span>
                    <WalletCards className="size-5 text-white/40" />
                  </button>

                  <button
                    className="flex w-full items-center justify-between bg-white/[0.04] p-2 text-left text-white transition hover:bg-white/[0.08]"
                    onClick={() => {
                      disconnectWallet();
                      setMenuOpen(false);
                    }}
                    type="button"
                  >
                    <span className="leading-[22px]">{lang === "cn" ? "断开链接" : text.disconnect}</span>
                    <LogOut className="size-5 text-white/40" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Button
              className="real-gold-btn real-topnav-cta h-10 rounded-lg px-4 text-sm"
              onClick={onConnectWallet}
            >
              {text.connectWallet}
            </Button>
          )}
        </div>
      </div>

      <div className="mx-auto flex h-[68px] max-w-[1560px] items-center justify-between px-4 lg:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="real-brand-lockup flex items-center"
            onClick={() => router.push("/")}
          >
            <Image src={publicAsset("/realrwa/figma/real-logo-gold-cropped.png")} alt="REAL" width={42} height={29} className="h-[29px] w-[42px] object-contain" priority />
          </button>
          <button
            className="grid size-9 place-items-center rounded-md text-zinc-300"
            onClick={() => setMobileOpen((prev) => !prev)}
            type="button"
          >
            <Menu className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex h-9 items-center gap-1 rounded-[9px] border border-white/12 px-2 text-[12px] text-white/65 transition hover:text-white"
            onClick={toggleLang}
            type="button"
          >
            <Globe className="size-4" />
            {lang === "cn" ? "中" : "EN"}
          </button>

          {walletConnected ? (
            <button
              type="button"
              className="grid size-9 place-items-center text-zinc-200"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <UserSquare2 className="size-5" />
            </button>
          ) : (
            <Button
              className="real-gold-btn h-10 rounded-[10px] px-4 text-[14px] font-semibold"
              onClick={onConnectWallet}
            >
              {text.connectWallet}
            </Button>
          )}
        </div>
      </div>

      {walletConnected && menuOpen ? (
        <div className="absolute right-4 top-[60px] z-50 w-[260px] rounded-[16px] border border-white/10 bg-[#2E2B26] text-sm shadow-2xl lg:hidden">
          <div className="flex items-center justify-between border-b border-white/6 px-4 py-4">
            <span className="truncate text-zinc-100">{identityLabel}</span>
            <span
              className={`rounded-[6px] px-2 py-1 text-xs font-semibold ${
                identityBound
                  ? "bg-[#0B3F2C] text-[#14D596]"
                  : "bg-[#4A3917] text-[#F0C456]"
              }`}
            >
              {statusLabel}
            </span>
          </div>

          <button
            className="flex w-full items-center justify-between px-4 py-4 text-left text-zinc-200 hover:bg-white/[0.04]"
            onClick={handleCopyWallet}
            type="button"
          >
            {walletAddress}
            <Copy className="size-4 text-zinc-500" />
          </button>

          <button
            className="flex w-full items-center justify-between px-4 py-4 text-left text-zinc-200 hover:bg-white/[0.04]"
            onClick={() => {
              setMenuOpen(false);
              router.push(REALRWA_ROUTES.balance);
            }}
            type="button"
          >
            {text.portfolio}
            <WalletCards className="size-4 text-zinc-500" />
          </button>

          {!identityBound ? (
            <button
              className="flex w-full items-center justify-between px-4 py-4 text-left text-[#f1c26a] hover:bg-white/[0.04]"
              onClick={() => {
                setMenuOpen(false);
                onOpenIdentityVerification?.();
              }}
              type="button"
            >
              {lang === "en" ? "Complete Verification" : "完成认证"}
              <ChevronDown className="size-4 -rotate-90" />
            </button>
          ) : null}

          <button
            className="flex w-full items-center justify-between px-4 py-4 text-left text-zinc-200 hover:bg-white/[0.04]"
            onClick={() => {
              disconnectWallet();
              setMenuOpen(false);
            }}
            type="button"
          >
            {text.disconnect}
            <LogOut className="size-4 text-zinc-500" />
          </button>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
            aria-label="close menu overlay"
          />
          <aside className="absolute left-0 top-0 h-full w-[80vw] max-w-[300px] border-r border-white/10 bg-[#090909] p-4">
            <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-4">
              <div className="flex items-center gap-2.5">
                <Image src={publicAsset("/logo-mark.svg")} alt="REAL" width={40} height={28} className="h-[28px] w-[40px] object-contain" />
                <span className="text-lg font-semibold text-zinc-100">REAL</span>
              </div>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-md text-zinc-400"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>

            <button
              className="mb-4 flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
              onClick={toggleLang}
              type="button"
            >
              <Globe className="size-4" />
              EN
            </button>

            <div className="grid gap-2">
              {text.nav.slice(0, desktopNavItems).map((item, i) => (
                <button
                  key={`mobile-nav-${item}`}
                  type="button"
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                    i === activeIndex
                      ? "border-[#f0c456]/40 bg-[#1d1609] text-[#f0c456]"
                      : "border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.06]"
                  }`}
                  onClick={() => navigateByIndex(i)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-4 border-t border-white/8 pt-4">
              {walletConnected ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                    {identityBound
                      ? lang === "en"
                        ? "Verified Identity"
                        : "已认证身份"
                      : lang === "en"
                        ? "Wallet"
                        : "钱包"}
                  </p>
                  <p className="mt-2 truncate text-sm text-white">{identityLabel}</p>
                  <p className="mt-1 truncate text-xs text-zinc-500">{walletAddress}</p>
                </div>
              ) : (
                <Button
                  className="real-gold-btn h-11 w-full rounded-xl px-4 text-sm"
                  onClick={() => {
                    setMobileOpen(false);
                    onConnectWallet?.();
                  }}
                >
                  {text.connectWallet}
                </Button>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
