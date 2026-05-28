"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Info,
  MoreHorizontal,
  QrCode,
  Search,
  Send,
  Twitter,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BuyModal } from "@/projects/realrwa-demo/components/realrwa/modals";
import { publicAsset } from "@/lib/public-asset";
import {
  OPEN_CONNECT_EVENT,
  OPEN_IDENTITY_VERIFICATION_EVENT,
  RealRwaShell,
} from "@/projects/realrwa-demo/components/realrwa/shell";
import { PortfolioSidebar } from "@/projects/realrwa-demo/components/realrwa/portfolio-sidebar";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import { Input } from "@/components/ui/input";
import { REALRWA_ROUTES } from "@/projects/realrwa-demo/lib/realrwa-routes";

type MarketCard = {
  id: string;
  symbol: string;
  subtitle: LocaleText;
  badgeRows: LocaleText[];
  yieldLabel: LocaleText;
  apr: string;
  yieldBreakdown: { label: LocaleText; value: string }[];
  price: string;
  summary: LocaleText;
  description: LocaleText;
  metaRows: { label: LocaleText; value: LocaleText }[];
  minAmount: LocaleText;
  actionLabel: LocaleText;
  iconUrl: string;
  accent: "orange" | "pink" | "emerald" | "silver";
  soldOut?: boolean;
};

type MarketLocale = "cn" | "en";
type LocaleText = Record<MarketLocale, string>;
type TableStatus = "Completed" | "Failed" | "Pending" | "Settling";
type DetailTabKey = "detail" | "buy" | "sell" | "stake" | "redeem" | "claim" | "holders";
type DetailActionKey = Exclude<DetailTabKey, "detail" | "holders">;
type InvitationDetailTab = "invitees" | "orders";
type InvitationTableTab = "invitees" | "assetRewards" | "headcountRewards";

const footerColumns: { title: LocaleText; items: LocaleText[] }[] = [
  {
    title: { cn: "产品", en: "Product" },
    items: [
      { cn: "交易", en: "Trade" },
      { cn: "质押", en: "Staking" },
    ],
  },
  {
    title: { cn: "资源", en: "Resources" },
    items: [
      { cn: "白皮书", en: "Whitepaper" },
      { cn: "FAQ", en: "FAQ" },
    ],
  },
  {
    title: { cn: "联系", en: "Contact" },
    items: [
      { cn: "联系我们", en: "Contact Us" },
      { cn: "支持邮箱", en: "Support Email" },
    ],
  },
  {
    title: { cn: "法律", en: "Legal" },
    items: [
      { cn: "服务条款", en: "Terms of Service" },
      { cn: "隐私政策", en: "Privacy Policy" },
      { cn: "风险披露", en: "Risk Disclosure" },
      { cn: "合规", en: "Compliance" },
      { cn: "Cookie 政策", en: "Cookie Policy" },
    ],
  },
  {
    title: { cn: "推荐", en: "Referrals" },
    items: [
      { cn: "推荐人", en: "Referrer" },
      { cn: "被邀请者", en: "Invitee" },
    ],
  },
];

function localize(text: LocaleText, locale: MarketLocale) {
  return text[locale];
}

const rfuidlSummary: LocaleText = {
  cn: "rFUIDL 底层关联优质货币市场基金资产，支持链上持有、转让与流动性管理。具体申购、赎回与派息规则请查看详情。",
  en: "rFUIDL provides exposure to high-quality money market fund assets and supports on-chain holding, transfer, and liquidity management. Please review details for subscription, redemption, and distribution rules.",
};

const marketCards: MarketCard[] = [
  {
    id: "rfuidl",
    symbol: "rFUIDL",
    subtitle: {
      cn: "BNY 货币基金",
      en: "BNY Money Market Fund",
    },
    badgeRows: [{ cn: "交易所认可抵押品", en: "Exchange-Approved Collateral" }],
    yieldLabel: { cn: "预计收益率", en: "Estimated Yield" },
    apr: "3.90",
    yieldBreakdown: [
      { label: { cn: "按月分红", en: "Monthly Distributions" }, value: "3.8%" },
      { label: { cn: "iReal", en: "iReal" }, value: "+0.1%" },
    ],
    price: "1.00",
    summary: rfuidlSummary,
    description: {
      cn: "FUIDL 是原生铸造在以太坊上的美元即时数字流动性代币，底层资产为 BNY Mellon 美元货币市场基金，代币由底层资产 1:1 支持。",
      en: 'Token Symbol: FUIDL (Token Name: "Finloop USD Instant Digital Liquidity Token"), natively minted on Ethereum. The underlying asset is BNY Mellon USD Money Market Fund, and the token is backed 1:1 by the underlying asset.',
    },
    metaRows: [
      { label: { cn: "发行方：", en: "Provider:" }, value: { cn: "Fosun Wealth Holdings", en: "Fosun Wealth Holdings" } },
      { label: { cn: "最低申购：", en: "Minimum Order:" }, value: { cn: "最小 1 rFUIDL，整币交易", en: "Min 1rFUIDL, whole tokens" } },
    ],
    minAmount: { cn: "最小 1 rFUIDL", en: "Min 1rFUIDL" },
    actionLabel: { cn: "购买", en: "Buy" },
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rFUIDL.png",
    accent: "emerald",
  },
  {
    id: "rsdct",
    symbol: "rSDCT",
    subtitle: { cn: "Standard Bond-做市流动性", en: "Standard Bond-Provider Liquidity" },
    badgeRows: [
      { cn: "质押后每日分配", en: "Daily Distributions After Staking" },
      { cn: "DeFi 与交易所抵押品", en: "DeFi & Exchange Collateral" },
    ],
    yieldLabel: { cn: "产品综合收益", en: "Total Product Yield" },
    apr: "7.90",
    yieldBreakdown: [
      { label: { cn: "票息利率", en: "Coupon Rate" }, value: "6%" },
      { label: { cn: "iReal", en: "iReal" }, value: "+1.9%" },
    ],
    price: "1.00",
    summary: {
      cn: "底层资产为标准企业债，到期一次性还本付息，并通过 Trust SPV 结构隔离风险。完整产品说明请查看详情。",
      en: "This product is backed by a standard corporate bond with bullet repayment at maturity and Trust SPV risk isolation. Please review details for the full product explanation.",
    },
    description: {
      cn: "底层资产为标准企业债，到期一次性还本付息，并通过 Trust SPV 结构隔离底层资产风险。",
      en: "Underlying Asset: Standard Bond. Coupon Frequency: bullet payment with principal and interest repaid in full at maturity. Trust SPV structure is used to ring-fence the underlying assets and isolate risk.",
    },
    metaRows: [
      { label: { cn: "发行方：", en: "Provider:" }, value: { cn: "Standard Bond", en: "Standard Bond" } },
      { label: { cn: "最低申购：", en: "Minimum Order:" }, value: { cn: "最小 1 rSDCT，整币交易", en: "Min 1rSDCT, whole tokens" } },
    ],
    minAmount: { cn: "最小 1 rSDCT", en: "Min 1rSDCT" },
    actionLabel: { cn: "购买", en: "Buy" },
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rSDCT.png",
    accent: "orange",
  },
  {
    id: "rxwct",
    symbol: "rXWCT",
    subtitle: { cn: "Standard Bond-做市流动性", en: "Standard Bond-Provider Liquidity" },
    badgeRows: [
      { cn: "质押后每日分配", en: "Daily Distributions After Staking" },
      { cn: "DeFi 与交易所抵押品", en: "DeFi & Exchange Collateral" },
    ],
    yieldLabel: { cn: "产品综合收益", en: "Total Product Yield" },
    apr: "8.00",
    yieldBreakdown: [
      { label: { cn: "票息利率", en: "Coupon Rate" }, value: "6%" },
      { label: { cn: "iReal", en: "iReal" }, value: "+2%" },
    ],
    price: "1.00",
    summary: {
      cn: "底层资产为标准企业债，到期一次性还本付息，并通过 Trust SPV 结构隔离风险。完整产品说明请查看详情。",
      en: "This product is backed by a standard corporate bond with bullet repayment at maturity and Trust SPV risk isolation. Please review details for the full product explanation.",
    },
    description: {
      cn: "底层资产为标准企业债，到期一次性还本付息，并通过 Trust SPV 结构隔离底层资产风险。",
      en: "Underlying Asset: Standard Bond. Coupon Frequency: bullet payment with principal and interest repaid in full at maturity. Trust SPV structure is used to ring-fence the underlying assets and isolate risk.",
    },
    metaRows: [
      { label: { cn: "发行方：", en: "Provider:" }, value: { cn: "Standard Bond", en: "Standard Bond" } },
      { label: { cn: "最低申购：", en: "Minimum Order:" }, value: { cn: "最小 1 rXWCT，整币交易", en: "Min 1rXWCT, whole tokens" } },
    ],
    minAmount: { cn: "最小 1 rXWCT", en: "Min 1rXWCT" },
    actionLabel: { cn: "购买", en: "Buy" },
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rXWCT.png",
    accent: "pink",
  },
];

const detailInfo = {
  symbol: "rFUIDL",
  stakingSymbol: "srFUIDL",
  asset: { cn: "梅隆银行货币基金", en: "BNY Money Market Fund" },
  iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rFUIDL.png",
  price: "1.00",
  stakingPrice: "1.0000",
  approx: "1.0000 USDC",
  apr: "3.90",
  couponRate: "3.8%",
  irealBonus: "+0.1%",
  stakingApr: "3.90",
  volume: "0.00",
  balance: "100,000.01",
  balanceUnit: "rFUIDL",
  irealBalance: "100,000.0",
  staked: "100,000.01",
  rewards: "100,000.01",
  rewardsUnit: "USDC",
  claimable: "100,000.0",
  claimableUnit: "USDC",
} as const;

const holderRows = [
  ["HkAo3sqe...93ujhMq1", "10,785.19", "7.09%", "$23,785.19", "1s"],
  ["HkAo3sqe...93ujhMq1", "87,905.15", "7.09%", "$23,785.19", "3m"],
  ["HkAo3sqe...93ujhMq1", "22,056.07", "7.09%", "$23,785.19", "4h"],
  ["HkAo3sqe...93ujhMq1", "73,017.77", "7.09%", "$23,785.19", "1d"],
  ["HkAo3sqe...93ujhMq1", "3,357.13", "7.09%", "$23,785.19", "30d"],
] as const;

const balanceRows = [
  ["USDC", "39.147", "39.147", "39.147", "39.147", "1.2%"],
  ["BUILD", "39.147", "39.147", "39.147", "39.147", "1.2%"],
  ["syrupUSDT", "39.147", "39.147", "39.147", "39.147", "1.2%"],
  ["AUSD", "39.147", "39.147", "39.147", "39.147", "1.2%"],
  ["AUSD", "39.147", "39.147", "39.147", "39.147", "1.2%"],
  ["AUSD", "39.147", "39.147", "39.147", "39.147", "1.2%"],
  ["AUSD", "39.147", "39.147", "39.147", "39.147", "1.2%"],
  ["AUSD", "39.147", "39.147", "39.147", "39.147", "1.2%"],
] as const;

const tradeOrderRows = Array.from({ length: 10 }, (_, index) => ({
  time: "2025-11-10 16:02:03",
  coin: "rFUIDL/USDC",
  type: index === 1 ? "Sell" : "Buy",
  price: "39.147",
  size: "39.147",
  amount: "39.147",
  hash: "0xd850...8438",
  status: index === 0 ? "Settling" : index === 1 ? "Failed" : index === 2 ? "Pending" : "Completed",
})) as {
  time: string;
  coin: string;
  type: string;
  price: string;
  size: string;
  amount: string;
  hash: string;
  status: TableStatus;
}[];

