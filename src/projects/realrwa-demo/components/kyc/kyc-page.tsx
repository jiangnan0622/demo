"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import { REALRWA_ROUTES } from "@/projects/realrwa-demo/lib/realrwa-routes";

const COUNTRIES = ["China", "United States", "Singapore", "Hong Kong", "Japan", "UAE"];

export function KycPage() {
  const router = useRouter();
  const { lang } = useRwaAppState();
  const { showSuccessToast, showWarningToast } = useGlobalFeedback();

  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [busy, setBusy] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      surname.trim().length > 0 &&
      givenName.trim().length > 0 &&
      email.trim().length > 0 &&
      code.trim().length > 0 &&
      country.trim().length > 0 &&
      agreed
    );
  }, [surname, givenName, email, code, country, agreed]);

  const startCountdown = () => {
    if (!email.trim()) {
      showWarningToast(lang === "cn" ? "请先输入邮箱" : "Please enter email first");
      return;
    }
    if (countdown > 0) return;
    setCountdown(60);
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <main className="kyc-page min-h-screen bg-[#0a0a0a] text-zinc-100">
      <section className="mx-auto grid min-h-screen max-w-[1540px] grid-cols-1 lg:grid-cols-[37%_63%]">
        <div className="relative hidden border-r border-white/10 lg:flex lg:items-center lg:justify-center">
          <div className="relative z-10 flex flex-col items-center gap-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.15)]">
            {/* 上部仪表 / 24小时循环时钟 */}
            <div className="relative">
              <svg viewBox="0 0 210 210" className="h-44 w-44">
                <circle cx="105" cy="105" r="80" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                <circle cx="105" cy="105" r="50" fill="rgba(250,204,21,0.05)" stroke="#FACC15" strokeWidth="10" />
                <path d="M 105 25 A 80 80 0 1 1 25 105" fill="none" stroke="#FACC15" strokeWidth="12" strokeLinecap="round" />
                <path d="M 25 105 L 12 80 M 25 105 L 50 95" fill="none" stroke="#FACC15" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <text x="105" y="125" textAnchor="middle" fontSize="56" fontWeight="700" fill="#FACC15">24</text>
              </svg>
            </div>

            {/* 下部区结构 / 金融出票机（收银机结构复刻） */}
            <div className="relative mt-4">
              <div className="absolute -inset-6 rounded-full bg-[#FACC15]/[0.03] blur-2xl" />
              <svg viewBox="0 0 320 300" className="relative h-[280px] w-[280px] drop-shadow-[0_0_20px_rgba(250,204,21,0.1)]">
                <g strokeWidth="12" strokeLinejoin="round" strokeLinecap="round">
                  {/* 收银机底座 */}
                  <rect x="30" y="220" width="260" height="60" fill="rgba(250,204,21,0.02)" stroke="rgba(255,255,255,0.15)" />
                  <rect x="50" y="235" width="220" height="30" fill="none" stroke="rgba(255,255,255,0.15)" />
                  <rect x="145" y="245" width="30" height="10" fill="rgba(255,255,255,0.15)" stroke="none" />

                  {/* 主要机台 */}
                  <path d="M 40 220 L 70 120 L 250 120 L 280 220 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.15)" />
                  <line x1="40" y1="200" x2="280" y2="200" stroke="rgba(255,255,255,0.15)" />

                  {/* 票据 (高亮金) */}
                  <path d="M 85 120 L 85 30 L 100 45 L 115 30 L 130 45 L 145 30 L 145 120" fill="rgba(250,204,21,0.1)" stroke="#FACC15" />
                  <line x1="70" y1="120" x2="160" y2="120" stroke="#FACC15" />

                  {/* 右上显示屏 (高亮金) */}
                  <line x1="210" y1="120" x2="210" y2="90" stroke="#FACC15" />
                  <rect x="150" y="40" width="120" height="50" fill="rgba(250,204,21,0.05)" stroke="#FACC15" />
                  <rect x="165" y="55" width="90" height="20" fill="rgba(250,204,21,0.2)" stroke="none" />

                  {/* 按钮矩阵 (柔和发光) */}
                  <g fill="rgba(255,255,255,0.2)" stroke="none">
                    <rect x="150" y="140" width="16" height="10" rx="2" />
                    <rect x="175" y="140" width="16" height="10" rx="2" />
                    <rect x="200" y="140" width="16" height="10" rx="2" />
                    <rect x="225" y="140" width="16" height="10" rx="2" />

                    <rect x="150" y="160" width="16" height="10" rx="2" />
                    <rect x="175" y="160" width="16" height="10" rx="2" />
                    <rect x="200" y="160" width="16" height="10" rx="2" />
                    <rect x="225" y="160" width="16" height="10" rx="2" />

                    <rect x="150" y="180" width="16" height="10" rx="2" />
                    <rect x="175" y="180" width="16" height="10" rx="2" />
                    <rect x="200" y="180" width="16" height="10" rx="2" />
                    <rect x="225" y="180" width="16" height="10" rx="2" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center px-6 py-10 lg:px-10">
          <div className="w-full max-w-[900px]">
            <h1 className="mb-7 text-4xl font-semibold tracking-tight text-white/90 drop-shadow-sm">
              {lang === "cn" ? "邮箱验证" : "Mailbox Verification"}
            </h1>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                className="h-14 rounded-lg border border-white/10 bg-white/5 px-4 text-xl text-zinc-100 placeholder:text-zinc-500 hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#FACC15]/50 focus-visible:border-[#FACC15]/50 transition-all"
                placeholder={lang === "cn" ? "姓" : "Surname"}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
              <Input
                className="h-14 rounded-lg border border-white/10 bg-white/5 px-4 text-xl text-zinc-100 placeholder:text-zinc-500 hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#FACC15]/50 focus-visible:border-[#FACC15]/50 transition-all"
                placeholder={lang === "cn" ? "名" : "Name"}
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
              />
            </div>

            <Input
              className="mt-5 h-14 rounded-lg border border-white/10 bg-white/5 px-4 text-xl text-zinc-100 placeholder:text-zinc-500 hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#FACC15]/50 focus-visible:border-[#FACC15]/50 transition-all"
              placeholder={lang === "cn" ? "邮箱" : "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="mt-5 flex h-14 items-center rounded-lg border border-white/10 bg-white/5 px-4 hover:border-white/20 transition-all focus-within:border-[#FACC15]/50 focus-within:ring-1 focus-within:ring-[#FACC15]/50">
              <Input
                className="h-10 border-0 bg-transparent px-0 text-xl text-zinc-100 shadow-none focus-visible:ring-0 placeholder:text-zinc-500"
                placeholder={lang === "cn" ? "输入验证码" : "Verification code"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                type="button"
                className="shrink-0 px-2 text-[17px] font-semibold text-[#FACC15] disabled:text-zinc-500 transition-colors"
                disabled={countdown > 0}
                onClick={startCountdown}
              >
                {countdown > 0 ? `${countdown}s` : "GET CODE"}
              </button>
            </div>

            <div className="mt-5 relative">
              <select
                className="h-14 w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 text-xl text-zinc-100 placeholder:text-zinc-500 hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-[#FACC15]/50 focus-visible:border-[#FACC15]/50 transition-all"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="" disabled>
                  {lang === "cn" ? "国家" : "Country"}
                </option>
                {COUNTRIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-zinc-400">
                ▼
              </span>
            </div>

            <label className="mt-7 flex items-center gap-3 text-lg text-zinc-400 font-medium cursor-pointer">
              <input
                type="checkbox"
                className="size-5 rounded border border-white/20 accent-[#FACC15] bg-black/20"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              {lang === "cn"
                ? "我已阅读 RealFinance 用户协议。"
                : "I have read the RealFinance User Agreement."}
            </label>

            <div className="mt-9 grid grid-cols-[30%_1fr] gap-4">
              <Button
                className="real-outline-btn h-14 text-xl"
                onClick={() => router.back()}
              >
                {lang === "cn" ? "取消" : "Cancel"}
              </Button>
              <Button
                className="real-gold-btn h-14 text-xl disabled:opacity-50"
                disabled={!isFormValid || busy}
                onClick={async () => {
                  setBusy(true);
                  await new Promise((r) => setTimeout(r, 900));
                  setBusy(false);
                  showSuccessToast(lang === "cn" ? "KYC 提交成功" : "KYC submitted");
                  router.push(REALRWA_ROUTES.home);
                }}
              >
                {lang === "cn" ? "确定" : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
