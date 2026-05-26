"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowDown, ArrowUpDown, Info, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import { useInsuranceDemo } from "@/projects/realrwa-demo/components/realrwa/insurance-demo-provider";
import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import {
  OPEN_CONNECT_EVENT,
  OPEN_IDENTITY_VERIFICATION_EVENT,
} from "@/projects/realrwa-demo/components/realrwa/shell";
import { copyOf, feedbackCopy } from "@/projects/realrwa-demo/lib/feedback-copy";
import { REALRWA_ROUTES } from "@/projects/realrwa-demo/lib/realrwa-routes";
import {
  calculateCoverageAmountUsd1,
  calculatePremiumAmountUsd1,
  getPremiumRateByCoverage,
} from "@/projects/realrwa-demo/lib/realrwa-insurance-calculations";
import {
  calculateAssetTotalApr,
  calculateMonthlyRewardBreakdown,
} from "@/projects/realrwa-demo/lib/realrwa-staking-yield";
import type { InsuranceCoverageOption } from "@/projects/realrwa-demo/lib/realrwa-insurance-types";
import {
  evaluateRwaTradeTiming,
  getRwaProductTradingConfig,
  type RwaTradeTimingNotice,
} from "@/projects/realrwa-demo/lib/rwa-product-trading";

type BaseProps = {
  open: boolean;
  onClose: () => void;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const PRICE = 1.0008;
const BUY_AVAILABLE_RWA = 12700274.223;
const STAKE_AVAILABLE_RWA = 12700274.223;
const REDEEM_AVAILABLE_RTOKEN = 1000;
const SELL_AVAILABLE_RWA = 666.66;
const MIN_SELL_USD1 = 10;
const STAKE_EST_MONTHLY_REWARD = 0.0345204;
const CLAIM_REMAINING_PREVIEW = 274.223;
const WITHDRAW_REMAINING_SUPPLY_PREVIEW = 74.223;
const TRADE_FEE_RATE = "1.00%";
const BUY_TRADE_FEE_AMOUNT = "10.00USDC≈$10";
const SELL_TRADE_FEE_AMOUNT = "10.00rUSD≈$10";
const BUY_SUCCESS_TRADE_FEE = "0.1%≈$0.1";
const BUY_SUCCESS_TOKEN_ADDRESS = "0x48bfd064...2d9fe39feb6f";
const BUY_SUCCESS_TX_HASH = "0xe512c4ce...845a2380de1c";

function formatModalTimestamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function clampNumber(value: number, max: number) {
  if (Number.isNaN(value) || value < 0) return 0;
  return Math.min(value, max);
}

function sanitizeNumericInput(next: string, maxDecimals = 6) {
  if (next === "") return "";
  if (!/^\d*\.?\d*$/.test(next)) return null;
  if (!next.includes(".")) return next;
  const [intPart, decPart = ""] = next.split(".");
  return `${intPart}.${decPart.slice(0, maxDecimals)}`;
}

function formatNumberForInput(value: number, maxDecimals = 6) {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(maxDecimals).replace(/\.?0+$/, "");
}

function TradeFeeLine({
  lang,
  amount,
  className = "",
}: {
  lang: string;
  amount: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-end gap-1.5 text-[13px] leading-5 text-zinc-200 ${className}`}>
      <span className="font-semibold text-white">{lang === "cn" ? "交易手续费" : "Trading Fee"}</span>
      <span className="font-semibold text-white">{TRADE_FEE_RATE}</span>
      <span>{amount}</span>
      <span className="ml-0.5 grid size-4 place-items-center rounded-full bg-[#E8C77D] text-[10px] font-bold leading-none text-white">
        !
      </span>
    </div>
  );
}

function TokenBadge({
  label,
  tone = "gold",
}: {
  label: string;
  tone?: "gold" | "blue" | "red" | "purple";
}) {
  const toneClass =
    tone === "blue"
      ? "bg-[#2F6DB4]"
      : tone === "red"
        ? "bg-[#FF4D0A]"
        : tone === "purple"
          ? "bg-gradient-to-br from-[#F2D76B] via-[#A35FD1] to-[#4744D6]"
          : "bg-[#F2C94C]";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-flex size-10 items-center justify-center rounded-full ${toneClass} text-base font-bold text-black`}
      >
        {label.slice(0, 1)}
      </span>
      <span>{label}</span>
    </span>
  );
}

function TokenIconPill({
  src,
  alt,
  label,
  secondary,
  circleClassName = "border border-white/80 bg-white shadow-[0_12px_26px_rgba(0,0,0,0.24)]",
}: {
  src: string;
  alt: string;
  label: string;
  secondary?: ReactNode;
  circleClassName?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`grid size-9 place-items-center overflow-hidden rounded-full ${circleClassName}`}>
        <Image src={src} alt={alt} width={22} height={22} className="size-[22px] object-contain" />
      </span>
      <span className="inline-flex items-baseline gap-1.5 text-[15px] text-white">
        <span className="font-medium">{label}</span>
        {secondary}
      </span>
    </span>
  );
}