const stakeOrderData = {
  stake: Array.from({ length: 10 }, (_, index) => ({
    time: "2025-11-10 16:02:03",
    name: "RWA",
    amount: "39.147",
    redeemable: "39.147",
    bondYield: "39.147",
    realYield: "39.147",
    hash: "0xd850...8438",
    status: index === 1 ? "Failed" : index === 2 ? "Pending" : "Completed",
  })),
  redeem: Array.from({ length: 10 }, (_, index) => ({
    time: "2025-11-10 16:02:03",
    name: "RWA",
    redeemed: "39.147",
    bondYield: "39.147",
    realYield: "39.147",
    hash: "0xd850...8438",
    status: index === 1 ? "Failed" : index === 2 ? "Pending" : "Completed",
  })),
  reward: Array.from({ length: 10 }, (_, index) => ({
    issuedAt: "2025-11-10 16:02:03",
    currency: index === 1 ? "REAL" : "USDT",
    amount: "39.147",
    hash: "0xd850...8438",
    status: index === 1 ? "Failed" : index === 2 ? "Pending" : "Completed",
  })),
} satisfies Record<string, unknown[]>;

const lendingOrderData = {
  borrow: Array.from({ length: 10 }, (_, index) => ({
    time: "2025-11-10 16:02:03",
    asset: "RWA/USDC",
    amount: "39.147",
    apr: "39.147",
    interest: "39.147",
    status: index === 1 ? "Failed" : index === 2 ? "Pending" : "Completed",
  })),
  repay: Array.from({ length: 10 }, (_, index) => ({
    time: "2025-11-10 16:02:03",
    asset: "RWA/USDC",
    amount: "39.147",
    apr: "39.147",
    interest: "39.147",
    status: index === 1 ? "Failed" : index === 2 ? "Pending" : "Completed",
  })),
} satisfies Record<string, unknown[]>;

const reserveOrderData = {
  supply: Array.from({ length: 10 }, () => ({
    time: "2025-11-10 16:02:03",
    asset: "RWA/USDC",
    amount: "39.147",
  })),
  withdraw: Array.from({ length: 10 }, () => ({
    time: "2025-11-10 16:02:03",
    asset: "RWA/USDC",
    amount: "39.147",
    apr: "39.147",
    claimableInterest: "39.147",
  })),
  claim: Array.from({ length: 10 }, () => ({
    time: "2025-11-10 16:02:03",
    asset: "RWA/USDC",
    amount: "39.147",
    apr: "39.147",
    claimableInterest: "39.147",
  })),
} as const;

const invitationSummary: {
  level: string;
  totalCommissionUsdc: string;
  headcountCommissionUsdc?: string;
  rateCommissionUsdc: string;
  pointsCommissionReal: string;
  qualifiedInvitees: string;
} = {
  level: "L0",
  totalCommissionUsdc: "100.00",
  rateCommissionUsdc: "100.00",
  pointsCommissionReal: "2,500.00",
  qualifiedInvitees: "2",
};

const invitationInviteeRows: {
  address: string;
  source: string;
  registeredAt: string;
  volume: string;
}[] = [
  {
    address: "0x2a59fd...e07fe3",
    source: "others",
    registeredAt: "2026-03-12 14:26:25",
    volume: "$ 7,500.00",
  },
  {
    address: "0xe9b3ba...02a4cc",
    source: "others",
    registeredAt: "2026-03-12 15:14:22",
    volume: "$ 5,000.00",
  },
];

const invitationRewardRows: {
  id: string;
  issuedAt: string;
  level: string;
  qualifiedInvitees: string;
  rateCommissionUsdc: string;
  pointsCommissionReal: string;
}[] = [
  {
    id: "reward-20260312",
    issuedAt: "2026-03-12 16:00:00",
    level: "L0",
    qualifiedInvitees: "2",
    rateCommissionUsdc: "100.00 USDC",
    pointsCommissionReal: "2,500.00 iReal",
  },
];

const invitationHeadcountRewardRows: {
  id: string;
  issuedAt: string;
  level: string;
  qualifiedInvitees: string;
  headcountCommissionUsdc: string;
  status: string;
}[] = [];

const invitationDetailStats = [
  { label: "邀请等级:", value: invitationSummary.level },
  { label: "返佣总金额:", value: `${invitationSummary.totalCommissionUsdc} USDC` },
  { label: "利率佣金总额:", value: `${invitationSummary.rateCommissionUsdc} USDC` },
  { label: "积分佣金总额:", value: `${invitationSummary.pointsCommissionReal} iReal` },
  { label: "人头佣金总额:", value: `${invitationSummary.headcountCommissionUsdc ?? "--"} USDC` },
  { label: "合格邀请人数:", value: invitationSummary.qualifiedInvitees },
] as const;

const invitationDetailOrderRows = [
  {
    time: "2026-03-12 15:17:57",
    pair: "RWA1/USD1",
    type: "买入",
    price: "15.00",
    volume: "7,500.00",
    amount: "500.00",
  },
  {
    time: "2026-03-12 15:15:58",
    pair: "RWA/USD1",
    type: "买入",
    price: "10.00",
    volume: "5,000.00",
    amount: "500.00",
  },
] as const;

function triggerAuthGate(walletConnected: boolean, identityBound: boolean) {
  if (!walletConnected) {
    window.dispatchEvent(new Event(OPEN_CONNECT_EVENT));
    return false;
  }
  if (!identityBound) {
    window.dispatchEvent(new Event(OPEN_IDENTITY_VERIFICATION_EVENT));
    return false;
  }
  return true;
}

function InvitationEmptyState() {
  return (
    <div className="grid min-h-[310px] place-items-center border-t border-white/8">
      <div className="text-center">
        <div className="mx-auto grid h-[112px] w-[132px] place-items-end opacity-45">
          <div className="relative h-[78px] w-[86px] rounded-b-[18px] bg-[#6C6C6C]">
            <div className="absolute -top-6 left-1/2 h-[72px] w-[62px] -translate-x-1/2 rounded-[6px] bg-[#7C7C7C] px-3 py-3">
              <div className="h-8 rounded-sm bg-[#6A6A6A]" />
              <div className="mt-3 h-2 rounded-full bg-[#6A6A6A]" />
              <div className="mt-2 h-2 rounded-full bg-[#6A6A6A]" />
            </div>
          </div>
        </div>
        <p className="mt-3 text-[18px] font-medium leading-7 text-white/38">暂无数据</p>
      </div>
    </div>
  );
}

