"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";

type IdentityVerificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified?: () => void;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const inputClass =
  "h-12 rounded-[10px] border border-white/10 bg-[#1f1d1a] px-3 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-none focus-visible:border-[#E4B34C]/40 focus-visible:ring-0";

export function IdentityVerificationModal({
  open,
  onOpenChange,
  onVerified,
}: IdentityVerificationModalProps) {
  const { lang, walletAddress, bindIdentity, identityEmail } = useRwaAppState();
  const { showSuccessToast, showWarningToast } = useGlobalFeedback();

  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [email, setEmail] = useState(identityEmail || "");
  const [country, setCountry] = useState("");
  const [code, setCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [signing, setSigning] = useState(false);
  const countdownTimerRef = useRef<number | null>(null);
  const isFormReady =
    surname.trim().length > 0 &&
    givenName.trim().length > 0 &&
    email.trim().length > 0 &&
    country.trim().length > 0 &&
    code.trim().length > 0 &&
    agreed;

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        window.clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  if (!open) return null;

  const onSendCode = () => {
    if (!email.trim()) {
      showWarningToast(lang === "cn" ? "请先输入邮箱" : "Please enter email first");
      return;
    }
    if (countdown > 0) return;
    setCountdown(60);
    showSuccessToast(lang === "cn" ? "验证码已发送，请查收邮箱" : "Verification code sent");
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
    }
    countdownTimerRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) {
            window.clearInterval(countdownTimerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onVerifyAndBind = async () => {
    if (!surname.trim() || !givenName.trim() || !email.trim() || !country.trim() || !code.trim()) {
      showWarningToast(lang === "cn" ? "请完整填写认证信息" : "Please complete all identity fields");
      return;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      showWarningToast(lang === "cn" ? "请输入6位验证码" : "Please enter a valid 6-digit code");
      return;
    }
    if (!agreed) {
      showWarningToast(lang === "cn" ? "请先勾选用户协议" : "Please accept the user agreement");
      return;
    }

    setBusy(true);
    await wait(500);
    setSigning(true);
    await wait(1500);

    bindIdentity({
      email: email.trim(),
      surname: surname.trim(),
      givenName: givenName.trim(),
      country: country.trim(),
      signature: `0x${Math.random().toString(16).slice(2).padEnd(64, "a").slice(0, 64)}`,
    });

    setSigning(false);
    setBusy(false);
    showSuccessToast(lang === "cn" ? "身份绑定成功，已完成认证" : "Identity bound successfully");
    onOpenChange(false);
    onVerified?.();
  };

  return (
    <div className="fixed inset-0 z-[75] grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[20px] border border-white/10 bg-[#26231e] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <button
          type="button"
          aria-label="close"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-md p-1 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
        >
          <X className="size-6" />
        </button>

        <div className="p-6 text-zinc-100 sm:p-8">
          <h3 className="mb-6 text-center text-[32px] font-semibold tracking-tight text-white">
            {lang === "cn" ? "认证" : "Verification"}
          </h3>

          <div className="mb-6 flex items-center gap-2 rounded-[10px] border border-[#56431A] bg-[#4A3917]/70 px-3 py-3 text-sm text-[#D8B164]">
            <AlertCircle className="size-4 shrink-0" />
            <span>
              {lang === "cn"
                ? `当前地址 ${walletAddress} 未认证，请完成身份绑定后继续。`
                : `Address ${walletAddress} is unverified. Please complete identity binding.`}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">{lang === "cn" ? "名" : "First Name"}</label>
                <Input
                  className={inputClass}
                  placeholder={lang === "cn" ? "请输入" : "Enter first name"}
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">{lang === "cn" ? "姓" : "Last Name"}</label>
                <Input
                  className={inputClass}
                  placeholder={lang === "cn" ? "请输入" : "Enter last name"}
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">{lang === "cn" ? "所在地区" : "Region"}</label>
              <div className="relative">
                <select
                  className="h-12 w-full appearance-none rounded-[10px] border border-white/10 bg-[#1f1d1a] px-3 text-sm text-zinc-300 outline-none"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">{lang === "cn" ? "请选择" : "Select"}</option>
                  <option value="China">China</option>
                  <option value="United States">United States</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Hong Kong">Hong Kong</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                  ▼
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">{lang === "cn" ? "邮箱" : "Email"}</label>
              <div className="flex h-12 items-center rounded-[10px] border border-white/10 bg-[#1f1d1a] px-3">
                <Input
                  className="h-9 border-0 bg-transparent px-0 text-sm text-zinc-100 placeholder:text-zinc-500 shadow-none focus-visible:ring-0"
                  placeholder={lang === "cn" ? "请输入邮箱" : "Enter email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="shrink-0 text-sm font-semibold text-zinc-500 disabled:text-zinc-600"
                  disabled={countdown > 0}
                  onClick={onSendCode}
                >
                  {countdown > 0
                    ? `${lang === "cn" ? "重新发送" : "Resend"} (${countdown}s)`
                    : lang === "cn"
                      ? "重新发送"
                      : "Resend"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">{lang === "cn" ? "验证码" : "Code"}</label>
              <Input
                className={inputClass}
                placeholder={lang === "cn" ? "请输入验证码" : "Enter verification code"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className="text-xs text-zinc-600">
                {lang === "cn"
                  ? `验证码已发送至 ${email || "邮箱地址"}`
                  : `Verification code will be sent to ${email || "your email"}`}
              </div>
            </div>

            <label className="flex items-center justify-center gap-2 pt-1 text-sm text-zinc-500">
              <input
                type="checkbox"
                className="size-4 rounded border border-white/15 bg-transparent"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              {lang === "cn"
                ? "我已阅读并同意 RealFinance 用户协议。"
                : "I have read and agree to the RealFinance User Agreement."}
            </label>

            {signing ? (
              <div className="rounded-[10px] border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-2 text-base text-[#7CB1FF]">
                {lang === "cn"
                  ? "正在请求钱包签名（免 Gas）..."
                  : "Requesting wallet signature (gasless)..."}
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button
                className="h-12 rounded-[10px] border border-white/18 bg-transparent text-base text-zinc-200 hover:bg-white/5"
                onClick={() => onOpenChange(false)}
              >
                {lang === "cn" ? "Cancel" : "Cancel"}
              </Button>
              <Button
                className="real-gold-btn h-12 rounded-[10px] text-base text-[#1d1d1d]"
                disabled={busy || !isFormReady}
                onClick={onVerifyAndBind}
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                {lang === "cn" ? "验证并绑定" : "Verify & Bind"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