function ModalShell({
  title,
  onClose,
  children,
  widthClass = "max-w-[420px]",
  zClass = "z-[60]",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
  zClass?: string;
}) {
  return (
    <div className={`fixed inset-0 ${zClass} grid place-items-center bg-black/85 p-4`}>
      <div
        className={`real-modal-surface mac-modal-panel mac-modal-panel-lg w-full ${widthClass} max-h-[94vh] overflow-y-auto p-6`}
      >
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="real-modal-title mac-modal-title w-full text-center text-2xl">{title}</h3>
          <button onClick={onClose} type="button" aria-label="close">
            <X className="size-8 text-zinc-400 transition hover:text-zinc-200" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function BuyModal({
  open,
  onClose,
  platformBalance = 10.0001,
  onStakeNow,
  assetSymbol = "rSDCT",
  assetIssuer,
  assetIcon,
  quoteSymbol = "USDC",
}: BaseProps & {
  platformBalance?: number;
  onStakeNow?: () => void;
  assetSymbol?: string;
  assetIssuer?: string;
  assetIcon?: string;
  quoteSymbol?: string;
}) {
  const { lang, text, walletConnected, identityBound } = useRwaAppState();
  const buyPrice = 1;
  const buySansStyle: CSSProperties = {
    fontFamily:
      '"SF Pro Text", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif',
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
  };
  const buyDisplayStyle: CSSProperties = {
    fontFamily:
      '"SF Pro Display", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif',
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
  };
  const buyNumericStyle: CSSProperties = {
    ...buyDisplayStyle,
    fontVariantNumeric: "tabular-nums lining-nums",
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
  };
  const [amount, setAmount] = useState("");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [blockedInvalid, setBlockedInvalid] = useState(false);
  const [maxDecimalsExceeded, setMaxDecimalsExceeded] = useState(false);
  const [cutoffOpen, setCutoffOpen] = useState(false);
  const [timingNotice, setTimingNotice] = useState<RwaTradeTimingNotice | null>(null);
  const [submittedAt, setSubmittedAt] = useState("");
  const maxAmount = Math.min(BUY_AVAILABLE_RWA, platformBalance / buyPrice);
  const maxValue = maxAmount * buyPrice;
  const formatBalance = (input: number) =>
    input.toLocaleString(undefined, {
      minimumFractionDigits: input < 100 ? 4 : 2,
      maximumFractionDigits: 4,
    });
  const formattedAvailableAmount = formatBalance(maxAmount);
  const formattedAvailableValue = formatBalance(platformBalance);

  const amountNum = Number(amount);
  const valueNum = Number(value);
  const hasAmountInput = amount.trim() !== "";
  const hasValueInput = value.trim() !== "";
  const hasInput = hasAmountInput || hasValueInput;
  const effectiveValue = hasValueInput
    ? valueNum
    : hasAmountInput
      ? amountNum * buyPrice
      : 0;
  const invalidNumeric = hasInput && !Number.isFinite(effectiveValue);
  const emptyOrZero = !hasInput || effectiveValue <= 0;
  const belowMin = Number.isFinite(effectiveValue) && effectiveValue > 0 && effectiveValue < 10;
  const insufficient = Number.isFinite(effectiveValue) && effectiveValue > platformBalance;
  let validationMessage = "";
  if (maxDecimalsExceeded) {
    validationMessage = copyOf(lang, feedbackCopy.buy.maxDecimals);
  } else if (blockedInvalid || invalidNumeric) {
    validationMessage = copyOf(lang, feedbackCopy.buy.invalidNumber);
  } else if (emptyOrZero) {
    validationMessage = copyOf(lang, feedbackCopy.buy.enterAmount);
  } else if (belowMin) {
    validationMessage = copyOf(lang, feedbackCopy.buy.minAmount);
  } else if (insufficient) {
    validationMessage = copyOf(lang, feedbackCopy.buy.insufficientBalance);
  }

  const isValidToBuy =
    !maxDecimalsExceeded &&
    !blockedInvalid &&
    !invalidNumeric &&
    !emptyOrZero &&
    !belowMin &&
    !insufficient;
  const disabledPrimary = busy || !isValidToBuy;
  const amountDisplay = (Number(amount) || 0).toLocaleString(undefined, {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  });
  const valueDisplay = (Number(value) || 0).toLocaleString(undefined, {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  });
  const closeBuyModal = () => {
    setBusy(false);
    setSuccess(false);
    setAmount("");
    setValue("");
    setBlockedInvalid(false);
    setMaxDecimalsExceeded(false);
    setSubmittedAt("");
    onClose();
  };

  if (!open) return null;

  const needsKycGate = walletConnected && !identityBound && !success;
  const needsConnectGate = !walletConnected && !success;

  const onAmountChange = (next: string) => {
    if (!/^\d*\.?\d*$/.test(next)) {
      setBlockedInvalid(true);
      return;
    }
    setBlockedInvalid(false);
    const decimalPart = next.split(".")[1] ?? "";
    const exceeded = decimalPart.length > 6;
    setMaxDecimalsExceeded(exceeded);
    const sanitized = sanitizeNumericInput(next, 6);
    if (sanitized === null) return;
    if (sanitized.trim() === "") {
      setAmount("");
      setValue("");
      return;
    }
    setAmount(sanitized);
    const n = Number(sanitized);
    if (!Number.isFinite(n)) {
      setBlockedInvalid(true);
      return;
    }
    setValue(formatNumberForInput(n * buyPrice, 6));
  };

  const onValueChange = (next: string) => {
    if (!/^\d*\.?\d*$/.test(next)) {
      setBlockedInvalid(true);
      return;
    }
    setBlockedInvalid(false);
    const decimalPart = next.split(".")[1] ?? "";
    const exceeded = decimalPart.length > 6;
    setMaxDecimalsExceeded(exceeded);
    const sanitized = sanitizeNumericInput(next, 6);
    if (sanitized === null) return;
    if (sanitized.trim() === "") {
      setAmount("");
      setValue("");
      return;
    }
    setValue(sanitized);
    const n = Number(sanitized);
    if (!Number.isFinite(n)) {
      setBlockedInvalid(true);
      return;
    }
    setAmount(formatNumberForInput(n / buyPrice, 6));
  };

  const renderAssetAvatar = ({
    src,
    label,
    type = "asset",
    sizeClass = "size-7",
  }: {
    src?: string;
    label: string;
    type?: "asset" | "quote";
    sizeClass?: string;
  }) => {
    if (type === "quote") {
      return (
        <span
          className={`grid ${sizeClass} place-items-center rounded-full bg-[#2f6fd4]`}
        >
          <span className="grid size-[72%] place-items-center rounded-full border border-white/30 text-[11px] font-semibold text-white">
            $
          </span>
        </span>
      );
    }

    if (src) {
      return (
        <span className={`grid ${sizeClass} place-items-center overflow-hidden rounded-full bg-[#161616] ring-1 ring-[#3b3832]`}>
          {/* Remote token assets are served from jsDelivr and don't need Next image optimization here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} className="h-[78%] w-[78%] object-contain" loading="lazy" />
        </span>
      );
    }

    return (
      <span className={`grid ${sizeClass} place-items-center rounded-full bg-[#4f4533] text-[12px] font-semibold text-[#f0c456]`}>
        {label.slice(0, 1)}
      </span>
    );
  };

  const renderInputField = ({
    label,
    value: fieldValue,
    onChange,
    suffixType,
    available,
    onMax,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    suffixType: "asset" | "quote";
    available: string;
    onMax: () => void;
  }) => (
    <div>
      <div className="mb-3 flex items-center gap-1.5 text-[14px] text-zinc-300">
        <span className="text-[#c95e54]">*</span>
        <span>{label}</span>
      </div>
      <div
        className={`flex h-[52px] items-center justify-between rounded-[10px] border bg-[#2e2a25] pl-4 pr-3 ${validationMessage ? "border-[#9f4c44]" : "border-[#45403a]"}`}
      >
        <Input
          value={fieldValue}
          placeholder="0.00"
          onChange={(event) => onChange(event.target.value)}
          className="h-full border-0 bg-transparent px-0 text-[16px] font-medium text-white shadow-none placeholder:text-[#66615a] focus-visible:ring-0"
          style={buyNumericStyle}
        />
        <div className="ml-3 flex shrink-0 items-center gap-2 text-[14px] text-zinc-100">
          {renderAssetAvatar({
            src: suffixType === "asset" ? assetIcon : undefined,
            label: suffixType === "asset" ? assetSymbol : quoteSymbol,
            type: suffixType,
            sizeClass: "size-6",
          })}
          <span>{suffixType === "asset" ? assetSymbol : quoteSymbol}</span>
          <button type="button" className="font-semibold text-[#e0b84e]" onClick={onMax}>
            {copyOf(lang, feedbackCopy.buy.max)}
          </button>
        </div>
      </div>
      <p className="mt-2 text-[13px] text-zinc-500">
        {copyOf(lang, feedbackCopy.buy.available)} {available}
      </p>
    </div>
  );

  return (
    <>
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[rgba(0,0,0,0.72)] p-4">
      <div
        className={`relative max-h-[calc(100vh-32px)] w-full overflow-y-auto rounded-[8px] border border-[#3a352f] bg-[#26231f] text-zinc-100 shadow-[0_20px_56px_rgba(0,0,0,0.45)] ${
          success ? "max-w-[960px] px-4 py-4 sm:px-16 sm:pb-10 sm:pt-12" : "max-w-[470px] px-8 pb-5 pt-7"
        }`}
        style={buySansStyle}
      >
        <button
          type="button"
          onClick={closeBuyModal}
          className="absolute right-6 top-5 flex size-9 items-center justify-center rounded-md text-zinc-500 transition hover:bg-[#312d29] hover:text-zinc-300"
          aria-label="close"
        >
          <X className="size-6" />
        </button>

        <h3 className={`${success ? "text-[22px] font-semibold sm:text-[34px]" : "text-[18px] font-medium"} text-center tracking-[0.01em] text-white`} style={buyDisplayStyle}>
          {copyOf(lang, feedbackCopy.buy.title)}
        </h3>

        {needsConnectGate ? (
          <div className="space-y-5 pt-8">
            <p className="text-center text-[15px] text-zinc-400">
              {lang === "cn" ? "请先连接钱包，再继续购买。" : "Please connect your wallet before buying."}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-[48px] rounded-[10px] border border-[#8a6a23] bg-transparent text-[16px] font-semibold text-[#dfb64d] hover:bg-[#2b2722]" onClick={closeBuyModal}>
                {text.cancel}
              </Button>
              <Button
                className="h-[48px] rounded-[10px] bg-[#ebc85f] text-[16px] font-semibold text-[#1e1b16] hover:bg-[#ddb955]"
                onClick={() => {
                  closeBuyModal();
                  window.dispatchEvent(new Event(OPEN_CONNECT_EVENT));
                }}
              >
                {lang === "cn" ? "连接钱包" : "Connect Wallet"}
              </Button>
            </div>
          </div>
        ) : needsKycGate ? (
          <div className="space-y-5 pt-8">
            <p className="text-center text-[15px] text-zinc-400">
              {lang === "cn" ? "请先完成身份验证后再继续购买。" : "Please complete identity verification first."}
            </p>
            <Button
              className="h-[48px] w-full rounded-[10px] bg-[#ebc85f] text-[16px] font-semibold text-[#1e1b16] hover:bg-[#ddb955]"
              onClick={() => {
                closeBuyModal();
                window.dispatchEvent(new Event(OPEN_IDENTITY_VERIFICATION_EVENT));
              }}
            >
              {lang === "cn" ? "去验证" : "Verify Now"}
            </Button>
          </div>
        ) : success ? (
          <div className="space-y-4 pt-4 sm:space-y-8 sm:pt-7">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-3 grid size-[58px] place-items-center rounded-full bg-[#27C994] shadow-[0_14px_34px_rgba(39,201,148,0.22)] sm:mb-8 sm:size-[92px]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-[38px] text-[#171512] sm:size-[58px]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4 className="text-center text-[24px] font-semibold leading-tight text-white sm:text-[34px]" style={buyDisplayStyle}>
                {lang === "cn" ? "购买提交成功" : "Purchase Submitted"}
              </h4>
            </div>

            <div className="rounded-[18px] bg-[#2c2a26] px-4 py-3 text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] sm:px-7 sm:py-5 sm:text-[28px]">
              <div className="flex items-center justify-between gap-6 py-2 first:pt-0 sm:py-3">
                <span className="shrink-0 font-semibold text-[#8f8f8f]">{lang === "cn" ? "支付总额" : "Total Paid"}</span>
                <span className="font-medium text-[#b8b8b8]" style={buyNumericStyle}>{valueDisplay} {quoteSymbol}</span>
              </div>
              <div className="flex items-center justify-between gap-6 py-2 sm:py-3">
                <span className="shrink-0 font-semibold text-[#8f8f8f]">{lang === "cn" ? "预计获得资产" : "Expected Asset"}</span>
                <span className="font-medium text-[#b8b8b8]" style={buyNumericStyle}>{amountDisplay} {assetSymbol}</span>
              </div>
              <div className="flex items-center justify-between gap-6 py-2 sm:py-3">
                <span className="shrink-0 font-semibold text-[#8f8f8f]">{lang === "cn" ? "提交时间" : "Submitted At"}</span>
                <span className="font-medium text-[#b8b8b8]" style={buyNumericStyle}>{submittedAt || formatModalTimestamp()}</span>
              </div>
              <div className="flex items-center justify-between gap-6 py-2 sm:py-3">
                <span className="shrink-0 font-semibold text-[#8f8f8f]">{lang === "cn" ? "添加代币" : "Add Token"}</span>
                <span className="flex min-w-0 items-center gap-3 font-medium text-[#b8b8b8]" style={buyNumericStyle}>
                  <span className="truncate">{BUY_SUCCESS_TOKEN_ADDRESS}</span>
                  <span className="size-7 shrink-0 rounded-[3px] border-2 border-[#8d8d8d]" />
                  <button type="button" className="shrink-0 font-semibold text-[#f0c85b] underline-offset-4 hover:underline">
                    {lang === "cn" ? "去添加" : "Add"}
                  </button>
                </span>
              </div>
              <div className="flex items-center justify-between gap-6 py-2 sm:py-3">
                <span className="shrink-0 font-semibold text-[#8f8f8f]">{lang === "cn" ? "交易手续费" : "Trading Fee"}</span>
                <span className="font-medium text-[#b8b8b8]" style={buyNumericStyle}>{BUY_SUCCESS_TRADE_FEE}</span>
              </div>
              <div className="flex items-center justify-between gap-6 pb-0 pt-2 sm:pt-3">
                <span className="shrink-0 font-semibold text-[#8f8f8f]">{lang === "cn" ? "交易哈希" : "Tx Hash"}</span>
                <span className="flex min-w-0 items-center gap-3 font-medium text-[#b8b8b8]" style={buyNumericStyle}>
                  <span className="truncate">{BUY_SUCCESS_TX_HASH}</span>
                  <span className="size-7 shrink-0 rounded-[3px] border-2 border-[#8d8d8d]" />
                  <button type="button" className="shrink-0 font-semibold text-[#f0c85b] underline-offset-4 hover:underline">
                    {lang === "cn" ? "去查看" : "View"}
                  </button>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 sm:pt-8">
              <Button
                className="h-[58px] rounded-[18px] border border-[#8c8c87] bg-transparent text-[18px] font-semibold text-white hover:bg-[#2b2722] sm:h-[96px] sm:text-[32px]"
                onClick={() => {
                  closeBuyModal();
                }}
              >
                {lang === "cn" ? "查看详情" : "View Details"}
              </Button>
              <Button
                className="h-[58px] rounded-[18px] bg-[#f0c85b] text-[18px] font-semibold text-[#1e1b16] hover:bg-[#ddb955] sm:h-[96px] sm:text-[32px]"
                onClick={() => {
                  if (onStakeNow) {
                    closeBuyModal();
                    onStakeNow();
                    return;
                  }
                  closeBuyModal();
                }}
              >
                {lang === "cn" ? "立即质押" : "Stake Now"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-6">
            <div>
              <p className="mb-3 text-[14px] text-zinc-300">{copyOf(lang, feedbackCopy.buy.price)}</p>
              <div className="grid grid-cols-[1fr_44px_1fr] items-center gap-3">
                <div className="flex h-[54px] items-center justify-between rounded-[8px] border border-[#45403a] bg-[#2f2b26] px-3">
                  <div className="flex items-center gap-2.5 text-[15px] text-white">
                    {renderAssetAvatar({ label: quoteSymbol, type: "quote", sizeClass: "size-7" })}
                    <span>{quoteSymbol}</span>
                    <span className="text-[12px] text-zinc-500">⌄</span>
                  </div>
                  <span className="text-[18px] font-semibold text-white" style={buyNumericStyle}>{buyPrice.toFixed(2)}</span>
                </div>

                <button
                  type="button"
                  className="grid size-11 place-items-center rounded-[8px] border border-[#45403a] bg-[#2a2722] text-zinc-400"
                >
                  <ArrowUpDown className="size-5 rotate-90" />
                </button>

                <div className="flex h-[54px] items-center justify-between rounded-[8px] border border-[#45403a] bg-[#2f2b26] px-3">
                  <div className="flex items-center gap-2.5 text-[15px] text-white">
                    {renderAssetAvatar({ src: assetIcon, label: assetSymbol, sizeClass: "size-7" })}
                    <span>{assetSymbol}</span>
                  </div>
                  <span className="text-[18px] font-semibold text-white" style={buyNumericStyle}>
                    {buyPrice.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {renderInputField({
              label: copyOf(lang, feedbackCopy.buy.amount),
              value: amount,
              onChange: onAmountChange,
              suffixType: "asset",
              available: `${formattedAvailableAmount} ${assetSymbol}`,
              onMax: () => {
                setMaxDecimalsExceeded(false);
                setAmount(formatNumberForInput(maxAmount, 6));
                setValue(formatNumberForInput(maxValue, 6));
              },
            })}

            <div className="grid place-items-center">
              <span className="grid size-10 place-items-center rounded-[8px] border border-[#45403a] bg-[#34302b] text-zinc-400">
                <ArrowDown className="size-5" />
              </span>
            </div>

            {renderInputField({
              label: copyOf(lang, feedbackCopy.buy.value),
              value,
              onChange: onValueChange,
              suffixType: "quote",
              available: `${formattedAvailableValue} ${quoteSymbol}`,
              onMax: () => {
                setMaxDecimalsExceeded(false);
                setValue(formatNumberForInput(maxValue, 6));
                setAmount(formatNumberForInput(maxAmount, 6));
              },
            })}

            {validationMessage ? <p className="-mt-2 text-[12px] text-[#d36a62]">{validationMessage}</p> : null}

            <TradeFeeLine lang={lang} amount={BUY_TRADE_FEE_AMOUNT} />

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                className="h-[48px] rounded-[10px] border border-[#8a6a23] bg-transparent text-[18px] font-semibold text-[#dfb64d] hover:bg-[#2b2722]"
                onClick={closeBuyModal}
              >
                {text.cancel}
              </Button>
              <Button
                className="h-[48px] rounded-[10px] bg-[#ebc85f] text-[18px] font-semibold text-[#1e1b16] disabled:opacity-50 hover:bg-[#ddb955]"
                disabled={disabledPrimary}
                onClick={async () => {
                  const notice =
                    assetSymbol === "rFUIDL"
                      ? evaluateRwaTradeTiming(getRwaProductTradingConfig(), "BUY")
                      : null;
                  if (notice) {
                    setTimingNotice(notice);
                    setCutoffOpen(true);
                    return;
                  }
                  setBusy(true);
                  await wait(800);
                  setSubmittedAt(formatModalTimestamp());
                  setBusy(false);
                  setSuccess(true);
                }}
              >
                {busy ? <Loader2 className="mr-2 size-5 animate-spin" /> : null}
                {text.buy}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>

    <MellonBuyCutoffConfirmModal
      open={cutoffOpen}
      onClose={() => setCutoffOpen(false)}
      onConfirm={async () => {
        setCutoffOpen(false);
        setBusy(true);
        await wait(800);
        setSubmittedAt(formatModalTimestamp());
        setBusy(false);
        setSuccess(true);
      }}
      summary={{
        tokenSymbol: assetSymbol,
        tokenIssuer: assetIssuer,
        price: `1 ${quoteSymbol} ≈ ${buyPrice.toFixed(4)} ${assetSymbol}`,
        amount: `${amountDisplay} ${assetSymbol}`,
        value: `${valueDisplay} ${quoteSymbol}`,
      }}
      noticeMessage={timingNotice?.message}
      canContinue={timingNotice?.canContinue ?? true}
    />
    </>
  );
}
export function StakeModal({
  open,
  onClose,
  onViewDashboard,
  onBuyRequest,
  assetSymbol = "rXWCT",
  assetIcon = "/tokens/uni.svg",
  availableAmount = STAKE_AVAILABLE_RWA,
  aprValue = "10.02",
  scheduleDate = "2026-03-25 16:00:12",
}: BaseProps & {
  onViewDashboard?: () => void;
  onBuyRequest?: () => void;
  assetSymbol?: string;
  assetIcon?: string;
  availableAmount?: number;
  aprValue?: string;
  scheduleDate?: string;
}) {
  const { lang, walletConnected, identityBound } = useRwaAppState();
  const { showErrorToast, showWarningToast } = useGlobalFeedback();
  const {
    availableUsd1Balance,
    getAssetProject,
    getAvailableStakeUnits,
    getInsuranceConfig,
    getInsuranceProject,
    submitStakeDemo,
  } = useInsuranceDemo();
  const [step, setStep] = useState<"form" | "submitting" | "success" | "failed">("form");
  const [amount, setAmount] = useState("");
  const [insureEnabled, setInsureEnabled] = useState(false);
  const [insuranceRatio, setInsuranceRatio] = useState<InsuranceCoverageOption>(40);
  const [failureReason, setFailureReason] = useState("");
  const [submittedResult, setSubmittedResult] = useState<{
    positionId: string;
    positionCreatedAt: string;
    stakedUnits: number;
    stakedValue: number;
    policyId?: string;
    policyEffectiveAt?: string;
    policyExpireAt?: string;
    coverageAmount?: number;
    premiumPaid?: number;
    coverageRatio?: InsuranceCoverageOption;
  } | null>(null);

  const assetProject = getAssetProject(assetSymbol);
  const insuranceProject = getInsuranceProject(assetSymbol);
  const insuranceConfig = insuranceProject ?? getInsuranceConfig(assetSymbol);
  const insuranceUnavailable = !insuranceConfig || !insuranceConfig.insurable;
  const demoStakeAvailable = assetProject ? getAvailableStakeUnits(assetSymbol) : undefined;
  const stakeAvailable =
    typeof demoStakeAvailable === "number" && demoStakeAvailable > 0 ? demoStakeAvailable : availableAmount;
  const unitPriceUsd1 = assetProject?.unitPriceUsd1 ?? 1;
  const calculatedTotalApr = assetProject ? calculateAssetTotalApr(assetProject.assetSymbol) : Number(aprValue);
  const displayAprValue = Number.isFinite(calculatedTotalApr) && calculatedTotalApr > 0
    ? calculatedTotalApr.toFixed(2)
    : aprValue;

  const closeWithReset = () => {
    setStep("form");
    setAmount("");
    setInsureEnabled(false);
    setInsuranceRatio(insuranceConfig?.defaultCoverageRatio ?? 40);
    setFailureReason("");
    setSubmittedResult(null);
    onClose();
  };

  if (!open) return null;

  const amountNum = Number(amount);
  const stakeUnits = Number.isFinite(amountNum) ? amountNum : 0;
  const stakedValue = Number((stakeUnits * unitPriceUsd1).toFixed(2));
  const aprNumber = Number(displayAprValue);
  const rewardBreakdown = calculateMonthlyRewardBreakdown(stakeUnits, unitPriceUsd1, assetSymbol);
  const monthlyRewardDisplay =
    amount.trim() === ""
      ? (Number.isFinite(aprNumber) ? aprNumber / 100 / 12 : STAKE_EST_MONTHLY_REWARD).toFixed(6)
      : rewardBreakdown.totalMonthlyReward.toFixed(6);

  const stakeEmptyOrZero = amount.trim() === "" || !Number.isFinite(amountNum) || amountNum <= 0;
  const stakeOverAvailable = Number.isFinite(amountNum) && amountNum > stakeAvailable;
  const stakeValidationMessage = stakeEmptyOrZero
    ? copyOf(lang, feedbackCopy.stake.enterAmount)
    : stakeOverAvailable
      ? lang === "cn"
        ? "质押数量超过可质押余额"
        : "Stake amount exceeds available balance."
      : "";

  const coverageAmountUsd1 =
    insureEnabled && insuranceConfig
      ? calculateCoverageAmountUsd1(stakeUnits, unitPriceUsd1, insuranceRatio)
      : 0;
  const premiumRate =
    insureEnabled && insuranceConfig
      ? getPremiumRateByCoverage(insuranceConfig.premiumRateMap, insuranceRatio)
      : 0;
  const estimatedPremiumUsd1 =
    insureEnabled && insuranceConfig ? calculatePremiumAmountUsd1(coverageAmountUsd1, premiumRate) : 0;
  const insuranceOverQuota =
    insureEnabled && insuranceConfig ? coverageAmountUsd1 > insuranceConfig.remainingCoverageAmount : false;
  const insurancePremiumInsufficient = insureEnabled && estimatedPremiumUsd1 > availableUsd1Balance;
  const insuranceValidationMessage = !insureEnabled
    ? ""
    : insuranceUnavailable
      ? lang === "cn"
        ? "当前项目暂不可投保"
        : "Insurance is unavailable for this asset."
      : insuranceOverQuota
        ? lang === "cn"
          ? "保障额度超过当前项目剩余承保额度"
          : "Coverage exceeds the remaining insurable quota."
        : insurancePremiumInsufficient
          ? lang === "cn"
            ? "保费超过 USD1 可用余额"
            : "Premium exceeds available USD1 balance."
          : "";
  const validationMessage = stakeValidationMessage || insuranceValidationMessage;
  const formattedStakeAvailable = stakeAvailable.toLocaleString(undefined, {
    minimumFractionDigits: stakeAvailable >= 1000 ? 3 : 0,
    maximumFractionDigits: 4,
  });
  const scheduleRows = [
    {
      label: lang === "cn" ? "提交时间" : "Submitted At",
      value: scheduleDate,
    },
    {
      label: lang === "cn" ? "预计生效" : "Estimated Effective",
      value: scheduleDate,
    },
    {
      label: lang === "cn" ? "奖励统计周期" : "Reward Cycle",
      value: lang === "cn" ? "按日结算 / 以最终确认为准" : "Daily settlement / subject to final confirmation",
    },
  ];

  const onStakeAmountChange = (next: string) => {
    const sanitized = sanitizeNumericInput(next, 6);
    if (sanitized === null) return;
    if (sanitized.trim() === "") {
      setAmount("");
      return;
    }
    const n = Number(sanitized);
    if (!Number.isFinite(n)) return;
    setAmount(formatNumberForInput(clampNumber(n, stakeAvailable), 6));
  };

  const beginStakeFlow = async () => {
    if (!walletConnected) {
      closeWithReset();
      window.dispatchEvent(new Event(OPEN_CONNECT_EVENT));
      return;
    }
    if (!identityBound) {
      closeWithReset();
      window.dispatchEvent(new Event(OPEN_IDENTITY_VERIFICATION_EVENT));
      return;
    }
    if (validationMessage) {
      showWarningToast(validationMessage);
      return;
    }

    setFailureReason("");
    setStep("submitting");
    try {
      const result = await submitStakeDemo({
        assetSymbol,
        stakedUnits: stakeUnits,
        insureEnabled: insureEnabled && !insuranceUnavailable,
        coverageRatio: insureEnabled && !insuranceUnavailable ? insuranceRatio : undefined,
      });
      setSubmittedResult({
        positionId: result.position.positionId,
        positionCreatedAt: result.position.createdAt,
        stakedUnits: result.position.stakedUnits,
        stakedValue: result.position.stakedValue,
        policyId: result.policy?.policyId,
        policyEffectiveAt: result.policy?.effectiveAt,
        policyExpireAt: result.policy?.expireAt,
        coverageAmount: result.policy?.coverageAmount,
        premiumPaid: result.policy?.premiumPaid,
        coverageRatio: result.policy?.coverageRatio,
      });
      setStep("success");
    } catch (error) {
      const message =
        error instanceof Error && error.message === "ASSET_NOT_FOUND"
          ? lang === "cn"
            ? "未找到当前资产配置"
            : "Unable to find a config for this asset."
          : error instanceof Error && error.message === "STAKE_EXCEEDS_AVAILABLE"
            ? lang === "cn"
              ? "质押数量超过可质押余额"
              : "Stake amount exceeds available balance."
            : error instanceof Error && error.message === "COVERAGE_QUOTA_EXCEEDED"
              ? lang === "cn"
                ? "保障额度超过当前项目剩余承保额度"
                : "Coverage exceeds the remaining insurable quota."
              : error instanceof Error && error.message === "PREMIUM_BALANCE_INSUFFICIENT"
                ? lang === "cn"
                  ? "保费超过 USD1 可用余额"
                  : "Premium exceeds available USD1 balance."
                : error instanceof Error && error.message === "INSURANCE_UNAVAILABLE"
                  ? lang === "cn"
                    ? "当前项目暂不可投保"
                    : "Insurance is unavailable for this asset."
          : lang === "cn"
            ? "提交失败，请稍后重试"
            : "Submission failed. Please retry later.";
      setFailureReason(message);
      setStep("failed");
      showErrorToast(message);
    }
  };

  if (step === "success" && submittedResult) {
    return (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-black/86 p-4">
        <div className="relative w-full max-w-[448px] rounded-[22px] border border-white/10 bg-[#1f1c18] px-6 pb-6 pt-5 text-zinc-100 shadow-[0_30px_90px_rgba(0,0,0,0.72)]">
          <button
            onClick={closeWithReset}
            className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
          >
            <X className="size-[18px]" />
          </button>
          <h3 className="mb-6 text-center text-[15px] font-medium tracking-wide text-[#d9b45a]">
            {insureEnabled && !insuranceUnavailable
              ? lang === "cn"
                ? "质押并投保成功"
                : "Stake + Insure Success"
              : lang === "cn"
                ? "质押成功"
                : "Stake Success"}
          </h3>

          <div className="mb-5 flex justify-center">
            <div className="grid size-14 place-items-center rounded-full bg-[#2BC28E] text-[#161616]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-11"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <div className="rounded-[18px] border border-white/8 bg-[#2a2621] px-5 py-4 text-[14px]">
            <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3">
              <span className="text-zinc-500">{lang === "cn" ? "资产" : "Asset"}</span>
              <span className="font-medium text-white">{assetSymbol}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "质押数量" : "Staked Units"}</span>
              <span className="text-white">{submittedResult.stakedUnits.toFixed(4)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "质押价值" : "Staked Value"}</span>
              <span className="text-white">$ {submittedResult.stakedValue.toFixed(2)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "仓位编号" : "Position ID"}</span>
              <span className="font-mono text-[12px] text-zinc-300">{submittedResult.positionId}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "创建时间" : "Created At"}</span>
              <span className="text-zinc-300">{submittedResult.positionCreatedAt}</span>
            </div>
            {submittedResult.policyId ? (
              <>
                <div className="mt-4 border-t border-white/8 pt-4" />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-500">{lang === "cn" ? "保单编号" : "Policy ID"}</span>
                  <span className="font-mono text-[12px] text-zinc-300">{submittedResult.policyId}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-zinc-500">{lang === "cn" ? "保险档位" : "Coverage Ratio"}</span>
                  <span className="text-zinc-300">{submittedResult.coverageRatio}%</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-zinc-500">{lang === "cn" ? "保障额度" : "Coverage Amount"}</span>
                  <span className="text-zinc-300">$ {submittedResult.coverageAmount?.toFixed(2)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-zinc-500">{lang === "cn" ? "保费" : "Premium"}</span>
                  <span className="text-zinc-300">$ {submittedResult.premiumPaid?.toFixed(2)} USD1</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-zinc-500">{lang === "cn" ? "保单生效时间" : "Policy Effective"}</span>
                  <span className="text-zinc-300">{submittedResult.policyEffectiveAt}</span>
                </div>
              </>
            ) : null}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button
              className="h-[50px] rounded-[12px] border border-white/20 bg-transparent text-[15px] text-white hover:bg-white/5"
              onClick={() => {
                closeWithReset();
                onViewDashboard?.();
              }}
            >
              {lang === "cn" ? "查看记录" : "View Records"}
            </Button>
            <Button
              className="h-[50px] rounded-[12px] bg-[#e5bc54] text-[15px] font-semibold text-[#1c1c1c] hover:bg-[#d4ad49]"
              onClick={() => {
                setStep("form");
                setAmount("");
                setInsureEnabled(false);
                setInsuranceRatio(insuranceConfig?.defaultCoverageRatio ?? 40);
                setFailureReason("");
                setSubmittedResult(null);
              }}
            >
              {lang === "cn" ? "继续质押" : "Stake Again"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "failed") {
    return (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-black/86 p-4">
        <div className="relative w-full max-w-[420px] rounded-[22px] border border-white/10 bg-[#1f1c18] px-6 pb-6 pt-5 text-zinc-100 shadow-[0_30px_90px_rgba(0,0,0,0.72)]">
          <button
            onClick={closeWithReset}
            className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
          >
            <X className="size-[18px]" />
          </button>
          <h3 className="mb-6 text-center text-[15px] font-medium tracking-wide text-[#d9b45a]">
            {lang === "cn" ? "提交失败" : "Submission Failed"}
          </h3>
          <div className="rounded-[16px] border border-red-400/25 bg-red-500/10 px-4 py-3 text-[14px] text-red-200">
            {failureReason || (lang === "cn" ? "提交失败，请稍后重试" : "Submission failed. Please retry later.")}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
              className="h-[50px] rounded-[12px] border border-white/20 bg-transparent text-[15px] text-white hover:bg-white/5"
              onClick={closeWithReset}
            >
              {copyOf(lang, feedbackCopy.common.cancel)}
            </Button>
            <Button
              className="h-[50px] rounded-[12px] bg-[#e5bc54] text-[15px] font-semibold text-[#1c1c1c] hover:bg-[#d4ad49]"
              onClick={() => setStep("form")}
            >
              {lang === "cn" ? "重新填写" : "Back to Form"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "submitting") {
    return (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-black/86 p-4">
        <div className="w-full max-w-[420px] rounded-[22px] border border-white/10 bg-[#1f1c18] px-6 py-10 text-center text-zinc-100 shadow-[0_30px_90px_rgba(0,0,0,0.72)]">
          <Loader2 className="mx-auto size-8 animate-spin text-[#e5bc54]" />
          <h4 className="mt-4 text-xl font-semibold text-white">
            {lang === "cn" ? "处理中" : "Processing"}
          </h4>
          <p className="mt-2 text-sm text-zinc-400">
            {insureEnabled && !insuranceUnavailable
              ? lang === "cn"
                ? "正在提交质押与投保流程..."
                : "Submitting stake plus insurance request..."
              : lang === "cn"
                ? "正在提交质押流程..."
                : "Submitting staking request..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/88 p-0 sm:grid sm:place-items-center sm:p-4">
      <div className="relative mt-auto max-h-[88vh] w-full overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#23211d] px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4 text-zinc-100 shadow-[0_30px_90px_rgba(0,0,0,0.72)] sm:mt-0 sm:max-h-[95vh] sm:max-w-[500px] sm:rounded-[24px] sm:px-6 sm:pb-6 sm:pt-5">
        <button
          onClick={closeWithReset}
          className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
        >
          <X className="size-[18px]" />
        </button>
        <h3 className="mb-5 pr-10 text-center text-[15px] font-medium tracking-wide text-white sm:mb-6">
          {lang === "cn" ? "质押" : "Stake"}
        </h3>

        <div className="space-y-5">
          <section className="rounded-[18px] border border-white/8 bg-[#2b2823] px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <TokenIconPill src={assetIcon} alt={assetSymbol} label={assetSymbol} circleClassName="bg-transparent" />
              </div>
              <div className="text-right text-[12px] text-zinc-500">
                <p>{lang === "cn" ? "单价" : "Unit Price"}</p>
                <p className="mt-1 text-[15px] font-medium text-white">$ {unitPriceUsd1.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              <SummaryMetric label={lang === "cn" ? "可质押余额" : "Available"} value={`${formattedStakeAvailable} ${assetSymbol}`} />
              <SummaryMetric label="APR" value={`${displayAprValue}%`} />
              <SummaryMetric label="USD1" value={`${availableUsd1Balance.toFixed(2)} USD1`} />
            </div>
          </section>

          <section>
            <p className="mb-3 flex items-center gap-1.5 text-[13px] text-zinc-300">
              <span className="text-[#f26f63]">*</span>
              <span>{lang === "cn" ? "质押数量" : "Staking Amount"}</span>
            </p>
            <div
              className={`flex min-h-[52px] flex-col items-stretch justify-between gap-3 rounded-[14px] border bg-[#23211d] px-4 py-3 sm:h-[52px] sm:flex-row sm:items-center sm:gap-4 sm:py-0 ${
                stakeValidationMessage ? "border-red-500/70" : "border-white/8"
              }`}
            >
              <Input
                className={`h-full border-0 bg-transparent px-0 text-[15px] shadow-none placeholder:text-zinc-600 focus-visible:ring-0 ${
                  stakeValidationMessage ? "text-red-300" : "text-zinc-200"
                }`}
                value={amount}
                placeholder="0.0"
                onChange={(event) => onStakeAmountChange(event.target.value)}
              />
              <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-start">
                <TokenIconPill
                  src={assetIcon}
                  alt={assetSymbol}
                  label={assetSymbol}
                  circleClassName="bg-transparent"
                  secondary={
                    <button
                      type="button"
                      className="text-xs text-[#e5bc54]"
                      onClick={() => setAmount(formatNumberForInput(stakeAvailable, 6))}
                    >
                      {copyOf(lang, feedbackCopy.stake.max)}
                    </button>
                  }
                />
              </div>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-zinc-500">
              {lang === "cn" ? "可用：" : "Available: "}
              <span className="text-zinc-300">{formattedStakeAvailable} {assetSymbol}</span>
              <button
                type="button"
                className="font-medium text-[#e5bc54]"
                onClick={() => {
                  closeWithReset();
                  onBuyRequest?.();
                }}
              >
                {lang === "cn" ? "购买" : "Buy"}
              </button>
            </p>
          </section>

          <section className="rounded-[18px] border border-white/8 bg-[#1f1d19] px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] text-zinc-500">{lang === "cn" ? "质押概览" : "Stake Summary"}</p>
                <p className="mt-1 text-[18px] font-semibold text-white">{lang === "cn" ? "费用与奖励测算" : "Cost & Reward Estimate"}</p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] text-zinc-400">
                {lang === "cn" ? "以最终确认为准" : "Subject to confirmation"}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              <SummaryMetric label={lang === "cn" ? "质押价值" : "Stake Value"} value={`$ ${stakedValue.toFixed(2)}`} />
              <SummaryMetric label={lang === "cn" ? "月度预估奖励" : "Monthly Est. Reward"} value={`${monthlyRewardDisplay} REAL`} />
              <SummaryMetric label={lang === "cn" ? "参考APR" : "Reference APR"} value={`${displayAprValue}%`} />
            </div>
            <div className="mt-4 space-y-3 rounded-[14px] border border-white/8 bg-black/20 px-4 py-3 text-[13px] text-zinc-400">
              {scheduleRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <span>{row.label}</span>
                  <span className="text-zinc-300">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[20px] border border-[#dcb254]/14 bg-[linear-gradient(180deg,rgba(39,33,24,0.96),rgba(23,21,18,0.98))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(229,188,84,0.08),rgba(229,188,84,0))]" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] text-zinc-500">{lang === "cn" ? "保险模块" : "Insurance Module"}</p>
                <h4 className="mt-1 text-[18px] font-semibold text-white">
                  {lang === "cn" ? "是否投保" : "Enable Insurance"}
                </h4>
                <p className="mt-2 max-w-[320px] text-[12px] leading-6 text-zinc-500">
                  {lang === "cn"
                    ? "仅覆盖底层债券/债权违约风险，不覆盖市场价格波动，也不构成保本承诺。"
                    : "Covers bond-credit default risk only. It does not insure market price volatility or promise principal protection."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (insuranceUnavailable) return;
                  setInsureEnabled((prev) => !prev);
                }}
                className={`relative inline-flex h-8 w-[58px] items-center rounded-full border transition ${
                  insureEnabled && !insuranceUnavailable
                    ? "border-[#dcb254] bg-[#dcb254]/20"
                    : "border-white/10 bg-[#131313]"
                } ${insuranceUnavailable ? "cursor-not-allowed opacity-50" : ""}`}
                aria-pressed={insureEnabled}
              >
                <span
                  className={`mx-1 block size-6 rounded-full bg-white transition-transform ${
                    insureEnabled && !insuranceUnavailable ? "translate-x-[26px] bg-[#e5bc54]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {insuranceUnavailable ? (
              <div className="mt-4 rounded-[14px] border border-white/8 bg-[#171717] px-4 py-3 text-[13px] text-zinc-400">
                <p className="font-medium text-zinc-200">{lang === "cn" ? "当前项目暂不可投保" : "Insurance unavailable for this asset"}</p>
                <p className="mt-2 leading-6 text-zinc-500">
                  {insuranceConfig
                    ? lang === "cn"
                      ? insuranceConfig.riskNoticeCn
                      : insuranceConfig.riskNoticeEn
                    : lang === "cn"
                      ? "未找到该资产的保险项目配置，请先补齐项目级配置。"
                      : "No insurance config found for this asset. Please provide project-level configuration first."}
                </p>
              </div>
            ) : (
              <>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                  {insuranceConfig.coverageOptions.map((option) => {
                    const active = option === insuranceRatio;
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`min-w-[62px] rounded-full border px-3 py-1.5 text-[13px] transition ${
                          active
                            ? "border-[#dcb254] bg-[#dcb254]/15 text-[#f1cf82]"
                            : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20"
                        }`}
                        onClick={() => setInsuranceRatio(option)}
                        disabled={!insureEnabled}
                      >
                        {option}%
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <SummaryMetric label={lang === "cn" ? "保障额度" : "Coverage Amount"} value={`$ ${coverageAmountUsd1.toFixed(2)}`} />
                  <SummaryMetric label={lang === "cn" ? "保费" : "Premium"} value={`$ ${estimatedPremiumUsd1.toFixed(2)}`} />
                  <SummaryMetric label={lang === "cn" ? "项目评级" : "Rating"} value={insuranceConfig.rating} />
                  <SummaryMetric label={lang === "cn" ? "风险等级" : "Risk Level"} value={lang === "cn" ? insuranceConfig.riskLevelCn : insuranceConfig.riskLevelEn} />
                  <SummaryMetric label={lang === "cn" ? "剩余承保额度" : "Remaining Quota"} value={`$ ${insuranceConfig.remainingCoverageAmount.toFixed(2)}`} />
                  <SummaryMetric label={lang === "cn" ? "USD1 可用余额" : "USD1 Available"} value={`$ ${availableUsd1Balance.toFixed(2)}`} />
                </div>

                <div className="mt-4 hidden rounded-[14px] border border-white/8 bg-black/20 px-4 py-3 sm:block">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-zinc-500">
                    {lang === "cn" ? "赔付优先级" : "Payout Priority"}
                  </p>
                  <p className="mt-2 text-[13px] leading-6 text-zinc-300">
                    {lang === "cn" ? insuranceConfig.priorityDescriptionCn : insuranceConfig.priorityDescriptionEn}
                  </p>
                </div>
                <div className="mt-3 hidden rounded-[14px] border border-white/8 bg-black/20 px-4 py-3 sm:block">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-zinc-500">
                    {lang === "cn" ? "保险池说明" : "Insurance Pool"}
                  </p>
                  <p className="mt-2 text-[13px] leading-6 text-zinc-300">
                    {lang === "cn"
                      ? insuranceConfig.insurancePoolDescriptionCn
                      : insuranceConfig.insurancePoolDescriptionEn}
                  </p>
                </div>
                <div className="mt-3 hidden rounded-[14px] border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-[13px] leading-6 text-amber-100 sm:block">
                  <p>{lang === "cn" ? insuranceConfig.riskNoticeCn : insuranceConfig.riskNoticeEn}</p>
                </div>
                <div className="mt-3 space-y-2 sm:hidden">
                  <details className="rounded-[14px] border border-white/8 bg-black/20 px-4 py-3">
                    <summary className="cursor-pointer text-[12px] uppercase tracking-[0.14em] text-zinc-500">
                      {lang === "cn" ? "赔付优先级" : "Payout Priority"}
                    </summary>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-300">
                      {lang === "cn" ? insuranceConfig.priorityDescriptionCn : insuranceConfig.priorityDescriptionEn}
                    </p>
                  </details>
                  <details className="rounded-[14px] border border-white/8 bg-black/20 px-4 py-3">
                    <summary className="cursor-pointer text-[12px] uppercase tracking-[0.14em] text-zinc-500">
                      {lang === "cn" ? "保险池说明" : "Insurance Pool"}
                    </summary>
                    <p className="mt-2 text-[13px] leading-6 text-zinc-300">
                      {lang === "cn"
                        ? insuranceConfig.insurancePoolDescriptionCn
                        : insuranceConfig.insurancePoolDescriptionEn}
                    </p>
                  </details>
                  <details className="rounded-[14px] border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-amber-100">
                    <summary className="cursor-pointer text-[12px] uppercase tracking-[0.14em]">
                      {lang === "cn" ? "风险提示" : "Risk Notice"}
                    </summary>
                    <p className="mt-2 text-[13px] leading-6">
                      {lang === "cn" ? insuranceConfig.riskNoticeCn : insuranceConfig.riskNoticeEn}
                    </p>
                  </details>
                </div>
              </>
            )}
          </section>

          {validationMessage ? <p className="text-xs text-red-400">{validationMessage}</p> : null}

          <div className="sticky bottom-0 z-10 -mx-5 mt-1 border-t border-white/8 bg-[#23211d]/95 px-5 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-4 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-1 sm:backdrop-blur-none">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Button
              className="h-[52px] rounded-[12px] border border-white/20 bg-transparent text-[15px] text-zinc-100 hover:bg-white/5"
              onClick={closeWithReset}
            >
              {copyOf(lang, feedbackCopy.common.cancel)}
            </Button>
            <Button
              className="h-[52px] rounded-[12px] bg-[#e5bc54] text-[15px] font-semibold text-[#1c1c1c] disabled:opacity-50 hover:bg-[#d4ad49]"
              disabled={Boolean(validationMessage)}
              onClick={beginStakeFlow}
            >
              {insureEnabled && !insuranceUnavailable
                ? lang === "cn"
                  ? "确认质押并投保"
                  : "Confirm Stake + Insure"
                : lang === "cn"
                  ? "确认质押"
                  : "Confirm Stake"}
            </Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-2.5">
      <p className="text-[12px] text-zinc-500">{label}</p>
      <p className="mt-1 text-[15px] font-medium text-white">{value}</p>
    </div>
  );
}

export function ClaimModal({
  open,
  onClose,
  onViewDashboard,
}: BaseProps & {
  onViewDashboard?: () => void;
}) {
  const { lang } = useRwaAppState();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState("");
  const [realAmount, setRealAmount] = useState("");
  const claimUsdtAvailable = 12700274.223;
  const claimRealAvailable = 12700274.223;
  const onUsdtChange = (next: string) => {
    const sanitized = sanitizeNumericInput(next, 6);
    if (sanitized === null) return;
    if (sanitized.trim() === "") {
      setUsdtAmount("");
      setRealAmount("");
      return;
    }
    const n = Number(sanitized);
    if (!Number.isFinite(n)) return;
    const clamped = clampNumber(n, claimUsdtAvailable);
    setUsdtAmount(formatNumberForInput(clamped, 6));
    setRealAmount(formatNumberForInput(clamped, 6));
  };
  const onRealChange = (next: string) => {
    const sanitized = sanitizeNumericInput(next, 6);
    if (sanitized === null) return;
    if (sanitized.trim() === "") {
      setUsdtAmount("");
      setRealAmount("");
      return;
    }
    const n = Number(sanitized);
    if (!Number.isFinite(n)) return;
    const clamped = clampNumber(n, claimRealAvailable);
    setRealAmount(formatNumberForInput(clamped, 6));
    setUsdtAmount(formatNumberForInput(clamped, 6));
  };
  const closeWithReset = () => {
    setBusy(false);
    setSuccess(false);
    setUsdtAmount("");
    setRealAmount("");
    onClose();
  };

  if (!open) return null;

  const usdtNum = Number(usdtAmount);
  const realNum = Number(realAmount);
  const canClaim =
    Number.isFinite(usdtNum) && usdtNum > 0 && Number.isFinite(realNum) && realNum > 0;
  const remainingUsdt = CLAIM_REMAINING_PREVIEW;
  const remainingReal = CLAIM_REMAINING_PREVIEW;

  if (success) {
    return (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-4">
        <div className="mac-modal-panel mac-modal-panel-lg relative w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#1a1a1a] px-6 pb-6 pt-5 text-zinc-100 shadow-[0_30px_90px_rgba(0,0,0,0.72)]">
          <button
            onClick={closeWithReset}
            className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
          >
            <X className="size-[18px]" />
          </button>
          <h3 className="mac-modal-title mb-6 text-center text-[15px] font-medium tracking-wide text-[#c8a84e]">{copyOf(lang, feedbackCopy.claim.title)}</h3>

          <div className="mb-5 flex justify-center">
            <div className="grid size-14 place-items-center rounded-full bg-[#2BC28E]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-11 text-[#161616]"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <h4 className="mac-modal-success-title mb-7 text-center text-2xl font-semibold leading-tight">
            {lang === "cn" ? "收益领取提交成功" : "Claim Submitted Successfully"}
          </h4>

          <div className="mac-modal-card rounded-xl bg-[#2a2a2a] px-6 py-5 text-[15px]">
            <div className="mb-4 flex items-start justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "领取总额" : "Total Claimed"}</span>
              <span className="text-right font-mono text-zinc-300">
                {(usdtNum || 0).toLocaleString(undefined, { maximumFractionDigits: 3 })} USD1
                <br />
                {(realNum || 0).toLocaleString(undefined, { maximumFractionDigits: 3 })} REAL
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "预计获得资产" : "Expected Asset"}</span>
              <span className="font-mono text-zinc-300">
                {(realNum || 0).toLocaleString(undefined, { maximumFractionDigits: 3 })} RWA
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "提交时间" : "Submitted At"}</span>
              <span className="font-mono text-zinc-300">2026-03-02 11:00:00</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "交易哈希" : "Tx Hash"}</span>
              <span className="truncate font-mono text-zinc-300">0x8a22se2b...9f3c8a22se2b</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button
              className="mac-modal-action h-[52px] rounded-xl border border-white/35 bg-transparent text-[15px] text-white hover:bg-white/5"
              onClick={() => {
                closeWithReset();
                onViewDashboard?.();
                if (!onViewDashboard) {
                  router.push(REALRWA_ROUTES.portfolioTrade);
                }
              }}
            >
              {lang === "cn" ? "查看详情" : "View Details"}
            </Button>
            <Button
              className="mac-modal-action h-[52px] rounded-xl bg-[#e5bc54] text-[15px] font-semibold text-[#1c1c1c] hover:bg-[#d4ad49]"
              onClick={() => {
                setSuccess(false);
                setUsdtAmount("");
                setRealAmount("");
              }}
            >
              {lang === "cn" ? "继续领取" : "Continue Claim"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-4">
      <div className="mac-modal-panel mac-modal-panel-lg relative w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#1a1a1a] px-6 pb-6 pt-5 text-zinc-100 shadow-[0_30px_90px_rgba(0,0,0,0.72)]">
        <button
          onClick={closeWithReset}
          className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
        >
          <X className="size-[18px]" />
        </button>
        <h3 className="mac-modal-title mb-6 text-center text-[15px] font-medium tracking-wide text-[#c8a84e]">{copyOf(lang, feedbackCopy.claim.title)}</h3>

        <p className="mb-2 inline-flex items-center gap-2 text-[13px] text-zinc-400">
          {lang === "cn" ? "USDT 数量" : "USDT Amount"}
          <Info className="size-5 text-zinc-500" />
        </p>
        <div className="mac-modal-field flex h-[52px] items-center justify-between rounded-xl border border-white/8 px-5">
          <Input
            className="h-full border-0 bg-transparent px-0 text-base font-mono text-zinc-300 shadow-none focus-visible:ring-0"
            value={usdtAmount}
            placeholder="0.00"
            onChange={(event) => onUsdtChange(event.target.value)}
          />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-[15px]">
              <span className="grid size-10 place-items-center rounded-full bg-[#53B59A] text-[15px] font-semibold text-white">T</span>
              <span>USDT</span>
            </span>
            <button
              type="button"
              className="mac-modal-max text-xs text-[#FACC15]"
              onClick={() => {
                setUsdtAmount(formatNumberForInput(claimUsdtAvailable, 6));
                setRealAmount(formatNumberForInput(claimRealAvailable, 6));
              }}
            >
              {copyOf(lang, feedbackCopy.buy.max)}
            </button>
          </div>
        </div>
        <p className="mt-2 text-[12px] text-zinc-500">
          {lang === "cn" ? "可领取：" : "Claimable: "}
          {claimUsdtAvailable.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} USDT
        </p>

        <div className="my-6 h-px bg-white/10" />

        <p className="mb-2 text-[13px] text-zinc-400">{lang === "cn" ? "REAL 数量" : "REAL Amount"}</p>
        <div className="mac-modal-field flex h-[52px] items-center justify-between rounded-xl border border-white/8 px-5">
          <Input
            className="h-full border-0 bg-transparent px-0 text-base font-mono text-zinc-300 shadow-none focus-visible:ring-0"
            value={realAmount}
            placeholder="0.00"
            onChange={(event) => onRealChange(event.target.value)}
          />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-[15px]">
              <span className="grid size-10 place-items-center rounded-full bg-[#35359A] text-[15px] font-semibold text-[#F2C94C]">✦</span>
              <span>REAL</span>
            </span>
            <button
              type="button"
              className="mac-modal-max text-xs text-[#FACC15]"
              onClick={() => {
                setRealAmount(formatNumberForInput(claimRealAvailable, 6));
                setUsdtAmount(formatNumberForInput(claimUsdtAvailable, 6));
              }}
            >
              {copyOf(lang, feedbackCopy.buy.max)}
            </button>
          </div>
        </div>
        <p className="mt-2 text-[12px] text-zinc-500">
          {lang === "cn" ? "可领取：" : "Claimable: "}
          {claimRealAvailable.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} REAL
        </p>

        <p className="mb-2 mt-9 text-[13px] text-zinc-400">{lang === "cn" ? "交易概览" : "Transaction overview"}</p>
        <div className="rounded-xl bg-[#2a2a2a] px-5 py-4 text-xs text-zinc-400">
          <div className="mb-4 flex items-center justify-between gap-4">
            <span>{lang === "cn" ? "剩余可领取 USDT" : "Remaining Claimable USDT"}</span>
            <span className="font-mono">{remainingUsdt.toFixed(3)} USDT</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>{lang === "cn" ? "剩余可领取 REAL" : "Remaining Claimable REAL"}</span>
            <span className="font-mono">{remainingReal.toFixed(3)} REAL</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button
            className="mac-modal-action h-[52px] rounded-xl border border-white/35 bg-transparent text-[15px] text-white hover:bg-white/5"
            onClick={closeWithReset}
          >
            {copyOf(lang, feedbackCopy.common.cancel)}
          </Button>
          <Button
            className="mac-modal-action h-[52px] rounded-xl bg-[#e5bc54] text-[15px] font-semibold text-[#1c1c1c] disabled:opacity-50 hover:bg-[#d4ad49]"
            disabled={busy || !canClaim}
            onClick={async () => {
              setBusy(true);
              await wait(900);
              setBusy(false);
              setSuccess(true);
            }}
          >
            {busy ? <Loader2 className="mr-2 size-5 animate-spin" /> : null}
            {lang === "cn" ? "领取" : "Claim"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RedeemModal({
  open,
  onClose,
  onViewBalance,
}: BaseProps & {
  onViewBalance?: () => void;
}) {
  const { lang } = useRwaAppState();
  const router = useRouter();
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [amount, setAmount] = useState("0.00");
  const numericAmount = Number(amount) || 0;
  const parsedAmount = Number(amount);
  const estimated = useMemo(() => numericAmount * (1 - 0.0005), [numericAmount]);

  const onRedeemAmountChange = (next: string) => {
    if (next.trim() === "") {
      setAmount("");
      return;
    }
    const sanitized = sanitizeNumericInput(next, 6);
    if (sanitized === null) return;
    if (sanitized.trim() === "") {
      setAmount("");
      return;
    }
    const n = Number(sanitized);
    if (!Number.isFinite(n)) return;
    setAmount(sanitized);
  };
  const redeemEmptyOrZero =
    amount.trim() === "" || !Number.isFinite(parsedAmount) || parsedAmount <= 0;
  const redeemOverAvailable =
    Number.isFinite(parsedAmount) && parsedAmount > REDEEM_AVAILABLE_RTOKEN;
  const redeemValidationMessage = redeemEmptyOrZero
    ? copyOf(lang, feedbackCopy.redeem.enterAmount)
    : redeemOverAvailable
      ? copyOf(lang, feedbackCopy.redeem.insufficientAvailable)
      : "";

  if (!open) return null;

  if (step === "success") {
    return (
      <ModalShell
        title={copyOf(lang, feedbackCopy.redeem.success)}
        onClose={onClose}
        widthClass="max-w-[420px]"
      >
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
          <Button
            className="real-outline-btn h-[52px] text-base"
            onClick={() => {
              onClose();
              setStep("form");
              router.push(REALRWA_ROUTES.portfolioTrade);
            }}
          >
            {copyOf(lang, feedbackCopy.common.viewPortfolio)}
          </Button>
          <Button
            className="real-gold-btn h-[52px] text-base"
            onClick={() => {
              onClose();
              onViewBalance?.();
              if (!onViewBalance) {
                router.push(REALRWA_ROUTES.balance);
              }
              setStep("form");
            }}
          >
            {copyOf(lang, feedbackCopy.redeem.viewBalance)}
          </Button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title={copyOf(lang, feedbackCopy.redeem.title)} onClose={onClose}>
      {step === "form" ? (
        <>
          <p className="text-lg text-zinc-300">
            <span className="mr-1 text-red-400">*</span>
            {copyOf(lang, feedbackCopy.redeem.amount)}
          </p>
          <div className={`mt-2 rounded-2xl border px-5 py-4 ${redeemValidationMessage ? "border-red-500" : "border-zinc-600"}`}>
            <div className="flex items-center justify-between gap-4">
              <Input
                className="h-[52px] border-0 bg-transparent px-0 text-lg font-mono shadow-none focus-visible:ring-0"
                value={amount}
                onChange={(event) => onRedeemAmountChange(event.target.value)}
              />
              <div className="flex shrink-0 items-center gap-2 text-lg">
                <TokenBadge label="Rtoken" tone="purple" />
                <button
                  type="button"
                  className="text-[#FACC15]"
                  onClick={() => setAmount(formatNumberForInput(REDEEM_AVAILABLE_RTOKEN, 6))}
                >
                  {copyOf(lang, feedbackCopy.redeem.max)}
                </button>
              </div>
            </div>
          </div>
          {redeemValidationMessage ? (
            <p className="mt-2 text-[15px] text-red-400">{redeemValidationMessage}</p>
          ) : null}
          <p className="mt-2 text-lg text-zinc-400">
            {lang === "cn" ? `可用：${REDEEM_AVAILABLE_RTOKEN.toFixed(2)} Rtoken` : `Available: ${REDEEM_AVAILABLE_RTOKEN.toFixed(2)} Rtoken`}
          </p>

          <div className="my-5 grid place-items-center">
            <span className="rounded-2xl bg-white/10 p-4">
              <ArrowDown className="size-9 text-zinc-300" />
            </span>
          </div>

          <p className="text-lg text-zinc-300">{copyOf(lang, feedbackCopy.redeem.receive)}</p>
          <div className="mt-2 rounded-2xl border border-zinc-600 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <Input
                className="h-[52px] border-0 bg-transparent px-0 text-lg font-mono shadow-none focus-visible:ring-0"
                value={estimated.toFixed(4)}
                readOnly
              />
              <div className="flex shrink-0 items-center gap-2 text-lg">
                <TokenBadge label="RWA" tone="gold" />
              </div>
            </div>
          </div>
          <p className="mt-2 text-lg text-zinc-400">{lang === "cn" ? "可用：1000.00 RWA" : "Available: 1000.00 RWA"}</p>

          <h4 className="mt-5 text-lg font-semibold">{copyOf(lang, feedbackCopy.redeem.summary)}</h4>
          <div className="mt-2 rounded-2xl bg-white/5 p-5 text-lg text-zinc-400">
            <p className="flex items-center justify-between">
              <span>{lang === "cn" ? "预计到达日期" : "Estimated Date"}</span>
              <span className="font-mono">2026-02-11 16:13:34</span>
            </p>
            <p className="mt-4 flex items-center justify-between">
              <span>{lang === "cn" ? "转换比率" : "Conversion Ratio"}</span>
              <span className="font-mono">1 R Token=1 RWA</span>
            </p>
            <p className="mt-4 flex items-center justify-between">
              <span>{lang === "cn" ? "赎回手续费 (0.05%)" : "Redemption Fee (0.05%)"}</span>
              <span className="font-mono">{(numericAmount * 0.0005).toFixed(4)} USD1</span>
            </p>
          </div>

          <div className="sticky bottom-0 mt-6 grid grid-cols-2 gap-4 border-t border-white/10 bg-[#1a1a1a] pt-4">
            <Button className="real-outline-btn h-12 text-lg" onClick={onClose}>
              {copyOf(lang, feedbackCopy.common.cancel)}
            </Button>
            <Button
              className="real-gold-btn h-12 text-lg"
              disabled={Boolean(redeemValidationMessage)}
              onClick={() => setStep("confirm")}
            >
              {lang === "cn" ? "赎回" : "Redeem"}
            </Button>
          </div>
        </>
      ) : null}

      {step === "confirm" ? (
        <>
          <div className="mb-5 flex items-center gap-3 text-amber-300">
            <AlertTriangle className="size-8" />
            <h4 className="text-lg font-semibold">
              {copyOf(lang, feedbackCopy.redeem.confirmBurn)}
            </h4>
          </div>
          <p className="text-lg text-zinc-400">
            {lang === "cn"
              ? "预估到账金额已扣除 0.05% 手续费。"
              : "Estimated amount includes 0.05% fee deduction."}
          </p>
          <div className="mt-5 rounded-2xl bg-white/5 p-5 text-lg text-zinc-300">
            <p className="flex items-center justify-between">
              <span>{lang === "cn" ? "预估到账" : "Estimated Receive"}</span>
              <span className="font-mono">{estimated.toFixed(4)} RWA</span>
            </p>
          </div>
          <div className="sticky bottom-0 mt-6 grid grid-cols-2 gap-4 border-t border-white/10 bg-[#1a1a1a] pt-4">
            <Button
              className="real-outline-btn h-12 text-lg"
              onClick={() => setStep("form")}
            >
              {copyOf(lang, feedbackCopy.common.thinkAgain)}
            </Button>
            <Button className="real-gold-btn h-12 text-lg" onClick={() => setStep("success")}>
              {copyOf(lang, feedbackCopy.common.confirm)}
            </Button>
          </div>
        </>
      ) : null}
    </ModalShell>
  );
}

export function WithdrawModal({ open, onClose }: BaseProps) {
  const { lang } = useRwaAppState();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");
  const [busy, setBusy] = useState(false);
  const withdrawAvailable = 12700274.223;
  const min = 20;
  const closeWithReset = () => {
    setBusy(false);
    setStep("form");
    setAmount("");
    onClose();
  };
  const onWithdrawAmountChange = (next: string) => {
    if (next.trim() === "") {
      setAmount("");
      return;
    }
    const sanitized = sanitizeNumericInput(next, 6);
    if (sanitized === null) return;
    const n = Number(sanitized);
    if (!Number.isFinite(n)) return;
    const clamped = clampNumber(n, withdrawAvailable);
    setAmount(formatNumberForInput(clamped, 6));
  };
  const amountNum = Number(amount);
  const tooLow =
    amount.trim() !== "" && Number.isFinite(amountNum) && amountNum > 0 && amountNum < min;
  const emptyOrZero =
    amount.trim() === "" || !Number.isFinite(amountNum) || amountNum <= 0;
  const remainingSupply = WITHDRAW_REMAINING_SUPPLY_PREVIEW;

  if (!open) return null;

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-4">
        <div className="mac-modal-panel mac-modal-panel-md relative w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#1a1a1a] px-6 pb-6 pt-5 text-zinc-100 shadow-[0_30px_90px_rgba(0,0,0,0.72)]">
          <button
            onClick={closeWithReset}
            className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
          >
            <X className="size-[18px]" />
          </button>
          <h3 className="mac-modal-title mb-6 text-center text-[15px] font-medium tracking-wide text-[#c8a84e]">{copyOf(lang, feedbackCopy.withdraw.title)}</h3>

          <div className="mb-5 flex justify-center">
            <div className="grid size-14 place-items-center rounded-full bg-[#2BC28E]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-11 text-[#161616]"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <h4 className="mac-modal-success-title mb-7 text-center text-2xl font-semibold leading-tight">
            {lang === "cn" ? "提现提交成功" : "Withdraw Submitted Successfully"}
          </h4>

          <div className="mac-modal-card rounded-xl bg-[#2a2a2a] px-6 py-5 text-[15px]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "支付总额" : "Total Paid"}</span>
              <span className="font-mono text-zinc-300">
                {(amountNum || 0).toLocaleString(undefined, { maximumFractionDigits: 3 })} USD1
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "预计到账" : "Estimated Receive"}</span>
              <span className="font-mono text-zinc-300">
                {(amountNum || 0).toLocaleString(undefined, { maximumFractionDigits: 3 })} USD1
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "提交时间" : "Submitted At"}</span>
              <span className="font-mono text-zinc-300">2026-03-02 11:00:00</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-500">{lang === "cn" ? "交易哈希" : "Tx Hash"}</span>
              <span className="truncate font-mono text-zinc-300">0x8a22se2b...9f3c8a22se2b</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button
              className="mac-modal-action h-[52px] rounded-xl border border-white/35 bg-transparent text-[15px] text-white hover:bg-white/5"
              onClick={() => {
                closeWithReset();
                router.push(REALRWA_ROUTES.portfolioTrade);
              }}
            >
              {lang === "cn" ? "查看详情" : "View Details"}
            </Button>
            <Button
              className="mac-modal-action h-[52px] rounded-xl bg-[#e5bc54] text-[15px] font-semibold text-[#1c1c1c] hover:bg-[#d4ad49]"
              onClick={() => {
                setStep("form");
                setBusy(false);
                setAmount("");
              }}
            >
              {lang === "cn" ? "继续提现" : "Continue Withdraw"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/85 p-4">
      <div className="mac-modal-panel mac-modal-panel-md relative w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#1a1a1a] px-6 pb-6 pt-5 text-zinc-100 shadow-[0_30px_90px_rgba(0,0,0,0.72)]">
        <button
          onClick={closeWithReset}
          className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
        >
          <X className="size-[18px]" />
        </button>
        <h3 className="mac-modal-title mb-6 text-center text-[15px] font-medium tracking-wide text-[#c8a84e]">{copyOf(lang, feedbackCopy.withdraw.title)}</h3>

        <p className="mb-2 text-[13px] text-zinc-400">{lang === "cn" ? "数量" : "Amount"}</p>
        <div
          className={`mac-modal-field flex h-[52px] items-center justify-between rounded-xl border px-5 ${tooLow ? "border-red-500/70" : "border-white/8"}`}
        >
          <Input
            className="h-full border-0 bg-transparent px-0 text-base font-mono text-zinc-300 shadow-none focus-visible:ring-0"
            value={amount}
            placeholder="0.00"
            onChange={(event) => onWithdrawAmountChange(event.target.value)}
          />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-[15px]">
              <span className="grid size-10 place-items-center rounded-full bg-[#E8C14C] text-[15px] font-semibold text-black">R</span>
              <span>RWA</span>
            </span>
            <button
              type="button"
              className="mac-modal-max text-xs text-[#FACC15]"
              onClick={() => setAmount(formatNumberForInput(withdrawAvailable, 6))}
            >
              {copyOf(lang, feedbackCopy.withdraw.max)}
            </button>
          </div>
        </div>
        <p className="mt-2 text-[12px] text-zinc-500">
          {lang === "cn" ? "可提现：" : "Available to withdraw: "}
          {withdrawAvailable.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} RWA
        </p>
        {tooLow ? <p className="mt-2 text-[15px] text-red-400">{copyOf(lang, feedbackCopy.withdraw.minAmount)}</p> : null}

        <p className="mb-2 mt-6 text-[13px] text-zinc-400">{lang === "cn" ? "交易概览" : "Transaction overview"}</p>
        <div className="rounded-xl bg-[#2a2a2a] px-5 py-4 text-xs text-zinc-400">
          <div className="mb-4 flex items-center justify-between gap-4">
            <span>{lang === "cn" ? "剩余供应量" : "Remaining Supply"}</span>
            <span className="font-mono">{remainingSupply.toFixed(3)} RWA</span>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between gap-4">
              <span>{lang === "cn" ? "健康因子" : "Health factor"}</span>
              <span className="inline-flex items-center gap-2 font-mono">
                <span>8.23</span>
                <span className="text-zinc-500">→</span>
                <span className="text-emerald-400">6.23</span>
                <span className="text-emerald-400">◆</span>
                <span className="text-emerald-400">{lang === "cn" ? "安全" : "Stay Safe"}</span>
              </span>
            </div>
            <p className="mt-1 text-right font-mono">{lang === "cn" ? "清算阈值 < 1.0" : "Liquidation at < 1.0"}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>LTV</span>
            <span className="font-mono">0.034</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button
            className="mac-modal-action h-[52px] rounded-xl border border-white/35 bg-transparent text-[15px] text-white hover:bg-white/5"
            onClick={closeWithReset}
          >
            {copyOf(lang, feedbackCopy.common.cancel)}
          </Button>
          <Button
            className="mac-modal-action h-[52px] rounded-xl bg-[#e5bc54] text-[15px] font-semibold text-[#1c1c1c] disabled:opacity-50 hover:bg-[#d4ad49]"
            disabled={busy || emptyOrZero || tooLow}
            onClick={async () => {
              setBusy(true);
              await wait(900);
              setBusy(false);
              setStep("success");
            }}
          >
            {busy ? <Loader2 className="mr-2 size-5 animate-spin" /> : null}
            {lang === "cn" ? "提现" : "Withdraw"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SellModal({
  open,
  onClose,
  onSold,
  assetSymbol = "RWA1",
  assetIssuer,
  quoteSymbol = "USDC",
}: BaseProps & {
  onSold?: (usd1Amount: number) => void;
  assetSymbol?: string;
  assetIssuer?: string;
  quoteSymbol?: string;
}) {
  const { lang } = useRwaAppState();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState("0.00");
  const [success, setSuccess] = useState(false);
  const [blockedInvalid, setBlockedInvalid] = useState(false);
  const [cutoffOpen, setCutoffOpen] = useState(false);
  const [timingNotice, setTimingNotice] = useState<RwaTradeTimingNotice | null>(null);
  const closeWithReset = () => {
    setBusy(false);
    setSuccess(false);
    onClose();
  };

  if (!open) return null;

  const amountNum = Number(amount);
  const sellValueUsd1 = Number.isFinite(amountNum) ? amountNum * PRICE : 0;
  const emptyOrZero = amount.trim() === "" || !Number.isFinite(amountNum) || amountNum <= 0;
  const belowMin = !emptyOrZero && sellValueUsd1 < MIN_SELL_USD1;
  const overAvailable = Number.isFinite(amountNum) && amountNum > SELL_AVAILABLE_RWA;
  const validationMessage = blockedInvalid
    ? copyOf(lang, feedbackCopy.sell.invalidNumber)
    : emptyOrZero
      ? copyOf(lang, feedbackCopy.sell.enterAmount)
      : belowMin
        ? copyOf(lang, feedbackCopy.sell.minAmount)
        : overAvailable
          ? copyOf(lang, feedbackCopy.sell.insufficientAvailable)
          : "";

  const primaryLabel = lang === "cn" ? "卖出" : "Sell";

  const isSellValid = !validationMessage;
  const disabledPrimary = busy || !isSellValid;

  const onAmountChange = (next: string) => {
    if (!/^\d*\.?\d*$/.test(next)) {
      setBlockedInvalid(true);
      return;
    }
    setBlockedInvalid(false);
    if (next.trim() === "") {
      setAmount("");
      return;
    }
    const sanitized = sanitizeNumericInput(next, 6);
    if (sanitized === null) {
      setBlockedInvalid(true);
      return;
    }
    if (sanitized.trim() === "") {
      setAmount("");
      return;
    }
    const n = Number(sanitized);
    if (!Number.isFinite(n)) return;
    setAmount(sanitized);
  };

  if (success) {
    return (
      <ModalShell
        title={copyOf(lang, feedbackCopy.sell.success)}
        onClose={closeWithReset}
        widthClass="max-w-[420px]"
      >
        <p className="text-center text-base text-zinc-300">
          {lang === "cn" ? "平台余额已刷新" : "Platform USD1 balance updated"}
        </p>
        <div className="mt-4 rounded-[10px] border border-[#3a352f] bg-[#211e1a] px-5 py-4 text-[15px]">
          <div className="flex items-center justify-between gap-6">
            <span className="text-zinc-500">{lang === "cn" ? "交易手续费" : "Trading Fee"}</span>
            <span className="flex items-center gap-1.5 text-zinc-200">
              {TRADE_FEE_RATE} {SELL_TRADE_FEE_AMOUNT}
              <span className="grid size-4 place-items-center rounded-full bg-[#E8C77D] text-[10px] font-bold leading-none text-white">
                !
              </span>
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
          <Button
            className="real-outline-btn h-[52px] text-base"
            onClick={() => {
              closeWithReset();
              router.push(REALRWA_ROUTES.portfolioTrade);
            }}
          >
            {copyOf(lang, feedbackCopy.common.viewPortfolio)}
          </Button>
          <Button
            className="real-gold-btn h-[52px] text-base"
            onClick={() => {
              closeWithReset();
              router.push(REALRWA_ROUTES.home);
            }}
          >
            {copyOf(lang, feedbackCopy.common.guide)}
          </Button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title={copyOf(lang, feedbackCopy.sell.title)} onClose={closeWithReset}>
      <div className="mb-4 rounded-2xl bg-white/5 p-5">
        <div className="flex items-center gap-4">
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-[#FF4D0A] text-xl font-bold text-white">
            ◎
          </span>
          <div>
            <p className="text-2xl font-semibold">RWA1</p>
            <p className="text-base text-zinc-400">Maple</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-5 text-base text-zinc-400">
          <div>
            <p>{lang === "cn" ? "质押年化收益率" : "Stake APR"}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-100">12.51%</p>
          </div>
          <div>
            <p>{lang === "cn" ? "总交易量" : "Total Volume"}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-100">2.95M USD</p>
          </div>
        </div>
      </div>

      <p className="text-base text-zinc-300">
        <span className="mr-1 text-red-400">*</span>
        {copyOf(lang, feedbackCopy.sell.amount)}
      </p>
      <div className={`mt-2 rounded-2xl border px-5 py-4 ${validationMessage ? "border-red-500" : "border-[#FACC15]"}`}>
        <div className="flex items-center justify-between gap-4">
          <Input
            className={`h-12 border-0 bg-transparent px-0 text-base font-mono shadow-none focus-visible:ring-0 ${validationMessage ? "text-red-300" : ""
              }`}
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
          />
          <div className="flex shrink-0 items-center gap-2 text-base">
            <TokenBadge label="RWA1" tone="red" />
            <button
              type="button"
              className="text-[#FACC15]"
              onClick={() => setAmount(formatNumberForInput(SELL_AVAILABLE_RWA, 6))}
            >
              {copyOf(lang, feedbackCopy.sell.max)}
            </button>
          </div>
        </div>
      </div>
      {validationMessage ? <p className="mt-2 text-base text-red-400">{validationMessage}</p> : null}
      <p className="mt-2 text-base text-zinc-400">
        {lang === "cn" ? "可用：" : "Available: "} {SELL_AVAILABLE_RWA.toFixed(2)} RWA1
      </p>

      <div className="sticky bottom-0 mt-6 grid grid-cols-2 gap-4 border-t border-white/10 bg-[#1a1a1a] pt-4">
        <TradeFeeLine lang={lang} amount={SELL_TRADE_FEE_AMOUNT} className="col-span-2" />
        <Button className="real-outline-btn h-[52px] text-base" onClick={closeWithReset}>
          {copyOf(lang, feedbackCopy.common.cancel)}
        </Button>
        <Button
          className="real-gold-btn h-[52px] text-base disabled:opacity-40"
          disabled={disabledPrimary}
          onClick={async () => {
            const notice =
              assetSymbol === "rFUIDL"
                ? evaluateRwaTradeTiming(getRwaProductTradingConfig(), "SELL")
                : null;
            if (notice) {
              setTimingNotice(notice);
              setCutoffOpen(true);
              return;
            }
            setBusy(true);
            await wait(1000);
            setBusy(false);
            onSold?.(Number((amountNum * PRICE).toFixed(2)));
            setSuccess(true);
          }}
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : null}
          {primaryLabel}
        </Button>
      </div>

      <MellonSellCutoffConfirmModal
        open={cutoffOpen}
        onClose={() => setCutoffOpen(false)}
        onConfirm={async () => {
          setCutoffOpen(false);
          setBusy(true);
          await wait(1000);
          setBusy(false);
          onSold?.(Number((amountNum * PRICE).toFixed(2)));
          setSuccess(true);
        }}
        summary={{
          tokenSymbol: assetSymbol,
          tokenIssuer: assetIssuer,
          price: `1 ${quoteSymbol} ≈ ${PRICE.toFixed(4)} ${assetSymbol}`,
          amount: `${(amountNum || 0).toLocaleString(undefined, { maximumFractionDigits: 4 })} ${assetSymbol}`,
          value: `${sellValueUsd1.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${quoteSymbol}`,
        }}
        noticeMessage={timingNotice?.message}
        canContinue={timingNotice?.canContinue ?? true}
      />
    </ModalShell>
  );
}

export function RedeemConfirmModal() {
  return null;
}

export function SellConfirmModal() {
  return null;
}

type MellonCutoffSummary = {
  tokenSymbol: string;
  tokenIssuer: string;
  tokenIcon?: string;
  price: string;
  amount: string;
  value: string;
};

function MellonScrollIcon() {
  return (
    <span className="grid size-[88px] place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(244,201,85,0.18),transparent_70%)]">
      <svg viewBox="0 0 64 64" className="size-[64px]" fill="none">
        <ellipse cx="36" cy="34" rx="22" ry="18" fill="#E9C977" opacity="0.85" />
        <rect x="20" y="18" width="26" height="32" rx="3" fill="#F9E7B0" stroke="#C99A36" strokeWidth="1.5" />
        <path d="M26 26h14M26 32h14M26 38h10" stroke="#C99A36" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M40 42l4 4 8-9" stroke="#C99A36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="22" r="1.4" fill="#F4C955" />
        <circle cx="52" cy="20" r="1.2" fill="#F4C955" />
        <circle cx="56" cy="40" r="1.4" fill="#F4C955" />
        <circle cx="10" cy="44" r="1.2" fill="#F4C955" />
      </svg>
    </span>
  );
}

function MellonCutoffSummaryRows({
  mode,
  summary,
}: {
  mode: "buy" | "sell";
  summary: MellonCutoffSummary;
}) {
  const rows: { label: string; value: ReactNode }[] = [
    {
      label: mode === "buy" ? "Token" : "Sell Token",
      value: (
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-[#E83E8C] text-[12px] font-bold text-white">
            {summary.tokenSymbol.slice(0, 1)}
          </span>
          <div className="text-right">
            <p className="text-[14px] font-medium text-white">{summary.tokenSymbol}</p>
            <p className="text-[12px] text-white/55">{summary.tokenIssuer}</p>
          </div>
        </div>
      ),
    },
    { label: mode === "buy" ? "Price" : "Sell Price", value: <span className="text-[14px] font-medium text-white">{summary.price}</span> },
    { label: mode === "buy" ? "Amount" : "Sell Amount", value: <span className="text-[14px] font-medium text-white">{summary.amount}</span> },
    { label: mode === "buy" ? "Buy Value" : "Sell Value", value: <span className="text-[14px] font-medium text-white">{summary.value}</span> },
  ];

  return (
    <div className="mt-5">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`flex items-center justify-between py-4 ${index === 0 ? "" : "border-t border-white/10"}`}
        >
          <span className="text-[14px] text-white/55">{row.label}</span>
          {row.value}
        </div>
      ))}
    </div>
  );
}

function MellonCutoffShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const buySansStyle: CSSProperties = {
    fontFamily:
      '"SF Pro Text", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif',
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(0,0,0,0.72)] p-4">
      <div
        className="relative w-full max-w-[470px] rounded-[8px] border border-[#3a352f] bg-[#26231f] px-8 pb-5 pt-7 text-zinc-100 shadow-[0_20px_56px_rgba(0,0,0,0.45)]"
        style={buySansStyle}
      >
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="w-full text-center text-2xl">{title}</h3>
          <button
            type="button"
            aria-label="close"
            onClick={onClose}
            className="absolute right-6 top-6"
          >
            <X className="size-7 text-zinc-400 transition hover:text-zinc-200" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function MellonBuyCutoffConfirmModal({
  open,
  onClose,
  onConfirm,
  summary,
  noticeMessage,
  canContinue = true,
}: BaseProps & {
  onConfirm?: () => void;
  summary?: Partial<MellonCutoffSummary>;
  noticeMessage?: string;
  canContinue?: boolean;
}) {
  if (!open) return null;
  const data: MellonCutoffSummary = {
    tokenSymbol: summary?.tokenSymbol ?? "aUSD",
    tokenIssuer: summary?.tokenIssuer ?? "Bonk Company",
    price: summary?.price ?? "1USDC≈1.0008aUSD",
    amount: summary?.amount ?? "10,000,000.01 BUSD",
    value: summary?.value ?? "10,000,000.01 USDC",
  };

  return (
    <MellonCutoffShell title="购买提示" onClose={onClose}>
      <div className="flex justify-center">
        <MellonScrollIcon />
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/15 text-[12px] font-bold text-white">!</span>
        <p className="text-[13px] leading-[1.7] text-white/80">
          {noticeMessage ??
            "当前已过当日结算截点。您的申购订单将于下个工作日（T+1）完成结算并起息，预计 rFUIDL 凭证将于明日发放至您的账户。"}
        </p>
      </div>

      <MellonCutoffSummaryRows mode="buy" summary={data} />

      <div className={`sticky bottom-0 mt-5 grid gap-4 border-t border-white/10 bg-[#26231f] pt-4 ${canContinue ? "grid-cols-2" : "grid-cols-1"}`}>
        <Button
          className="h-[48px] rounded-[10px] border border-[#8a6a23] bg-transparent text-[18px] font-semibold text-[#dfb64d] hover:bg-[#2b2722]"
          onClick={onClose}
        >
          {canContinue ? "Cancel" : "我知道了"}
        </Button>
        {canContinue ? (
          <Button
            className="h-[48px] rounded-[10px] bg-[#ebc85f] text-[18px] font-semibold text-[#1e1b16] hover:bg-[#ddb955]"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            确认继续买入
          </Button>
        ) : null}
      </div>
    </MellonCutoffShell>
  );
}

export function MellonSellCutoffConfirmModal({
  open,
  onClose,
  onConfirm,
  summary,
  noticeMessage,
  canContinue = true,
}: BaseProps & {
  onConfirm?: () => void;
  summary?: Partial<MellonCutoffSummary>;
  noticeMessage?: string;
  canContinue?: boolean;
}) {
  if (!open) return null;
  const data: MellonCutoffSummary = {
    tokenSymbol: summary?.tokenSymbol ?? "aUSD",
    tokenIssuer: summary?.tokenIssuer ?? "Bonk Company",
    price: summary?.price ?? "1USDC≈1.0008aUSD",
    amount: summary?.amount ?? "10,000,000.01 BUSD",
    value: summary?.value ?? "10,000,000.01 USDC",
  };

  return (
    <MellonCutoffShell title="卖出提示" onClose={onClose}>
      <div className="flex justify-center">
        <MellonScrollIcon />
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/15 text-[12px] font-bold text-white">!</span>
        <p className="text-[13px] leading-[1.7] text-white/80">
          {noticeMessage ??
            "当前已过当日赎回截点。您的申请已受理，稳定币预计将于下个工作日（T+1）到账。请注意：本笔资产从今日起将停止计算利息。"}
        </p>
      </div>

      <MellonCutoffSummaryRows mode="sell" summary={data} />

      <div className={`sticky bottom-0 mt-5 grid gap-4 border-t border-white/10 bg-[#26231f] pt-4 ${canContinue ? "grid-cols-2" : "grid-cols-1"}`}>
        <Button
          className="h-[48px] rounded-[10px] border border-[#8a6a23] bg-transparent text-[18px] font-semibold text-[#dfb64d] hover:bg-[#2b2722]"
          onClick={onClose}
        >
          {canContinue ? "Cancel" : "我知道了"}
        </Button>
        {canContinue ? (
          <Button
            className="h-[48px] rounded-[10px] bg-[#ebc85f] text-[18px] font-semibold text-[#1e1b16] hover:bg-[#ddb955]"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            确认继续卖出
          </Button>
        ) : null}
      </div>
    </MellonCutoffShell>
  );
}

export function isPastMellonBuyCutoff(now: Date = new Date()): boolean {
  // 梅陇 (Mellon) cutoff is 11:00 UTC+1 — equivalent to 10:00 UTC
  const utcHour = now.getUTCHours();
  const utcMin = now.getUTCMinutes();
  return utcHour > 10 || (utcHour === 10 && utcMin > 0);
}

export function isPastMellonSellCutoff(now: Date = new Date()): boolean {
  // 梅陇 (Mellon) cutoff is 12:00 UTC+1 — equivalent to 11:00 UTC
  const utcHour = now.getUTCHours();
  const utcMin = now.getUTCMinutes();
  return utcHour > 11 || (utcHour === 11 && utcMin > 0);
}