function InvitationCommissionDetailModal({
  activeTab,
  onTabChange,
  onClose,
}: {
  activeTab: InvitationDetailTab | null;
  onTabChange: (tab: InvitationDetailTab) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (activeTab === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeTab]);

  if (activeTab === null) {
    return null;
  }

  const showingInvitees = activeTab === "invitees";

  return createPortal(
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-black/82 p-5 text-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invitation-detail-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex h-[min(620px,calc(100vh-40px))] w-[min(960px,calc(100vw-40px))] overflow-hidden rounded-[14px] bg-[#1D1D1B] shadow-[0_24px_76px_rgba(0,0,0,0.45)]">
        <button
          type="button"
          aria-label="关闭返佣明细"
          className="absolute right-4 top-4 z-[2] grid size-9 place-items-center text-white/55 transition hover:text-white"
          onClick={onClose}
        >
          <X className="size-6 stroke-[1.7]" />
        </button>

        <div className="flex min-h-0 w-full flex-col px-6 pb-5 pt-11">
          <h2 id="invitation-detail-title" className="text-center text-[21px] font-semibold leading-7 text-white/88">
            返佣明细
          </h2>

          <section className="mt-3 rounded-[10px] bg-[#292927] px-4 py-4">
            <div className="grid grid-cols-1 gap-y-1.5 md:grid-cols-2 md:gap-x-8 md:gap-y-2">
              {invitationDetailStats.map((item) => (
                <div key={item.label} className="grid grid-cols-[132px_minmax(0,1fr)] items-center md:grid-cols-[158px_minmax(0,1fr)]">
                  <span className="text-[14px] font-semibold leading-6 text-white/58 md:text-[15px]">{item.label}</span>
                  <span className="text-[14px] font-semibold leading-6 text-white/58 md:text-[15px]">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 flex h-10 items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              {[
                ["invitees", "被邀请人"],
                ["orders", "订单"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`h-10 rounded-full px-5 text-[16px] font-semibold leading-10 outline-none transition focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
                    activeTab === key ? "bg-[#30302D] text-white" : "text-white/42 hover:text-white/68"
                  }`}
                  onClick={() => onTabChange(key as InvitationDetailTab)}
                >
                  {label}
                </button>
              ))}
            </div>

            {showingInvitees ? (
              <div className="hidden min-w-0 flex-1 justify-end gap-3 md:flex">
                <div className="relative h-10 w-[286px] max-w-[31vw]">
                  <input
                    type="text"
                    placeholder="请输入受邀人地址"
                    className="h-full w-full rounded-[8px] border border-white/10 bg-[#1B1B1A] px-3.5 pr-10 text-[14px] font-semibold text-white/78 outline-none placeholder:text-white/24"
                  />
                  <Search className="absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-white/45" />
                </div>
                <button
                  type="button"
                  className="flex h-10 w-[286px] max-w-[31vw] items-center justify-between rounded-[8px] border border-white/10 bg-[#1B1B1A] px-3.5 text-[14px] font-semibold text-white/28"
                >
                  <span>注册开始日期　→　注册结束日期</span>
                  <CalendarDays className="size-[18px] text-white/35" />
                </button>
              </div>
            ) : null}
          </section>

          <section className="relative mt-5 min-h-0 flex-1 overflow-hidden rounded-[10px] bg-[#1A1A18]">
            {showingInvitees ? (
              <>
                <div className="grid h-[50px] grid-cols-[1fr_0.75fr_1fr_0.85fr] items-center gap-x-4 bg-[#2A2A27] pl-5 pr-10 text-[14px] font-semibold leading-6 text-white/58 md:gap-x-5 md:text-[16px] [&>span]:min-w-0 [&>span]:truncate [&>span]:whitespace-nowrap">
                  <span>被邀请人地址</span>
                  <span>数据来源</span>
                  <span>注册时间</span>
                  <span>有效成交额</span>
                </div>
                {invitationInviteeRows.map((row) => (
                  <div
                    key={row.address}
                    className="grid h-[56px] grid-cols-[1fr_0.75fr_1fr_0.85fr] items-center gap-x-4 border-t border-white/8 pl-5 pr-10 text-[14px] font-semibold leading-6 text-white/88 md:gap-x-5 md:text-[16px] [&>span]:min-w-0 [&>span]:truncate [&>span]:whitespace-nowrap"
                  >
                    <span>{row.address}</span>
                    <span>{row.source}</span>
                    <span>{row.registeredAt}</span>
                    <span>{row.volume}</span>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="grid h-[50px] grid-cols-[1.18fr_0.78fr_0.55fr_0.55fr_0.7fr_0.58fr] items-center gap-x-4 bg-[#2A2A27] pl-5 pr-10 text-[13px] font-semibold leading-6 text-white/58 md:gap-x-5 md:text-[16px] [&>span]:min-w-0 [&>span]:truncate [&>span]:whitespace-nowrap">
                  <span>时间</span>
                  <span>币种</span>
                  <span>类型</span>
                  <span>价格</span>
                  <span>成交量</span>
                  <span>数量</span>
                </div>
                {invitationDetailOrderRows.map((row) => (
                  <div
                    key={`${row.time}-${row.pair}`}
                    className="grid h-[56px] grid-cols-[1.18fr_0.78fr_0.55fr_0.55fr_0.7fr_0.58fr] items-center gap-x-4 border-t border-white/8 pl-5 pr-10 text-[13px] font-semibold leading-6 text-white/88 md:gap-x-5 md:text-[16px] [&>span]:min-w-0 [&>span]:truncate [&>span]:whitespace-nowrap"
                  >
                    <span>{row.time}</span>
                    <span>{row.pair}</span>
                    <span className="text-[#10C890]">{row.type}</span>
                    <span>{row.price}</span>
                    <span>{row.volume}</span>
                    <span>{row.amount}</span>
                  </div>
                ))}
              </>
            )}

            <div className="pointer-events-none absolute bottom-0 right-0 top-[50px] w-[18px] bg-[#484846]">
              <div className="mx-auto mt-2.5 h-0 w-0 border-x-[6px] border-b-[7px] border-x-transparent border-b-[#9B9B98]" />
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RealRwaFooter() {
  const { lang } = useRwaAppState();
  const locale: MarketLocale = lang === "en" ? "en" : "cn";

  return (
    <footer className="relative overflow-hidden border-t border-white/6 bg-[#111111]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(28deg,transparent_43%,rgba(255,255,255,0.06)_44%,transparent_45%),linear-gradient(152deg,transparent_43%,rgba(255,255,255,0.04)_44%,transparent_45%)] [background-size:220px_120px]" />
      <div className="pointer-events-none absolute left-[8%] bottom-12 flex items-center gap-4 opacity-[0.08]">
        <Image
          src={publicAsset("/realrwa/figma/real-logo-gold-cropped.png")}
          alt=""
          width={100}
          height={70}
          className="h-[70px] w-[100px] object-contain grayscale"
        />
        <span className="text-[64px] font-semibold leading-none tracking-[-0.05em] text-white">REAL</span>
      </div>

      <div className="relative mx-auto grid max-w-[1040px] grid-cols-[190px_repeat(5,minmax(0,1fr))] gap-12 px-0 py-[120px]">
        <div>
          <button
            type="button"
            className="inline-flex h-12 items-center gap-3 rounded-[10px] border border-white/10 bg-[#1F1F1F] px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.24)]"
          >
            <Image
              src={publicAsset("/realrwa/figma/real-logo-gold-cropped.png")}
              alt=""
              width={22}
              height={16}
              className="h-4 w-[22px] object-contain"
            />
            {locale === "cn" ? "启动应用" : "Launch App"}
          </button>
        </div>

        {footerColumns.map((column) => (
          <div key={localize(column.title, locale)}>
            <p className="text-[14px] font-medium leading-5 text-white/40">{localize(column.title, locale)}</p>
            <ul className="mt-8 space-y-5 text-[14px] font-medium leading-5 text-white">
              {column.items.map((item) => (
                <li key={localize(item, locale)}>{localize(item, locale)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

function RealRwaPagination() {
  return (
    <div className="mt-8 flex items-center justify-end gap-3 text-zinc-500">
      <button type="button" className="grid size-10 place-items-center text-zinc-500">
        <ChevronLeft className="size-5" />
      </button>
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          type="button"
          className={`grid size-11 place-items-center rounded-[8px] text-[22px] ${
            page === 1 ? "bg-[#D2B757] text-[#18130B]" : "bg-[#202020] text-zinc-500"
          }`}
        >
          {page}
        </button>
      ))}
      <button type="button" className="grid size-10 place-items-center text-zinc-500">
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

function BackHeader({ title }: { title: string }) {
  return (
    <button type="button" className="mb-10 flex items-center gap-4 text-left text-[28px] font-semibold text-white">
      <ArrowLeft className="size-8 text-zinc-500" />
      {title}
    </button>
  );
}

function StatusText({ status }: { status: TableStatus }) {
  if (status === "Failed") {
    return <span className="text-[#EF5A5A]">Failed</span>;
  }
  if (status === "Pending") {
    return <span className="text-[#D1AD44]">Pending</span>;
  }
  if (status === "Settling") {
    return <span className="text-[#D1AD44]">结算中</span>;
  }
  return <span className="text-[#18D3B3]">Completed</span>;
}

function TokenCircle({
  accent,
  symbol,
  iconUrl,
}: {
  accent: MarketCard["accent"];
  symbol: string;
  iconUrl: string;
}) {
  const tone =
    accent === "orange"
      ? "bg-[#F69B20]"
      : accent === "pink"
        ? "bg-[#EC4899]"
        : accent === "emerald"
          ? "bg-[#F5F5F5]"
          : "bg-[#F1F1F1]";
  const text =
    accent === "emerald" || accent === "silver" ? "text-[#262626]" : "text-white";

  return (
    <div className={`grid size-[64px] shrink-0 place-items-center overflow-hidden rounded-full ${tone} text-[28px] font-bold ${text}`}>
      {/* Remote token assets live in the public token-assets CDN used by the production site. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl}
        alt={`${symbol} logo`}
        className="size-full object-cover"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <span className="hidden">{symbol.slice(0, 1)}</span>
    </div>
  );
}

function MarketCardView({
  card,
  locale,
  onDetail,
  onBuy,
}: {
  card: MarketCard;
  locale: MarketLocale;
  onDetail: () => void;
  onBuy: () => void;
}) {
  const soldOutLabel = locale === "cn" ? "售罄" : "sold out";

  return (
    <article className="relative overflow-hidden rounded-[14px] border border-white/8 bg-[#1F1F1F] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="pointer-events-none absolute right-[-8%] top-0 h-[210px] w-[210px] rounded-full bg-white/[0.03]" />
      {card.soldOut ? (
        <div className="pointer-events-none absolute right-5 top-5 rotate-[-18deg] rounded-[8px] border border-white/18 px-4 py-1.5 text-[30px] font-semibold text-white/26">
          {soldOutLabel}
        </div>
      ) : null}

      <div className="relative z-[1] flex items-start gap-3">
        <TokenCircle accent={card.accent} iconUrl={card.iconUrl} symbol={card.symbol} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[24px] font-normal leading-9 tracking-[-0.03em] text-white">{card.symbol}</h3>
          <p className="mt-0.5 truncate text-[14px] leading-5 text-zinc-500">{localize(card.subtitle, locale)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {card.badgeRows.map((badge) => (
              <span key={localize(badge, locale)} className="rounded-[6px] border border-white/12 bg-white/[0.03] px-2.5 py-1 text-[13px] leading-5 text-zinc-300">
                {localize(badge, locale)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-[1] mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[14px] leading-5 text-zinc-400">{locale === "cn" ? "价格" : "Price"}</p>
          <p className="mt-2 text-white">
            <span className="rounded-[5px] bg-[#35312A] px-2 py-0.5 font-mono text-[32px] font-semibold leading-none">
              $ {card.price}
            </span>
          </p>
        </div>
        <div>
          <p className="text-[14px] leading-5 text-zinc-400">{localize(card.yieldLabel, locale)}</p>
          <p className="mt-2 flex items-end gap-2 text-white">
            <span className="rounded-[5px] bg-[#35312A] px-2 py-0.5 font-mono text-[32px] font-semibold leading-none">
              {card.apr}
            </span>
            <span className="pb-1 text-[18px] text-zinc-400">%</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] leading-[18px] text-zinc-400">
            {card.yieldBreakdown.map((item) => (
              <span key={`${card.id}-${localize(item.label, locale)}`}>
                {localize(item.label, locale)} <span className="text-zinc-200">{item.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="relative z-[1] mt-5 line-clamp-2 text-[14px] leading-6 text-zinc-400">{localize(card.summary, locale)}</p>

      <div className="relative z-[1] mt-4 grid grid-cols-2 gap-x-5 gap-y-2 text-[12px] leading-[18px] text-zinc-400">
        {card.metaRows.map((item) => (
          <div key={`${card.id}-${localize(item.label, locale)}`}>
            <span>{localize(item.label, locale)} </span>
            <span className="text-zinc-300">{localize(item.value, locale)}</span>
          </div>
        ))}
      </div>

      <div className="relative z-[1] mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="h-12 rounded-[10px] border border-white/20 bg-transparent text-[16px] font-medium text-white transition hover:bg-white/[0.03]"
          onClick={onDetail}
        >
          {locale === "cn" ? "详情" : "Details"}
        </button>
        <button
          type="button"
          className={`h-12 rounded-[10px] text-[16px] font-medium transition ${
            card.soldOut
              ? "cursor-not-allowed bg-[#585858] text-zinc-300"
              : "bg-[#F4C955] text-[#18130B] hover:brightness-105"
          }`}
          onClick={onBuy}
          disabled={card.soldOut}
        >
          {card.soldOut ? localize({ cn: "购买", en: "Buy" }, locale) : localize(card.actionLabel, locale)}
        </button>
      </div>
    </article>
  );
}

function DetailTokenLogo() {
  return (
    <div className="grid size-[48px] place-items-center overflow-hidden rounded-full bg-[#111] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      {/* Remote token asset matches the production REAL website token library. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={detailInfo.iconUrl} alt={`${detailInfo.symbol} logo`} className="size-full object-cover" loading="lazy" />
    </div>
  );
}

function DetailMetricWatermark() {
  return (
    <div className="pointer-events-none absolute right-0 top-1/2 grid size-[44px] -translate-y-1/2 place-items-center text-white/[0.035]">
      <div className="absolute size-[32px] rounded-full border-[3px] border-current" />
      <div className="absolute h-[42px] w-[3px] rounded-full bg-current" />
      <div className="absolute h-[3px] w-[42px] rounded-full bg-current" />
      <div className="absolute size-[14px] rotate-45 border-b-[3px] border-r-[3px] border-current" />
    </div>
  );
}

function DetailAssetIdentity({
  locale,
  symbol = detailInfo.symbol,
}: {
  locale: MarketLocale;
  symbol?: string;
}) {
  return (
    <div className="flex w-[260px] shrink-0 items-center gap-3">
      <DetailTokenLogo />
      <div className="flex flex-col justify-center gap-0.5 whitespace-nowrap">
        <h1 className="text-[22px] font-semibold leading-[28px] tracking-[-0.02em] text-white">{symbol}</h1>
        <p className="text-[13px] leading-[18px] text-white/38">{localize(detailInfo.asset, locale)}</p>
      </div>
    </div>
  );
}

function DetailAssetSummary({ locale }: { locale: MarketLocale }) {
  return (
    <div className="flex w-full items-center gap-3">
      <DetailAssetIdentity locale={locale} />
      <DetailMetrics locale={locale} />
    </div>
  );
}

function DetailMetrics({ locale }: { locale: MarketLocale }) {
  return (
    <div className="grid min-w-0 flex-1 grid-cols-2 gap-4">
      <div className="relative h-[84px] overflow-hidden rounded-[10px] bg-white/[0.055] px-4 py-3">
        <DetailMetricWatermark />
        <div className="relative z-[1] flex items-center gap-1.5 text-[13px] font-semibold leading-[18px] text-white/55">
          {locale === "cn" ? "质押年化收益率" : "Stake APR"}
          <Info className="size-3 text-white/40" />
        </div>
        <div className="relative z-[1] mt-2 flex items-end gap-4">
          <div className="flex items-end gap-1 rounded-[3px] bg-white/10 px-0.5">
            <span className="font-mono text-[22px] font-bold leading-none text-white">{detailInfo.apr}</span>
            <span className="pb-0.5 text-[12px] leading-none text-white/60">%</span>
          </div>
          <div className="flex items-end gap-1.5 text-[11px] leading-4 text-white/42">
            <div className="flex flex-col justify-end">
              <span>{locale === "cn" ? "票息利率" : "Coupon Rate"}</span>
              <span className="mt-0.5 text-[12px] font-medium leading-4 text-white">{detailInfo.couponRate}</span>
            </div>
            <span className="pb-0.5 text-[12px] text-white/60">+</span>
            <div className="flex flex-col justify-end">
              <span>iReal</span>
              <span className="mt-0.5 text-[12px] font-medium leading-4 text-white">{detailInfo.irealBonus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-[84px] overflow-hidden rounded-[10px] bg-white/[0.055] px-4 py-3">
        <DetailMetricWatermark />
        <div className="relative z-[1] flex items-center gap-1.5 text-[13px] font-semibold leading-[18px] text-white/55">
          {locale === "cn" ? "总交易量" : "Total Volume"}
          <Info className="size-3 text-white/40" />
        </div>
        <div className="relative z-[1] mt-2 flex items-end gap-2 rounded-[3px] bg-white/10 px-0.5">
          <span className="font-mono text-[22px] font-bold leading-none text-white">$ {detailInfo.volume}</span>
        </div>
      </div>
    </div>
  );
}

function IrealSellModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65] grid place-items-center bg-black/80 p-4">
      <div className="w-full max-w-[420px] rounded-[14px] border border-white/10 bg-[#1C1B18] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-[18px] font-medium text-white">卖出 iReal 积分</h3>
          <button
            type="button"
            className="text-sm text-white/50 transition hover:text-white"
            onClick={onClose}
          >
            关闭
          </button>
        </div>

        <label className="block">
          <span className="text-[14px] text-white/60">卖出数量</span>
          <Input
            className="mt-2 h-11 border-white/10 bg-[#121212] text-[16px] text-white placeholder:text-white/35 focus-visible:ring-0"
            placeholder="请输入 iReal 数量"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <p className="mt-2 text-[13px] text-white/40">可用：100,000.0 iReal</p>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            className="h-10 rounded-[10px] border border-white/20 px-5 text-[14px] text-white/80 transition hover:text-white"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="button"
            className="h-10 rounded-[10px] bg-[#F4C955] px-5 text-[14px] font-medium text-[#18130B]"
            onClick={onClose}
          >
            去卖出
          </button>
        </div>
      </div>
    </div>
  );
}

function MyInfoCard({
  locale,
  showIreal = true,
  onIrealSellClick,
}: {
  locale: MarketLocale;
  showIreal?: boolean;
  onIrealSellClick?: () => void;
}) {
  const rows = [
    {
      label: locale === "cn" ? "余额" : "Balance",
      value: detailInfo.balance,
      unit: detailInfo.balanceUnit,
      sub: "$ 0.00",
      ireal: showIreal,
    },
    {
      label: locale === "cn" ? "已质押" : "Staked",
      value: detailInfo.staked,
      unit: detailInfo.balanceUnit,
      sub: "$ 0.00",
      ireal: false,
    },
    {
      label: locale === "cn" ? "总奖励" : "Total Rewards",
      value: detailInfo.rewards,
      unit: detailInfo.rewardsUnit,
      sub: "",
      ireal: false,
    },
    {
      label: locale === "cn" ? "可领取奖励" : "Claimable Rewards",
      value: detailInfo.claimable,
      unit: detailInfo.claimableUnit,
      sub: "",
      ireal: false,
    },
  ] as const;

  return (
    <aside className="relative w-[300px] shrink-0 overflow-hidden rounded-[12px] border border-[rgba(245,197,4,0.16)] bg-[#201F1C] p-5">
      <div className="pointer-events-none absolute -right-[120px] -top-[60px] size-[230px] rounded-full bg-[radial-gradient(circle,rgba(240,196,86,0.18),transparent_68%)]" />
      <h3 className="relative z-[1] text-[20px] font-semibold leading-[28px] text-white">
        {locale === "cn" ? "我的信息" : "My info"}
      </h3>
      <div className="relative z-[1] mt-4 rounded-[8px] bg-white/[0.065] px-4 py-5">
        {rows.map(({ label, value, unit, sub, ireal }) => (
          <div key={label} className="relative pb-5 last:pb-0">
            <p className="text-[13px] leading-[18px] text-white/58">{label}</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-[20px] font-semibold leading-[26px] text-[#F0C456]">{value}</span>
              <span className="text-[12px] leading-[18px] text-white/60">{unit}</span>
            </div>
            {ireal ? (
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[20px] font-semibold leading-[26px] text-[#F0C456]">
                  {detailInfo.irealBalance}
                </span>
                <span className="text-[12px] leading-[18px] text-white/60">iReal</span>
                <button
                  type="button"
                  className="ml-1 text-[12px] font-medium leading-4 text-[#F0C456] transition hover:text-[#f6d886] hover:underline"
                  onClick={onIrealSellClick}
                >
                  {locale === "cn" ? "卖出" : "Sell"}
                </button>
              </div>
            ) : null}
            {sub ? <p className="mt-0.5 text-[12px] leading-[18px] text-white/38">{sub}</p> : null}
          </div>
        ))}
      </div>
    </aside>
  );
}

function DetailInfoList({ locale }: { locale: MarketLocale }) {
  const items =
    locale === "cn"
      ? ([
          ["Token功能:", "交易所认可抵押品 / 月度派息"],
          ["发行方:", "复星财富控股"],
          ["到期时间:", "N/A"],
          ["单次起购数量:", `最小 1 ${detailInfo.symbol}，整币交易`],
          ["链上市值:", "$999.00M"],
          ["总供应量:", `999.00M ${detailInfo.symbol}`],
          ["总交易量 (24h):", "$0.00"],
        ] as const)
      : ([
          ["Token Utility:", "Exchange-approved collateral / monthly distributions"],
          ["Provider:", "Fosun Wealth Holdings"],
          ["Expiration Date:", "N/A"],
          ["Minimum Order:", `Min 1 ${detailInfo.symbol}, whole tokens`],
          ["Onchain Market Cap:", "$999.00M"],
          ["Total Supply:", `999.00M ${detailInfo.symbol}`],
          ["Total Volume (24h):", "$0.00"],
        ] as const);
  const description =
    locale === "cn"
      ? "rFUIDL 底层关联优质货币市场基金资产，支持链上持有、转让与流动性管理，适用于美元资产保值与流动性管理场景。一级申购通过合格分销商进行，二级市场支持小额交易，赎回与派息以产品规则和链上交易状态为准。"
      : "rFUIDL provides exposure to high-quality money market fund assets and supports on-chain holding, transfer, and liquidity management. Primary subscriptions are handled through qualified distributors, while smaller trades can be completed in the secondary market. Redemption and distributions follow product rules and on-chain transaction status.";

  return (
    <>
      <section className="mt-5">
        <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-white">
          {locale === "cn" ? "更多信息" : "More Info"}
        </h3>
        <p className="mt-3 text-[13px] font-medium leading-[1.7] text-white/58">
          {description}
        </p>
        <div className="mt-4 grid gap-x-10 gap-y-2 md:grid-cols-2">
          {items.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[140px_minmax(0,1fr)] items-start gap-3 text-[13px] font-medium leading-6">
              <span className="text-white/58">{label}</span>
              <span className="text-white/52">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <h3 className="mt-6 text-[20px] font-semibold tracking-[-0.02em] text-white">
        {locale === "cn" ? "信息" : "Information"}
      </h3>
    </>
  );
}

function formatDetailTimestamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function StableCoinIcon({ symbol }: { symbol: string }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#2F7BDC]">
      <span className="grid size-[18px] place-items-center rounded-full border border-white/45 text-[11px] font-bold leading-none text-white">
        {symbol === "USDC" ? "$" : symbol.slice(0, 1)}
      </span>
    </span>
  );
}

function AssetCoinIcon({ symbol = detailInfo.symbol }: { symbol?: string }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-[#161616] ring-1 ring-[#3b3832]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={detailInfo.iconUrl} alt={symbol} className="h-[78%] w-[78%] object-contain" loading="lazy" />
    </span>
  );
}

function DetailTokenPill({
  symbol,
  type,
  canSelect,
}: {
  symbol: string;
  type: "stable" | "asset" | "stake";
  canSelect?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[8px] bg-white/[0.05] px-2.5 py-2 text-[14px] font-medium text-white">
      {type === "stable" ? <StableCoinIcon symbol={symbol} /> : <AssetCoinIcon symbol={symbol} />}
      {symbol}
      {canSelect ? <ChevronDown className="size-3.5 text-white/42" /> : null}
    </span>
  );
}

function DetailPriceSelector({ locale, mode }: { locale: MarketLocale; mode: "buy" | "sell" }) {
  const isBuy = mode === "buy";
  const leftSymbol = isBuy ? "USDC" : detailInfo.symbol;
  const rightSymbol = isBuy ? detailInfo.symbol : "USDC";
  const leftPrice = isBuy ? "1.00" : detailInfo.stakingPrice;
  const rightPrice = isBuy ? detailInfo.stakingPrice : "1.00";

  return (
    <div>
      <p className="mb-2 text-[14px] font-medium leading-5 text-white/82">
        {locale === "cn" ? "价格" : "Price"}
      </p>
      <button
        type="button"
        className="mb-2 flex h-[52px] w-full items-center justify-between rounded-[8px] bg-[#211F1B] px-3 text-left transition hover:bg-[#26231F]"
      >
        <div className="flex items-center gap-2">
          <span className="grid size-6 grid-cols-2 gap-0.5 text-white/56">
            <span className="rounded-[2px] border border-current" />
            <span className="rounded-[2px] border border-current" />
            <span className="rounded-[2px] border border-current" />
            <span className="rounded-[2px] border border-current" />
          </span>
          <span>
            <span className="block text-[12px] text-white/36">
              {locale === "cn" ? "做市商 (LP)" : "Liquidity Provider (LP)"}
              <span className="ml-1 rounded-[4px] bg-[#EA4E67] px-1 py-0.5 text-[11px] text-white">
                {locale === "cn" ? "推荐" : "Recommended"}
              </span>
            </span>
            <span className="block text-[14px] font-medium text-white">
              {locale === "cn" ? "做市商A名称" : "Market Maker A"}
            </span>
          </span>
        </div>
        <ChevronDown className="size-4 text-white/48" />
      </button>
      <div className="grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] items-center gap-2">
        <div className="flex h-[48px] min-w-0 items-center justify-between rounded-[8px] bg-white/[0.055] px-2">
          <DetailTokenPill symbol={leftSymbol} type={isBuy ? "stable" : "asset"} canSelect={isBuy} />
          <span className="ml-2 shrink-0 font-mono text-[16px] font-semibold text-white">{leftPrice}</span>
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-[8px] border border-white/16 bg-white/[0.04] text-white/56"
          aria-label={locale === "cn" ? "切换价格方向" : "Switch price direction"}
        >
          ⇄
        </button>
        <div className="flex h-[48px] min-w-0 items-center justify-between rounded-[8px] bg-white/[0.055] px-2">
          <DetailTokenPill symbol={rightSymbol} type={isBuy ? "asset" : "stable"} />
          <span className="ml-2 shrink-0 font-mono text-[16px] font-semibold text-white">{rightPrice}</span>
        </div>
      </div>
    </div>
  );
}

function DetailAmountInput({
  label,
  value,
  onChange,
  token,
  tokenType,
  available,
  showDeposit,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  token: string;
  tokenType: "stable" | "asset" | "stake";
  available?: string;
  showDeposit?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[14px] font-medium leading-5 text-white/82">{label}</span>
      <div className="mt-2 flex h-[48px] items-center rounded-[8px] border border-white/12 bg-transparent px-2.5 focus-within:border-[#F0C456]/60">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0.00"
          className="h-full flex-1 border-0 bg-[#161616] px-3 font-mono text-[16px] text-white shadow-none placeholder:text-white/30 focus-visible:ring-0"
        />
        <div className="ml-2 inline-flex items-center gap-1.5 text-[14px] text-white">
          {tokenType === "stable" ? <StableCoinIcon symbol={token} /> : <AssetCoinIcon symbol={token} />}
          <span>{token}</span>
          <button type="button" className="font-medium text-[#F0C456]">
            Max
          </button>
        </div>
      </div>
      {available ? (
        <p className="mt-1.5 text-[12px] leading-4 text-white/38">
          {available}
          {showDeposit ? <button type="button" className="ml-2 text-[#F0C456] hover:underline">去充值</button> : null}
        </p>
      ) : null}
    </label>
  );
}

function DetailTradeFeeLine({
  locale,
  mode,
}: {
  locale: MarketLocale;
  mode: "buy" | "sell";
}) {
  const amount = mode === "buy" ? "10.00USDC≈$10" : "10.00rUSD≈$10";
  return (
    <div className="flex items-center justify-end gap-1.5 text-[12px] leading-5 text-white/82">
      <span className="font-semibold text-white">{locale === "cn" ? "交易手续费" : "Trading Fee"}</span>
      <span className="font-semibold text-white">1.00%</span>
      <span>{amount}</span>
      <span className="grid size-4 place-items-center rounded-full bg-[#E8C77D] text-[10px] font-bold leading-none text-white">!</span>
    </div>
  );
}

function DetailActionPanel({
  activeTab,
  locale,
  onSubmit,
}: {
  activeTab: DetailActionKey;
  locale: MarketLocale;
  onSubmit: (action: DetailActionKey) => void;
}) {
  const [primaryAmount, setPrimaryAmount] = useState("0.00");
  const [secondaryAmount, setSecondaryAmount] = useState("0.00");
  const labels = {
    buy: locale === "cn" ? "购买" : "Buy",
    sell: locale === "cn" ? "卖出" : "Sell",
    stake: locale === "cn" ? "质押" : "Stake",
    redeem: locale === "cn" ? "赎回" : "Redeem",
    claim: locale === "cn" ? "领取" : "Claim",
  } satisfies Record<DetailActionKey, string>;

  if (activeTab === "buy" || activeTab === "sell") {
    const isBuy = activeTab === "buy";
    return (
      <section className="mx-auto max-w-[432px] bg-transparent pt-5">
        <DetailPriceSelector locale={locale} mode={activeTab} />
        <div className="mt-4 space-y-3">
          <DetailAmountInput
            label={locale === "cn" ? "数量" : "Amount"}
            value={primaryAmount}
            onChange={setPrimaryAmount}
            token={detailInfo.symbol}
            tokenType="asset"
            available={isBuy ? undefined : `${locale === "cn" ? "可用：" : "Available:"} 666.66 ${detailInfo.symbol}`}
          />
          <div className="grid place-items-center">
            <span className="grid size-8 place-items-center rounded-[8px] bg-white/[0.12] text-[18px] text-white/62">⇅</span>
          </div>
          <DetailAmountInput
            label={isBuy ? (locale === "cn" ? "价值" : "Value") : (locale === "cn" ? "接收" : "Receive")}
            value={secondaryAmount}
            onChange={setSecondaryAmount}
            token="USDC"
            tokenType="stable"
            available={isBuy ? `${locale === "cn" ? "可用：" : "Available:"} 10,274.223 USDC` : undefined}
            showDeposit={isBuy}
          />
        </div>
        <div className="mt-3">
          <DetailTradeFeeLine locale={locale} mode={activeTab} />
        </div>
        <button
          type="button"
          className="mt-4 h-12 w-full rounded-[8px] bg-[#F0C456] text-[16px] font-semibold text-[#18130B] transition hover:brightness-105"
          onClick={() => onSubmit(activeTab)}
        >
          {labels[activeTab]}
        </button>
      </section>
    );
  }

  if (activeTab === "claim") {
    return (
      <section className="mx-auto max-w-[432px] bg-transparent pt-5">
        <div className="space-y-3">
          <DetailAmountInput
            label={locale === "cn" ? "USDC 数量" : "USDC Amount"}
            value={primaryAmount}
            onChange={setPrimaryAmount}
            token="USDC"
            tokenType="stable"
            available={`${locale === "cn" ? "可用：" : "Available:"} ${detailInfo.claimable} USDC`}
          />
          <DetailAmountInput
            label={locale === "cn" ? "iREAL 数量" : "iREAL Amount"}
            value={secondaryAmount}
            onChange={setSecondaryAmount}
            token="iREAL"
            tokenType="asset"
            available={`${locale === "cn" ? "可用：" : "Available:"} ${detailInfo.irealBalance} iREAL`}
          />
        </div>
        <button
          type="button"
          className="mt-5 h-12 w-full rounded-[8px] bg-[#F0C456] text-[16px] font-semibold text-[#18130B] transition hover:brightness-105"
          onClick={() => onSubmit(activeTab)}
        >
          {labels[activeTab]}
        </button>
      </section>
    );
  }

  const isStake = activeTab === "stake";
  return (
    <section className="mx-auto max-w-[432px] bg-transparent pt-5">
      <div className="space-y-3">
        <DetailAmountInput
          label={locale === "cn" ? "数量" : "Amount"}
          value={primaryAmount}
          onChange={setPrimaryAmount}
          token={isStake ? detailInfo.symbol : detailInfo.stakingSymbol}
          tokenType="asset"
          available={
            isStake
              ? `${locale === "cn" ? "可用：" : "Available:"} 12,700,274.223 ${detailInfo.symbol}`
              : `${locale === "cn" ? "可用：" : "Available:"} 1,000.00 ${detailInfo.stakingSymbol}`
          }
        />
        <div className="grid place-items-center py-2">
          <span className="grid size-9 place-items-center rounded-[8px] bg-white/[0.12] text-[20px] text-white/62">↓</span>
        </div>
        <DetailAmountInput
          label={locale === "cn" ? "接收" : "Receive"}
          value={secondaryAmount}
          onChange={setSecondaryAmount}
          token={isStake ? detailInfo.stakingSymbol : detailInfo.symbol}
          tokenType="stake"
        />
      </div>
      <div className="mt-5 rounded-[8px] bg-white/[0.055] px-4 py-3 text-[13px] text-white/72">
        🔥 GAS {locale === "cn" ? "费" : "Fee"}：0.5 BNB ≈$10
      </div>
      <p className="mt-1.5 text-[12px] text-white/38">{locale === "cn" ? "可用：" : "Available:"} 0.01 BNB</p>
      <button
        type="button"
        className="mt-4 h-12 w-full rounded-[8px] bg-[#F0C456] text-[16px] font-semibold text-[#18130B] transition hover:brightness-105"
        onClick={() => onSubmit(activeTab)}
      >
        {labels[activeTab]}
      </button>
    </section>
  );
}

function DetailSuccessModal({
  action,
  locale,
  submittedAt,
  onClose,
  onStakeNow,
}: {
  action: DetailActionKey;
  locale: MarketLocale;
  submittedAt: string;
  onClose: () => void;
  onStakeNow: () => void;
}) {
  const titleMap = {
    buy: { cn: "购买", en: "Buy" },
    sell: { cn: "卖出", en: "Sell" },
    stake: { cn: "质押", en: "Stake" },
    redeem: { cn: "赎回", en: "Redeem" },
    claim: { cn: "领取", en: "Claim" },
  } satisfies Record<DetailActionKey, LocaleText>;
  const statusMap = {
    buy: { cn: "购买提交成功", en: "Purchase Submitted" },
    sell: { cn: "卖出提交成功", en: "Sell Submitted" },
    stake: { cn: "质押提交成功", en: "Stake Submitted" },
    redeem: { cn: "赎回提交成功", en: "Redeem Submitted" },
    claim: { cn: "领取提交成功", en: "Claim Submitted" },
  } satisfies Record<DetailActionKey, LocaleText>;
  const rows = [
    action === "buy" ? { label: locale === "cn" ? "支付总额" : "Total Paid", value: "2 USDC" } : null,
    action === "buy" ? { label: locale === "cn" ? "预计获得资产" : "Expected Asset", value: `2 ${detailInfo.symbol}` } : null,
    action === "sell" ? { label: locale === "cn" ? "预计收到" : "Estimated Receive", value: "2 USDC" } : null,
    action === "stake" ? { label: locale === "cn" ? "预计获得" : "Expected Receive", value: `2 ${detailInfo.stakingSymbol}` } : null,
    action === "redeem" ? { label: locale === "cn" ? "预计收到" : "Estimated Receive", value: `2 ${detailInfo.symbol}` } : null,
    action === "claim" ? { label: locale === "cn" ? "领取奖励" : "Claimed Rewards", value: "100,000.0 USDC" } : null,
    { label: locale === "cn" ? "提交时间" : "Submitted At", value: submittedAt },
    action === "buy"
      ? {
          label: locale === "cn" ? "添加代币" : "Add Token",
          value: "0x48bfd064...2d9fe39feb6f",
          actionText: locale === "cn" ? "去添加" : "Add",
        }
      : null,
    action === "buy" || action === "sell" ? { label: locale === "cn" ? "交易手续费" : "Trading Fee", value: "0.1%≈$0.1" } : null,
    {
      label: locale === "cn" ? "交易哈希" : "Tx Hash",
      value: "0xe512c4ce...845a2380de1c",
      actionText: locale === "cn" ? "去查看" : "View",
    },
  ].filter(Boolean) as Array<{ label: string; value: string; actionText?: string }>;

  const modal = (
    <div className="fixed inset-0 z-[70] grid items-start justify-items-center overflow-y-auto bg-black/80 p-4 sm:items-center" data-detail-success-modal>
      <div className="relative my-4 max-h-[calc(100vh-32px)] w-full max-w-[680px] overflow-y-auto rounded-[8px] border border-[#3a352f] bg-[#211F1B] px-6 py-6 text-white shadow-[0_28px_80px_rgba(0,0,0,0.55)] sm:px-8 sm:py-8">
        <button
          type="button"
          className="absolute right-5 top-5 text-[34px] leading-none text-white/52 transition hover:text-white"
          onClick={onClose}
          aria-label={locale === "cn" ? "关闭" : "Close"}
        >
          ×
        </button>
        <h3 className="text-center text-[24px] font-semibold sm:text-[26px]">{localize(titleMap[action], locale)}</h3>
        <div className="mt-4 grid place-items-center sm:mt-6">
          <span className="grid size-[56px] place-items-center rounded-full bg-[#27C994] sm:size-[64px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="size-9 text-[#15130F] sm:size-10">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        </div>
        <p className="mt-4 text-center text-[22px] font-semibold sm:mt-5 sm:text-[24px]">{localize(statusMap[action], locale)}</p>
        <div className="mt-5 rounded-[14px] bg-white/[0.055] px-5 py-4 sm:mt-6 sm:px-6">
          {rows.map(({ label, value, actionText }) => (
            <div key={label} className="flex items-center justify-between gap-6 py-2 text-[16px]">
              <span className="font-semibold text-white/42">{label}</span>
              <span className="flex min-w-0 items-center justify-end gap-2 text-right font-medium text-white/68">
                <span className="truncate">{value}</span>
                {actionText ? (
                  <>
                    <span className="size-4 shrink-0 rounded-[3px] border border-white/34" aria-hidden />
                    <button type="button" className="shrink-0 font-semibold text-[#F0C456] underline-offset-4 hover:underline">
                      {actionText}
                    </button>
                  </>
                ) : null}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8">
          <button
            type="button"
            className="h-14 rounded-[14px] border border-white/34 text-[18px] font-semibold text-white transition hover:bg-white/[0.05]"
            onClick={onClose}
          >
            {locale === "cn" ? "查看详情" : "View Details"}
          </button>
          <button
            type="button"
            className="h-14 rounded-[14px] bg-[#F0C456] text-[18px] font-semibold text-[#18130B] transition hover:brightness-105"
            onClick={action === "buy" ? onStakeNow : onClose}
          >
            {action === "buy" ? (locale === "cn" ? "立即质押" : "Stake Now") : (locale === "cn" ? "完成" : "Done")}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(modal, document.body);
}

function PortfolioPageFrame({
  sidebarActive,
  title = "My Portfolio",
  children,
}: {
  sidebarActive?: "trade" | "stake" | "lending" | "balance" | null;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1560px] px-6 py-12">
      <BackHeader title={title} />
      <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
        <PortfolioSidebar active={sidebarActive} />
        <div>{children}</div>
      </div>
      <RealRwaFooter />
    </section>
  );
}

export function MarketPageV2() {
  const router = useRouter();
  const { lang, walletConnected, identityBound, platformUsd1Balance } = useRwaAppState();
  const locale: MarketLocale = lang === "en" ? "en" : "cn";
  const [search, setSearch] = useState("");
  const [buyTarget, setBuyTarget] = useState<MarketCard | null>(null);

  const visibleCards = useMemo(() => {
    if (!search.trim()) return marketCards;
    const keyword = search.trim().toLowerCase();
    return marketCards.filter(
      (card) =>
        card.symbol.toLowerCase().includes(keyword) ||
        card.subtitle.cn.toLowerCase().includes(keyword) ||
        card.subtitle.en.toLowerCase().includes(keyword)
    );
  }, [search]);

  const requestBuy = (card: MarketCard) => {
    if (!triggerAuthGate(walletConnected, identityBound)) {
      return;
    }
    setBuyTarget(card);
  };

  return (
    <RealRwaShell activeNav={0}>
      <section className="overflow-hidden border-b border-white/6 bg-black">
        <div className="relative mx-auto max-w-[1088px] overflow-hidden px-6 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_44%,rgba(214,134,40,0.22),transparent_18%),radial-gradient(circle_at_84%_38%,rgba(42,112,131,0.22),transparent_16%),linear-gradient(90deg,rgba(10,10,10,0.98)_0%,rgba(12,12,12,0.92)_40%,rgba(16,16,16,0.78)_100%)]" />
          <div className="absolute right-[-4%] top-0 h-full w-[52%] bg-[radial-gradient(circle_at_60%_45%,rgba(229,141,28,0.18),transparent_20%),radial-gradient(circle_at_78%_58%,rgba(28,137,151,0.16),transparent_20%)]" />
          <div className="absolute right-[10%] top-[14%] h-[180px] w-[180px] rounded-[18px] border border-[#7B5B28]/30 bg-[linear-gradient(180deg,rgba(31,29,24,0.88),rgba(18,18,18,0.88))] shadow-[0_0_60px_rgba(214,134,40,0.12)]" />
          <div className="relative z-[1] max-w-[600px]">
            <h1 className="text-[42px] font-semibold tracking-[-0.05em] text-white">Real Finance</h1>
            <p className="mt-3 text-[18px] text-zinc-300">
              {locale === "cn"
                ? "用区块链技术重构金融产品流动性"
                : "Reconstructing financial product liquidity with blockchain technology"}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-black">
        <div className="mx-auto max-w-[1088px] px-6 py-10">
          <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white">
            {locale === "cn" ? "市场" : "Markets"}
          </h2>

          <div className="relative mt-5 rounded-[14px] bg-[#1F1F1F] px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-h-9 flex-1 rounded-[10px] border border-white/6 bg-[#1F1F1F]" />
              <div className="relative w-full max-w-[540px]">
                <Input
                  className="h-11 rounded-[10px] border border-white/10 bg-[#1F1F1F] pl-4 pr-10 text-[14px] text-white placeholder:text-zinc-500"
                  placeholder={locale === "cn" ? "搜索产品或发行方" : "Search product or provider"}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {visibleCards.map((card) => (
              <MarketCardView
                key={card.id}
                card={card}
                locale={locale}
                onDetail={() => router.push(REALRWA_ROUTES.homeDetail)}
                onBuy={() => requestBuy(card)}
              />
            ))}
          </div>
        </div>
      </section>

      <RealRwaFooter />

      <BuyModal
        open={!!buyTarget}
        onClose={() => setBuyTarget(null)}
        platformBalance={platformUsd1Balance}
        assetSymbol={buyTarget?.symbol ?? "rFUIDL"}
        assetIssuer={buyTarget ? localize(buyTarget.subtitle, locale) : undefined}
      />
    </RealRwaShell>
  );
}

export function BondDetailPageV2({ backRoute = REALRWA_ROUTES.market }: { backRoute?: string }) {
  const router = useRouter();
  const { lang } = useRwaAppState();
  const locale: MarketLocale = lang === "en" ? "en" : "cn";
  const [tab, setTab] = useState<DetailTabKey>("detail");
  const [irealSellOpen, setIrealSellOpen] = useState(false);
  const [successAction, setSuccessAction] = useState<DetailActionKey | null>(null);
  const [submittedAt, setSubmittedAt] = useState("");

  const detailTabs = [
    ["detail", { cn: "详情", en: "Detail" }],
    ["buy", { cn: "购买", en: "Buy" }],
    ["sell", { cn: "卖出", en: "Sell" }],
    ["stake", { cn: "质押", en: "Stake" }],
    ["redeem", { cn: "赎回", en: "Redeem" }],
    ["claim", { cn: "领取", en: "Claim" }],
    ["holders", { cn: "持有者", en: "Holder" }],
  ] as const;
  const submitAction = (action: DetailActionKey) => {
    setSubmittedAt(formatDetailTimestamp());
    setSuccessAction(action);
  };

  return (
    <RealRwaShell activeNav={1}>
      <section className="border-b border-white/10 bg-[#050505] pb-10 pt-6">
        <div className="mx-auto w-full max-w-[1280px] px-6">
        <button
          type="button"
          className="mb-6 flex items-center gap-2 text-left text-[16px] font-semibold leading-6 text-white"
          onClick={() => router.push(backRoute)}
        >
          <ArrowLeft className="size-5 text-zinc-500" />
          {locale === "cn" ? "债券详情" : "Bond Detail"}
        </button>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <DetailAssetSummary locale={locale} />

            <div className="mt-6 overflow-hidden">
              <div className="flex h-[40px] w-full items-start rounded-t-[8px] border-b border-white/6 bg-white/[0.055]">
                {detailTabs.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`flex h-full flex-col items-center justify-center gap-1.5 rounded-t-[8px] px-5 pt-1 text-[14px] leading-5 ${
                      tab === key ? "font-medium text-[#F8BF69]" : "font-normal text-white/40"
                    }`}
                    onClick={() => setTab(key)}
                  >
                    <span>{localize(label, locale)}</span>
                    <span className={`h-0.5 w-full rounded-full ${tab === key ? "bg-[#F8BF69]" : "bg-transparent"}`} />
                  </button>
                ))}
              </div>

              <div>
                {tab === "detail" ? (
                  <DetailInfoList locale={locale} />
                ) : null}

                {tab === "buy" || tab === "sell" || tab === "stake" || tab === "redeem" || tab === "claim" ? (
                  <DetailActionPanel activeTab={tab} locale={locale} onSubmit={submitAction} />
                ) : null}

                {tab === "holders" ? (
                  <section className="pt-5">
                    <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-white">
                      {locale === "cn" ? "持有者" : "Holder"}
                    </h3>
                    <div className="mt-3 overflow-hidden rounded-[8px] border border-white/6">
                      <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr_0.6fr] bg-[#222222] px-4 py-3 text-[12px] text-zinc-400">
                        <span>Rank Address</span>
                        <span>Quantity</span>
                        <span>Percentage</span>
                        <span>Value</span>
                        <span>Times</span>
                      </div>
                      {holderRows.map((row) => (
                        <div key={`${row[0]}-${row[4]}`} className="grid grid-cols-[2fr_1fr_1fr_1.2fr_0.6fr] border-t border-white/8 px-4 py-3 text-[12px] text-zinc-300">
                          {row.map((cell) => (
                            <span key={cell}>{cell}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                    <RealRwaPagination />
                  </section>
                ) : null}
              </div>
            </div>
          </div>

          <MyInfoCard
            locale={locale}
            onIrealSellClick={() => setIrealSellOpen(true)}
          />
        </div>
        </div>
      </section>

      <IrealSellModal open={irealSellOpen} onClose={() => setIrealSellOpen(false)} />
      {successAction ? (
        <DetailSuccessModal
          action={successAction}
          locale={locale}
          submittedAt={submittedAt}
          onClose={() => setSuccessAction(null)}
          onStakeNow={() => {
            setSuccessAction(null);
            setTab("stake");
          }}
        />
      ) : null}
    </RealRwaShell>
  );
}

export function TokenBalancePageV2() {
  const router = useRouter();
  const { walletConnected, identityBound } = useRwaAppState();
  const [rowMenu, setRowMenu] = useState<string | null>(null);

  const handleBuy = () => {
    if (!triggerAuthGate(walletConnected, identityBound)) {
      return;
    }
    router.push(REALRWA_ROUTES.homeDetail);
  };

  return (
    <RealRwaShell activeNav={0}>
      <PortfolioPageFrame sidebarActive="balance">
        <div className="space-y-6">
          <div className="rounded-[18px] border border-[#3A3370] bg-[radial-gradient(circle_at_86%_18%,rgba(81,92,255,0.18),transparent_22%),linear-gradient(135deg,rgba(26,21,52,0.98),rgba(30,24,52,0.96))] px-8 py-9">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                ["总资产价值/Total Value", "$ 31,020,232.58", "≈ 1.00228 USDC"],
                ["可用余额/Available", "$ 31,020,232.58", "≈ 1.00228 USDC"],
                ["REAL余额/REAL Balance", "31,020,232.58 REAL", ""],
              ].map(([label, value, sub]) => (
                <div key={label}>
                  <div className="flex items-center gap-2 text-[20px] text-zinc-400">
                    {label}
                    <Info className="size-5 text-zinc-500" />
                  </div>
                  <p className="mt-5 inline-flex rounded-[8px] bg-white/[0.08] px-3 py-1 font-mono text-[52px] font-semibold leading-none text-white">
                    {value}
                  </p>
                  {sub ? <p className="mt-4 text-[20px] text-zinc-500">{sub}</p> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.35fr_0.9fr]">
            <div className="rounded-[18px] border border-[#5A4A20] bg-[#2E2A18] px-8 py-7">
              <h3 className="text-[34px] font-semibold text-white">收益情况</h3>
              <div className="mt-7 grid gap-8 md:grid-cols-3">
                {[
                  ["昨日收益/YDT PNL", "31,020,232.58", "USD"],
                  ["累计收益/Total PNL", "31,020,232.58", "USD"],
                  ["平均年化收益率", "2.58", "%"],
                ].map(([label, value, unit]) => (
                  <div key={label}>
                    <div className="flex items-center gap-2 text-[18px] text-zinc-400">
                      {label}
                      <Info className="size-5 text-zinc-500" />
                    </div>
                    <p className="mt-5 inline-flex rounded-[8px] bg-white/[0.08] px-3 py-1 font-mono text-[44px] font-semibold text-white">
                      {value}
                      <span className="ml-2 text-zinc-300">{unit}</span>
                    </p>
                    <p className="mt-4 text-[18px] text-zinc-500">≈ 1.00228 USDC</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[18px] border border-[#5A4A20] bg-[#2E2A18] px-8 py-7">
              <h3 className="text-[34px] font-semibold text-white">质押情况</h3>
              <div className="mt-7 grid gap-8 md:grid-cols-2">
                {[
                  ["总质押/Total Staked", "31,020,232.58", "USD"],
                  ["可质押/Available to Stake", "31,020,232.58", "USD"],
                ].map(([label, value, unit]) => (
                  <div key={label}>
                    <div className="flex items-center gap-2 text-[18px] text-zinc-400">
                      {label}
                      <Info className="size-5 text-zinc-500" />
                    </div>
                    <p className="mt-5 inline-flex rounded-[8px] bg-white/[0.08] px-3 py-1 font-mono text-[40px] font-semibold text-white">
                      {value}
                      <span className="ml-2 text-zinc-300">{unit}</span>
                    </p>
                    <p className="mt-4 text-[18px] text-zinc-500">≈ 1.00228 USDC</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-white/6 bg-[#1F1F1F]">
            <div className="grid grid-cols-[1.1fr_repeat(5,0.95fr)_1.1fr] bg-[#2A2A2A] px-8 py-7 text-[22px] text-zinc-400">
              <span>Token</span>
              <span>Total Balance</span>
              <span>Available Balance</span>
              <span>YDT PNL</span>
              <span>Total PNL</span>
              <span>APR</span>
              <span>Operation</span>
            </div>
            {balanceRows.map((row, index) => (
              <div key={`${row[0]}-${index}`} className="relative grid grid-cols-[1.1fr_repeat(5,0.95fr)_1.1fr] items-center border-t border-white/8 px-8 py-8 text-[22px] text-zinc-300">
                {row.map((cell) => (
                  <span key={`${cell}-${index}`}>{cell}</span>
                ))}
                <div className="flex items-center gap-7 text-[#E4B34C]">
                  <button type="button" onClick={handleBuy}>买入</button>
                  {index === 0 ? <button type="button">提现</button> : null}
                  {index === 1 ? null : <button type="button">质押</button>}
                  <button type="button" onClick={() => setRowMenu((prev) => (prev === `${index}` ? null : `${index}`))}>
                    更多 <ChevronDown className="ml-1 inline size-4" />
                  </button>
                </div>
                {rowMenu === `${index}` ? (
                  <div className="absolute right-10 top-12 z-10 overflow-hidden rounded-[14px] border border-white/8 bg-[#2E2B26] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                    {["Withdraw", "Claim", "Sell"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="block w-full px-7 py-5 text-left text-[20px] text-zinc-200 hover:bg-white/[0.04]"
                        onClick={() => setRowMenu(null)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="px-8 pb-8">
              <RealRwaPagination />
            </div>
          </div>
        </div>
      </PortfolioPageFrame>
    </RealRwaShell>
  );
}

export function TradeOrdersPageV2() {
  return (
    <RealRwaShell activeNav={0}>
      <PortfolioPageFrame sidebarActive="trade">
        <div className="overflow-hidden rounded-[18px] border border-white/6 bg-[#1F1F1F]">
          <div className="grid grid-cols-[1.25fr_0.9fr_0.8fr_0.7fr_0.7fr_0.7fr_1fr_0.8fr] bg-[#2A2A2A] px-8 py-7 text-[22px] text-zinc-400">
            <span>Time</span>
            <span>Coin</span>
            <span>Type</span>
            <span>Price</span>
            <span>Size</span>
            <span>Amount</span>
            <span>Hash</span>
            <span>Status</span>
          </div>
          {tradeOrderRows.map((row, index) => (
            <div key={`${row.hash}-${index}`} className="grid grid-cols-[1.25fr_0.9fr_0.8fr_0.7fr_0.7fr_0.7fr_1fr_0.8fr] items-center border-t border-white/8 px-8 py-8 text-[22px] text-zinc-300">
              <span>{row.time}</span>
              <span>{row.coin}</span>
              <span className={row.type === "Sell" ? "text-[#EF5A5A]" : "text-[#18D3B3]"}>{row.type}</span>
              <span>{row.price}</span>
              <span>{row.size}</span>
              <span>{row.amount}</span>
              <button type="button" className="text-left text-[#00E6FF] underline decoration-white/20 underline-offset-4">{row.hash}</button>
              <StatusText status={row.status} />
            </div>
          ))}
          <div className="px-8 pb-8">
            <RealRwaPagination />
          </div>
        </div>
      </PortfolioPageFrame>
    </RealRwaShell>
  );
}

export function StakeOrdersPageV2() {
  const [tab, setTab] = useState<"stake" | "redeem" | "reward">("stake");

  return (
    <RealRwaShell activeNav={0}>
      <PortfolioPageFrame sidebarActive="stake">
        <div className="overflow-hidden rounded-[18px] border border-white/6 bg-[#1F1F1F]">
          <div className="flex items-center gap-14 border-b border-white/6 px-8">
            {[
              ["stake", "质押记录"],
              ["redeem", "赎回记录"],
              ["reward", "收益发放"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`border-b-4 px-2 py-6 text-[26px] font-medium ${
                  tab === key ? "border-[#E4B34C] text-[#E4B34C]" : "border-transparent text-zinc-500"
                }`}
                onClick={() => setTab(key as "stake" | "redeem" | "reward")}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "reward" ? (
            <div className="mx-8 mt-6 rounded-[12px] border border-[#56431A] bg-[#4A3917]/70 px-4 py-4 text-[18px] text-[#D8B164]">
              系统将在每日 08:00 进行自动发放奖励，请注意查收。
            </div>
          ) : null}

          {tab === "stake" ? (
            <>
              <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.9fr_0.9fr_1fr_0.8fr] bg-[#2A2A2A] px-8 py-7 text-[22px] text-zinc-400">
                <span>质押时间</span>
                <span>质押名称</span>
                <span>质押数量</span>
                <span>待赎回数量</span>
                <span>债券收益（待领取）</span>
                <span>REAL收益（待领取）</span>
                <span>Hash</span>
                <span>Status</span>
              </div>
              {stakeOrderData.stake.map((row, index) => (
                <div key={`${row.hash}-${index}`} className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.9fr_0.9fr_1fr_0.8fr] items-center border-t border-white/8 px-8 py-8 text-[22px] text-zinc-300">
                  <span>{row.time}</span>
                  <span>{row.name}</span>
                  <span>{row.amount}</span>
                  <span>{row.redeemable}</span>
                  <span>{row.bondYield}</span>
                  <span>{row.realYield}</span>
                  <button type="button" className="text-left text-[#00E6FF] underline decoration-white/20 underline-offset-4">{row.hash}</button>
                  <StatusText status={row.status as TableStatus} />
                </div>
              ))}
            </>
          ) : null}

          {tab === "redeem" ? (
            <>
              <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.9fr_1fr_0.8fr] bg-[#2A2A2A] px-8 py-7 text-[22px] text-zinc-400">
                <span>赎回时间</span>
                <span>赎回名称</span>
                <span>赎回数量</span>
                <span>待赎回数量</span>
                <span>待赎回利息</span>
                <span>Hash</span>
                <span>Status</span>
              </div>
              {stakeOrderData.redeem.map((row, index) => (
                <div key={`${row.hash}-${index}`} className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.9fr_1fr_0.8fr] items-center border-t border-white/8 px-8 py-8 text-[22px] text-zinc-300">
                  <span>{row.time}</span>
                  <span>{row.name}</span>
                  <span>{row.redeemed}</span>
                  <span>{row.bondYield}</span>
                  <span>{row.realYield}</span>
                  <button type="button" className="text-left text-[#00E6FF] underline decoration-white/20 underline-offset-4">{row.hash}</button>
                  <StatusText status={row.status as TableStatus} />
                </div>
              ))}
            </>
          ) : null}

          {tab === "reward" ? (
            <>
              <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_1fr_0.8fr] bg-[#2A2A2A] px-8 py-7 text-[22px] text-zinc-400">
                <span>发放时间</span>
                <span>币种</span>
                <span>发放金额</span>
                <span>Hash</span>
                <span>状态</span>
              </div>
              {stakeOrderData.reward.map((row, index) => (
                <div key={`${row.hash}-${index}`} className="grid grid-cols-[1.3fr_0.8fr_0.8fr_1fr_0.8fr] items-center border-t border-white/8 px-8 py-8 text-[22px] text-zinc-300">
                  <span>{row.issuedAt}</span>
                  <span>{row.currency}</span>
                  <span>{row.amount}</span>
                  <button type="button" className="text-left text-[#00E6FF] underline decoration-white/20 underline-offset-4">{row.hash}</button>
                  <StatusText status={row.status as TableStatus} />
                </div>
              ))}
            </>
          ) : null}

          <div className="px-8 pb-8">
            <RealRwaPagination />
          </div>
        </div>
      </PortfolioPageFrame>
    </RealRwaShell>
  );
}

export function LendingOrdersPageV2() {
  const [tab, setTab] = useState<"borrow" | "repay">("borrow");

  return (
    <RealRwaShell activeNav={0}>
      <PortfolioPageFrame sidebarActive="lending">
        <div className="overflow-hidden rounded-[18px] border border-white/6 bg-[#1F1F1F]">
          <div className="flex items-center gap-14 border-b border-white/6 px-8">
            {[
              ["borrow", "借款订单"],
              ["repay", "还款订单"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`border-b-4 px-2 py-6 text-[26px] font-medium ${
                  tab === key ? "border-[#E4B34C] text-[#E4B34C]" : "border-transparent text-zinc-500"
                }`}
                onClick={() => setTab(key as "borrow" | "repay")}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr_0.9fr] bg-[#2A2A2A] px-8 py-7 text-[22px] text-zinc-400">
            <span>时间</span>
            <span>Asset</span>
            <span>{tab === "borrow" ? "借款数量" : "存入数量"}</span>
            <span>APR</span>
            <span>{tab === "borrow" ? "待支付利息" : "待领取利息"}</span>
            <span>Status</span>
          </div>
          {lendingOrderData[tab].map((row, index) => (
            <div key={`${row.time}-${index}`} className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr_0.9fr] items-center border-t border-white/8 px-8 py-8 text-[22px] text-zinc-300">
              <span>{row.time}</span>
              <span>{row.asset}</span>
              <span>{row.amount}</span>
              <span>{row.apr}</span>
              <span>{row.interest}</span>
              <StatusText status={row.status as TableStatus} />
            </div>
          ))}

          <div className="px-8 pb-8">
            <RealRwaPagination />
          </div>
        </div>
      </PortfolioPageFrame>
    </RealRwaShell>
  );
}

const invitationTitleTypography = {
  fontFamily: '"Alibaba PuHuiTi"',
} as const;

const invitationBodyTypography = {
  color: "rgba(255, 255, 255, 0.6)",
  fontFamily: '"PingFang SC"',
} as const;

const invitationButtonTypography = {
  fontFamily:
    '-apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
} as const;

export function ReserveOrdersPageV2() {
  const [tab, setTab] = useState<"supply" | "withdraw" | "claim">("supply");

  return (
    <RealRwaShell activeNav={5}>
      <PortfolioPageFrame sidebarActive={null} title="My Order">
        <div className="overflow-hidden rounded-[18px] border border-white/6 bg-[#1F1F1F]">
          <div className="flex items-center gap-14 border-b border-white/6 px-8">
            {[
              ["supply", "Supply Order"],
              ["withdraw", "Withdraw Order"],
              ["claim", "Claim Order"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`border-b-4 px-2 py-6 text-[26px] font-medium ${
                  tab === key ? "border-[#E4B34C] text-white" : "border-transparent text-zinc-500"
                }`}
                onClick={() => setTab(key as "supply" | "withdraw" | "claim")}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "supply" ? (
            <>
              <div className="grid grid-cols-[1.25fr_1fr_0.9fr] bg-[#2A2A2A] px-8 py-7 text-[22px] text-zinc-400">
                <span>Time</span>
                <span>Asset</span>
                <span>Amount</span>
              </div>
              {reserveOrderData.supply.map((row, index) => (
                <div
                  key={`${row.time}-${index}`}
                  className="grid grid-cols-[1.25fr_1fr_0.9fr] items-center border-t border-white/8 px-8 py-8 text-[22px] text-zinc-300"
                >
                  <span>{row.time}</span>
                  <span>{row.asset}</span>
                  <span>{row.amount}</span>
                </div>
              ))}
            </>
          ) : null}

          {tab !== "supply" ? (
            <>
              <div className="grid grid-cols-[1.25fr_1fr_0.9fr_0.9fr_1fr] bg-[#2A2A2A] px-8 py-7 text-[22px] text-zinc-400">
                <span>时间</span>
                <span>Asset</span>
                <span>存入数量</span>
                <span>APR</span>
                <span>待领取利息</span>
              </div>
              {reserveOrderData[tab].map((row, index) => (
                <div
                  key={`${row.time}-${tab}-${index}`}
                  className="grid grid-cols-[1.25fr_1fr_0.9fr_0.9fr_1fr] items-center border-t border-white/8 px-8 py-8 text-[22px] text-zinc-300"
                >
                  <span>{row.time}</span>
                  <span>{row.asset}</span>
                  <span>{row.amount}</span>
                  <span>{row.apr}</span>
                  <span>{row.claimableInterest}</span>
                </div>
              ))}
            </>
          ) : null}

          <div className="px-8 pb-8">
            <RealRwaPagination />
          </div>
        </div>
      </PortfolioPageFrame>
    </RealRwaShell>
  );
}

export function InvitationPageV2() {
  const { walletConnected, identityBound } = useRwaAppState();
  const [activeTab, setActiveTab] = useState<InvitationTableTab>("invitees");
  const [detailModalTab, setDetailModalTab] = useState<InvitationDetailTab | null>(null);
  const [keyword, setKeyword] = useState("");
  const [copiedField, setCopiedField] = useState<"code" | "link" | null>(null);

  const inviteCode = "REAL744";
  const inviteLink = `https://www.realfinance.cc/home?inviteCode=${inviteCode}`;
  const canShowDashboard = walletConnected && identityBound;

  const filteredInvitees = useMemo(
    () =>
      invitationInviteeRows.filter((row) =>
        row.address.toLowerCase().includes(keyword.trim().toLowerCase())
      ),
    [keyword]
  );

  const copyValue = async (value: string, field: "code" | "link") => {
    await navigator.clipboard?.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 1500);
  };

  const rightAction = null;

  return (
    <RealRwaShell activeNav={6} topNavRightAction={rightAction}>
      <section className="min-w-[1120px] border-b border-white/6 bg-black">
        <div className="mx-auto max-w-[1080px] px-0 pb-[84px] pt-[30px]">
          <div className="max-w-[980px] py-5">
            <div>
              <h1 className="text-[34px] font-medium leading-[48px] text-white" style={invitationTitleTypography}>
                邀请好友，共享资产收益
              </h1>
              <p
                className="mt-3 max-w-[980px] text-[15px] leading-6 text-white/60"
                style={invitationBodyTypography}
              >
                每邀请一位合格好友完成资产申购，即可累计 USDC 返佣与 iReal 积分奖励。
              </p>
            </div>
          </div>

          <div className="relative mt-[38px] min-h-[218px] overflow-hidden rounded-[16px] px-0 py-5">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4B3B1E]/35" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4B3B1E]/30" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4B3B1E]/25" />
            {canShowDashboard ? (
              <div className="relative z-[1] grid grid-cols-[minmax(0,480px)_1fr] items-start gap-[42px]">
                <div className="space-y-4">
                  <div>
                    <p className="mb-1.5 text-[13px] font-semibold leading-5 text-white/42">邀请码</p>
                    <div className="flex h-[48px] items-center justify-between rounded-[9px] border border-white/13 bg-[#252523]/95 px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <span className="font-mono text-[20px] font-semibold leading-none text-white/88">
                        {inviteCode}
                      </span>
                      <button
                        type="button"
                        className="grid size-6 place-items-center text-white/55 transition hover:text-white"
                        onClick={() => copyValue(inviteCode, "code")}
                        aria-label={copiedField === "code" ? "已复制邀请码" : "复制邀请码"}
                      >
                        <Copy className="size-[18px]" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 text-[13px] font-semibold leading-5 text-white/42">邀请链接</p>
                    <div className="flex h-[48px] items-center justify-between rounded-[9px] border border-white/13 bg-[#252523]/95 px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <span className="truncate pr-5 text-[17px] font-semibold leading-none text-white/88">
                        {inviteLink}
                      </span>
                      <button
                        type="button"
                        className="grid size-6 shrink-0 place-items-center text-white/55 transition hover:text-white"
                        onClick={() => copyValue(inviteLink, "link")}
                        aria-label={copiedField === "link" ? "已复制邀请链接" : "复制邀请链接"}
                      >
                        <Copy className="size-[18px]" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <div className="flex items-start gap-6">
                    {[
                      { label: "Twitter", Icon: Twitter },
                      { label: "Telegram", Icon: Send },
                      { label: "二维码", Icon: QrCode },
                      { label: "更多", Icon: MoreHorizontal },
                    ].map(({ label, Icon }) => (
                      <button
                        key={label}
                        type="button"
                        className="group flex flex-col items-center gap-2.5 text-[13px] font-semibold leading-5 text-white/48 transition hover:text-white/80"
                      >
                        <span>{label}</span>
                        <span className="grid size-[48px] place-items-center rounded-full border border-white/12 bg-[#171716]/75 text-[23px] font-medium leading-none text-white/85 transition group-hover:border-white/22 group-hover:bg-[#22221F]">
                          <Icon className="size-[23px] stroke-[1.75]" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-[1] flex min-h-[490px] items-center justify-center text-center">
                <div>
                  <h2
                    className="mx-auto w-fit text-[40px] font-bold leading-[60px] text-white"
                    style={invitationTitleTypography}
                  >
                    放大您的财富网络
                  </h2>
                  <p
                    className="mx-auto mt-[38px] w-[500px] text-[20px] font-medium leading-[30px] text-white/60"
                    style={invitationBodyTypography}
                  >
                    一键生成专属推广链接与海报，即刻开启您的链上收益。
                  </p>
                  <button
                    type="button"
                    className="real-gold-btn mt-10 inline-flex h-10 items-center rounded-[10px] px-5 text-[14px] font-medium leading-5"
                    style={invitationButtonTypography}
                    onClick={() => triggerAuthGate(walletConnected, identityBound)}
                  >
                    连接钱包开启
                  </button>
                </div>
              </div>
            )}
          </div>

          {canShowDashboard ? (
            <>
              <section className="relative mt-[42px] overflow-hidden rounded-[10px] border border-white/12 bg-[#111111] px-5 py-5">
                <div className="pointer-events-none absolute -right-4 -top-20 h-[220px] w-[360px] opacity-35">
                  <div className="absolute right-0 top-0 h-[210px] w-[210px] rounded-full border border-[#4E45FF]/80" />
                  <div className="absolute right-[74px] top-[36px] h-[160px] w-[160px] rounded-full border border-dashed border-[#6A4B1E]/70" />
                  <div className="absolute right-[126px] top-[78px] h-[96px] w-[96px] rounded-full border border-dashed border-[#6A4B1E]/70" />
                </div>
                <div className="relative z-[1] grid grid-cols-[140px_158px_168px_190px_160px_116px] justify-start gap-4">
                  {[
                    ["邀请等级", invitationSummary.level, ""],
                    ["返佣总金额", invitationSummary.totalCommissionUsdc, "USDC"],
                    ["利率佣金总额", invitationSummary.rateCommissionUsdc, "USDC"],
                    ["积分佣金总额", invitationSummary.pointsCommissionReal, "iReal"],
                    ["人头佣金总额", invitationSummary.headcountCommissionUsdc ?? "--", "USDC"],
                    ["合格邀请人数", invitationSummary.qualifiedInvitees, "人"],
                  ].map(([label, value, suffix]) => (
                    <div key={label} className="min-w-0">
                      <div className="whitespace-nowrap text-[13px] font-semibold leading-5 text-white/52">{label}</div>
                      <p className="mt-2.5 inline-flex max-w-full items-baseline rounded-[4px] bg-white/[0.08] px-2 py-0.5 font-mono text-[21px] font-bold leading-none text-white">
                        {value}
                        {suffix ? <span className="ml-1.5 whitespace-nowrap text-[15px] font-semibold text-white/60">{suffix}</span> : null}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-[24px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    {[
                      ["invitees", "被邀请人"],
                      ["assetRewards", "利率返佣"],
                      ["headcountRewards", "人头奖励"],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        className={`h-[36px] rounded-full px-5 text-[15px] font-semibold transition ${
                          activeTab === key ? "bg-[#1B1B1B] text-white" : "text-white/42 hover:text-white/68"
                        }`}
                        onClick={() => setActiveTab(key as InvitationTableTab)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {activeTab === "invitees" ? (
                    <div className="relative w-[300px]">
                      <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="请输入受邀人地址"
                        className="h-9 rounded-[8px] border border-white/10 bg-black pl-3.5 pr-9 text-[13px] text-white placeholder:text-white/24"
                      />
                      <Search className="absolute right-3.5 top-1/2 size-[18px] -translate-y-1/2 text-white/35" />
                    </div>
                  ) : null}
                </div>

                <div className="mt-[22px] overflow-hidden rounded-[8px] border border-white/8 bg-[#101010]">
                  {activeTab === "invitees" ? (
                    <>
                      <div className="grid h-[52px] grid-cols-[1.35fr_1fr_1fr_0.65fr] items-center bg-[#1A1A1A] px-5 text-[15px] font-semibold text-white/50">
                        <span>被邀请人地址</span>
                        <span>注册时间</span>
                        <span>总交易额</span>
                        <span>操作</span>
                      </div>
                      {filteredInvitees.length > 0 ? (
                        filteredInvitees.map((row, index) => (
                          <div
                            key={`${row.address}-${index}`}
                            className="grid grid-cols-[1.35fr_1fr_1fr_0.65fr] items-center border-t border-white/8 px-5 py-4 text-[14px] text-zinc-300"
                          >
                            <span>{row.address}</span>
                            <span>{row.registeredAt}</span>
                            <span>{row.volume}</span>
                            <div className="flex justify-start">
                              <button
                                type="button"
                                className="h-8 rounded-[9px] border border-white/18 px-3.5 text-[13px] text-white transition hover:border-white/32 hover:bg-white/[0.04]"
                                onClick={() => setDetailModalTab("invitees")}
                              >
                                详情
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <InvitationEmptyState />
                      )}
                    </>
                  ) : activeTab === "assetRewards" ? (
                    <>
                      <div className="grid h-[52px] grid-cols-[1.12fr_0.9fr_0.95fr_1fr_1fr_0.65fr] items-center bg-[#1A1A1A] px-5 text-[15px] font-semibold text-white/50">
                        <span>奖励发放时间</span>
                        <span>本次奖励等级</span>
                        <span>合格受邀人数</span>
                        <span>利率佣金总额</span>
                        <span>积分佣金总额</span>
                        <span>操作</span>
                      </div>
                      {invitationRewardRows.length > 0 ? (
                        invitationRewardRows.map((row) => (
                          <div
                            key={row.id}
                            className="grid grid-cols-[1.12fr_0.9fr_0.95fr_1fr_1fr_0.65fr] items-center border-t border-white/8 px-5 py-4 text-[14px] text-zinc-300"
                          >
                            <span>{row.issuedAt}</span>
                            <span>{row.level}</span>
                            <span>{row.qualifiedInvitees}</span>
                            <span>{row.rateCommissionUsdc}</span>
                            <span>{row.pointsCommissionReal}</span>
                            <div className="flex justify-start">
                              <button
                                type="button"
                                className="h-8 rounded-[9px] border border-white/18 px-3.5 text-[13px] text-white transition hover:border-white/32 hover:bg-white/[0.04]"
                                onClick={() => setDetailModalTab("orders")}
                              >
                                详情
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <InvitationEmptyState />
                      )}
                    </>
                  ) : (
                    <>
                      <div className="grid h-[52px] grid-cols-[1.12fr_0.9fr_0.95fr_1fr_1fr] items-center bg-[#1A1A1A] px-5 text-[15px] font-semibold text-white/50">
                        <span>奖励发放时间</span>
                        <span>本次奖励等级</span>
                        <span>合格受邀人数</span>
                        <span>人头佣金总额</span>
                        <span>发放状态</span>
                      </div>
                      {invitationHeadcountRewardRows.length > 0 ? (
                        invitationHeadcountRewardRows.map((row) => (
                          <div
                            key={row.id}
                            className="grid grid-cols-[1.12fr_0.9fr_0.95fr_1fr_1fr] items-center border-t border-white/8 px-5 py-4 text-[14px] text-zinc-300"
                          >
                            <span>{row.issuedAt}</span>
                            <span>{row.level}</span>
                            <span>{row.qualifiedInvitees}</span>
                            <span>{row.headcountCommissionUsdc}</span>
                            <span>{row.status}</span>
                          </div>
                        ))
                      ) : (
                        <InvitationEmptyState />
                      )}
                    </>
                  )}
                  <div className="px-5 pb-5 pt-2">
                    <RealRwaPagination />
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="-mt-20 text-center">
              <h2
                className="mx-auto w-fit text-center text-[40px] font-medium leading-[60px] text-white"
                style={invitationTitleTypography}
              >
                连接钱包查看邀请奖励
              </h2>
              <button
                type="button"
                className="real-gold-btn mt-10 inline-flex h-10 items-center rounded-[10px] px-5 text-[14px] font-medium leading-5"
                style={invitationButtonTypography}
                onClick={() => triggerAuthGate(walletConnected, identityBound)}
              >
                连接钱包
              </button>
            </section>
          )}
        </div>
      </section>

      <RealRwaFooter />
      <InvitationCommissionDetailModal
        activeTab={detailModalTab}
        onTabChange={setDetailModalTab}
        onClose={() => setDetailModalTab(null)}
      />
    </RealRwaShell>
  );
}
