"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import { copyOf, feedbackCopy } from "@/projects/realrwa-demo/lib/feedback-copy";

type ConnectWalletModalProps = {
  open: boolean;
  onClose: () => void;
};

type WalletOption = {
  name: string;
  icon: "fox" | "coinbase" | "okx" | "walletconnect";
  badgeCn?: string;
  badgeEn?: string;
};

const walletOptions: WalletOption[] = [
  { name: "Metamask", badgeCn: "最受欢迎", badgeEn: "Popular", icon: "fox" as const },
  { name: "Coinbase Wallet", icon: "coinbase" as const },
  { name: "OKX Wallet", icon: "okx" as const },
  { name: "WalletConnect", icon: "walletconnect" as const },
] as const;

function WalletLogo({ type }: { type: WalletOption["icon"] }) {
  if (type === "fox") {
    return (
      <span className="grid size-8 place-items-center rounded-full bg-[#26180f]">
        <span className="text-[18px]">🦊</span>
      </span>
    );
  }
  if (type === "coinbase") {
    return (
      <span className="grid size-8 place-items-center rounded-full bg-[#0052FF] text-sm font-semibold text-white">
        C
      </span>
    );
  }
  if (type === "okx") {
    return (
      <span className="grid size-8 place-items-center rounded-md bg-white text-[11px] font-bold text-black">
        OKX
      </span>
    );
  }
  return (
    <span className="grid size-8 place-items-center rounded-full bg-[#1d4ed8] text-[11px] font-semibold text-white">
      WC
    </span>
  );
}

export function ConnectWalletModal({ open, onClose }: ConnectWalletModalProps) {
  const { lang, connectWallet } = useRwaAppState();
  const { showSuccessToast, showWarningToast, blockRegion } = useGlobalFeedback();
  const [connectingWallet, setConnectingWallet] = useState<WalletOption | null>(null);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    setConnectingWallet(null);
    onClose();
  };

  async function handleConnect(option: WalletOption) {
    if (option.name === "Coinbase Wallet") {
      showWarningToast(copyOf(lang, feedbackCopy.auth.signatureRejected));
      return;
    }
    setConnectingWallet(option);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    connectWallet();
    setConnectingWallet(null);
    onClose();
    showSuccessToast(copyOf(lang, feedbackCopy.auth.connected));
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="real-modal-surface w-full max-w-[620px] rounded-[20px] border border-white/10 bg-[#23211d] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        {connectingWallet ? (
          <div className="relative rounded-[18px] bg-[#26231e] px-8 py-12 text-center">
            <button className="absolute right-2 top-2 rounded-md p-2 text-zinc-500" onClick={handleClose} type="button">
              <X className="size-5" />
            </button>
            <div className="mx-auto grid size-[84px] place-items-center rounded-full border border-[#5E4D22] bg-[#2c261d] shadow-[0_0_0_10px_rgba(255,255,255,0.02)]">
              <WalletLogo type={connectingWallet.icon} />
            </div>
            <p className="mt-7 text-[34px] font-semibold text-white">
              {lang === "cn" ? `连接到 ${connectingWallet.name}` : `Connecting ${connectingWallet.name}`}
            </p>
            <p className="mt-3 text-[18px] text-zinc-400">
              {lang === "cn" ? "请在你的钱包中完成链接" : "Please complete the connection in your wallet"}
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#3B3324] bg-black/20 px-4 py-2 text-sm text-zinc-300">
              <Loader2 className="size-4 animate-spin text-[#E4B34C]" />
              {lang === "cn" ? "等待钱包响应" : "Waiting for wallet response"}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div />
              <h2 className="real-modal-title text-center text-[38px] font-semibold text-white">
                Connect
              </h2>
              <button
                className="rounded-md p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                onClick={handleClose}
                type="button"
              >
                <X className="size-6" />
              </button>
            </div>

            <p className="mb-4 text-[16px] text-zinc-400">
              {lang === "cn"
                ? "根据您手中的钱包选择连接 RealFinance："
                : "Choose a wallet below to connect to RealFinance:"}
            </p>

            <div className="space-y-3">
              {walletOptions.slice(0, 3).map((option) => (
                <button
                  key={option.name}
                  className="flex h-[66px] w-full items-center justify-between rounded-[12px] border border-white/8 bg-[#322F2A] px-4 text-left text-[18px] text-zinc-100 transition hover:border-white/12 hover:bg-[#3a3731]"
                  onClick={() => handleConnect(option)}
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    <WalletLogo type={option.icon} />
                    {option.name}
                  </span>
                  {option.badgeCn ? (
                    <span className="rounded-[8px] border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
                      {lang === "cn" ? option.badgeCn : option.badgeEn}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-white/6 pt-6">
              <p className="mb-3 text-[16px] text-zinc-400">
                {lang === "cn" ? "用钱包扫码授权购买：" : "Or authorize with WalletConnect:"}
              </p>
              <button
                className="flex h-[66px] w-full items-center gap-3 rounded-[12px] border border-white/8 bg-[#322F2A] px-4 text-left text-[18px] text-zinc-100 transition hover:border-white/12 hover:bg-[#3a3731]"
                onClick={() => handleConnect(walletOptions[3])}
                type="button"
              >
                <WalletLogo type="walletconnect" />
                WalletConnect
              </button>
            </div>

            <p className="mt-5 text-[13px] leading-6 text-zinc-500">
              {lang === "cn"
                ? "连接钱包即表示您同意我们的《服务条款》和《隐私政策》。"
                : "By connecting a wallet you agree to our Terms of Service and Privacy Policy."}
            </p>

            <button
              className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
              onClick={() => {
                blockRegion(copyOf(lang, feedbackCopy.auth.regionBlocked));
              }}
              type="button"
            >
              <CheckCircle2 className="size-4" />
              {lang === "cn" ? "地区受限" : "Region restricted"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
