"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Calendar,
  SearchX,
  ChevronDown,
  ChartColumnBig,
  Flame,
  Info,
  LockKeyhole,
  ReceiptText,
  ScrollText,
  Search,
  ShieldCheck,
  Star,
  Target,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OPEN_IDENTITY_VERIFICATION_EVENT, RealRwaShell } from "@/projects/realrwa-demo/components/realrwa/shell";
import {
  BuyModal,
  ClaimModal,
  RedeemModal,
  SellModal,
  StakeModal,
  WithdrawModal,
} from "@/projects/realrwa-demo/components/realrwa/modals";
import {
  InsuranceProjectCard,
  InsuranceStatusRail,
} from "@/projects/realrwa-demo/components/realrwa/insurance-section";
import { useInsuranceDemo } from "@/projects/realrwa-demo/components/realrwa/insurance-demo-provider";
import { InsuranceDemoPanels } from "@/projects/realrwa-demo/components/realrwa/insurance-demo-panels";
import { PortfolioSidebar } from "@/projects/realrwa-demo/components/realrwa/portfolio-sidebar";
import { formatMoney } from "@/projects/realrwa-demo/lib/realrwa-i18n";
import { REALRWA_ROUTES } from "@/projects/realrwa-demo/lib/realrwa-routes";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import {
  INSURANCE_FAQ_ITEMS,
  getInsuranceStatusText,
} from "@/projects/realrwa-demo/lib/realrwa-insurance";

type TradeMarketCard = {
  id: string;
  symbol: string;
  issuerCn: string;
  issuerEn: string;
  iconUrl: string;
  apr: string;
  price: string;
  approx: string;
  tagCn: string;
  tagEn: string;
  descCn: string;
  descEn: string;
  sold: string;
  supply: string;
  soldProgress: string;
  issuerFullCn: string;
  issuerFullEn: string;
  issueTimeCn: string;
  issueTimeEn: string;
  maturityCn: string;
  maturityEn: string;
  issueSize: string;
  minBuy: string;
  presale?: boolean;
};

type BuyModalAsset = {
  symbol: string;
  iconUrl?: string;
};

const TRADE_MARKET_CARDS: TradeMarketCard[] = [
  {
    id: "rSDCT",
    symbol: "rSDCT",
    issuerCn: "商都城投",
    issuerEn: "Shangdu Urban Investment",
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rSDCT.png",
    apr: "7.90",
    price: "1.00",
    approx: "1.0000 USDC",
    tagCn: "质押收益（票息和积分按日）",
    tagEn: "Staking yield (coupon and points settle daily)",
    descCn:
      "1、发行币种：RMB；2、该债券发行总规模：4.8亿人民币；3、利率类型：固定利率；4、付息频率：到期一次还本付息；5、债券类型：标准企业债；6、一级定价日：2025年8月12日；7、发行方式：簿记建档。",
    descEn:
      "1. Currency: RMB; 2. Total issuance: RMB 480M; 3. Fixed-rate bond; 4. Principal and coupon paid at maturity; 5. Standard corporate bond; 6. Primary pricing date: Aug 12, 2025; 7. Issued via book building.",
    sold: "2.00",
    supply: "1.46M",
    soldProgress: "0%",
    issuerFullCn: "商都城投",
    issuerFullEn: "Shangdu Urban Investment",
    issueTimeCn: "2025-08-12",
    issueTimeEn: "2025-08-12",
    maturityCn: "2026-08-11",
    maturityEn: "2026-08-11",
    issueSize: "$1.46M",
    minBuy: "1.0000 rSDCT",
  },
  {
    id: "rXWCT",
    symbol: "rXWCT",
    issuerCn: "兴财城投",
    issuerEn: "Xingcai Urban Investment",
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rXWCT.png",
    apr: "8.00",
    price: "1.00",
    approx: "1.0000 USDC",
    tagCn: "质押收益（票息和积分按日）",
    tagEn: "Staking yield (coupon and points settle daily)",
    descCn:
      "1、发行币种：RMB；2、该债券发行总规模：1.745亿人民币；3、利率类型：固定利率；4、付息频率：到期一次还本付息；5、债券类型：标准企业债；6、一级定价日：2025年11月14日；7、发行方式：簿记建档。",
    descEn:
      "1. Currency: RMB; 2. Total issuance: RMB 174.5M; 3. Fixed-rate bond; 4. Principal and coupon paid at maturity; 5. Standard corporate bond; 6. Primary pricing date: Nov 14, 2025; 7. Issued via book building.",
    sold: "4.44K",
    supply: "440.00K",
    soldProgress: "1.01%",
    issuerFullCn: "兴财城投",
    issuerFullEn: "Xingcai Urban Investment",
    issueTimeCn: "2025-11-14",
    issueTimeEn: "2025-11-14",
    maturityCn: "2026-11-13",
    maturityEn: "2026-11-13",
    issueSize: "$440.00K",
    minBuy: "1.0000 rXWCT",
  },
  {
    id: "rFUIDL",
    symbol: "rFUIDL",
    issuerCn: "复星财富控股",
    issuerEn: "Fosun Wealth Holdings",
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rFUIDL.png",
    apr: "3.90",
    price: "1.00",
    approx: "1.0000 USDC",
    tagCn: "Bybit合约保证金，按月派U",
    tagEn: "Bybit margin eligible, monthly USDT distribution",
    descCn:
      "核心优势 1、梅隆银行货币基金（MMF）底层锚定经验严格筛选的国际AAA投资级优质资产，底层资产定位清晰，风险属性明确，切合美元资产保值与流动性管理需求。2、链上化美元流动性工具通过代币形式提升资金可组合性。",
    descEn:
      "Core strengths: 1. A Mellon-bank money market fund structure anchored to carefully screened international AAA investment-grade assets; 2. A tokenized USD liquidity tool designed for preservation, clarity, and composability.",
    sold: "0.00",
    supply: "999.00M",
    soldProgress: "0%",
    issuerFullCn: "复星财富控股",
    issuerFullEn: "Fosun Wealth Holdings",
    issueTimeCn: "开放式",
    issueTimeEn: "Open-ended",
    maturityCn: "无到期日",
    maturityEn: "No maturity",
    issueSize: "$999.00M",
    minBuy: "1.0000 rFUIDL",
    presale: true,
  },
];

const STAKED_SUMMARY_ITEMS = [
  { key: "tvs", labelCn: "TVS", labelEn: "TVS", value: "$4.41K" },
  { key: "apr", labelCn: "APR", labelEn: "APR", value: "8.00 %" },
  { key: "rewards", labelCn: "累计奖励", labelEn: "Cumulative Reward", value: "$1.20" },
] as const;

const STAKED_CHART_VALUES = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4.41, 4.41, 4.41, 4.41, 4.41,
] as const;

const STAKED_TABLE_ROWS = [
  {
    symbol: "rXWCT",
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rXWCT.png",
    issuerCn: "Asset USD",
    issuerEn: "Asset USD",
    totalStake: "4.42K rXWCT",
    totalStakeUsd: "$4.41K",
    apr: "8.00%",
    rwaReward: "1.20 USDC",
    rwaRewardUsd: "$1.20",
    realReward: "412.45K iREAL",
    realRewardUsd: "$0.00",
    unclaimed: "$1.20",
  },
  {
    symbol: "rSDCT",
    iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rSDCT.png",
    issuerCn: "Asset USD",
    issuerEn: "Asset USD",
    totalStake: "0.00 rSDCT",
    totalStakeUsd: "$0.00",
    apr: "7.90%",
    rwaReward: "0.00 USDC",
    rwaRewardUsd: "$0.00",
    realReward: "4.62K iREAL",
    realRewardUsd: "$0.00",
    unclaimed: "$0.00",
  },
] as const;

const APP_FOOTER_COLUMNS = [
  {
    titleCn: "关于",
    titleEn: "About",
    itemsCn: ["白皮书", "RWA 资讯", "用户协议"],
    itemsEn: ["Whitepaper", "RWA News", "Terms"],
  },
  {
    titleCn: "产品",
    titleEn: "Product",
    itemsCn: ["交易", "质押", "借贷"],
    itemsEn: ["Trade", "Staking", "Lending"],
  },
  {
    titleCn: "服务",
    titleEn: "Service",
    itemsCn: ["保险", "邀请", "OTC"],
    itemsEn: ["Insurance", "Invitation", "OTC"],
  },
  {
    titleCn: "推荐",
    titleEn: "Recommended",
    itemsCn: ["社区", "公告", "帮助中心"],
    itemsEn: ["Community", "Announcements", "Help Center"],
  },
] as const;

const PRIMARY_BOND_DETAIL = {
  symbol: "rXWCT",
  issuer: "兴财城投",
  icon: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rXWCT.png",
  tags: ["Bybit 合约保证金", "债券型底层资产"],
  settlement: "USDC",
  price: "1.0008",
  approx: "1.00228 USDC",
  apr: "10.05",
  volume: "440.00K",
  balance: "12,700,274.223",
  balanceUnit: "AUSD",
  balanceUsd: "$ 12,700,274.22",
  staked: "4.4200",
  stakedUnit: "rXWCT",
  stakedUsd: "$ 4.41K",
  rewards: "100,000.01",
  rewardsUnit: "USDC",
  claimable: "120,000.01",
  claimableUnit: "AUSD",
  description:
    "rSDCT offers access to an RMB-denominated standard corporate bond with a fixed-rate structure. Principal and interest are paid at maturity, making it suitable for conservative on-chain income allocation.",
  issuerFull: "兴财城投",
  issueTime: "Mon 04, Mar 2024",
  duration: "1 Years",
  issueScale: "11,220.00 AUSD",
  minBuy: "10.00 AUSD",
  marketCap: "11,220.00 AUSD",
  scheduleDate: "2025-11-06 14:00:00",
  chartUpperBound: 120,
  chartPoints: [
    { label: "2026-02-23", staked: 0.2, apr: 0 },
    { label: "2026-02-27", staked: 0.2, apr: 0 },
    { label: "2026-03-02", staked: 0.25, apr: 0 },
    { label: "2026-03-07", staked: 0.25, apr: 0 },
    { label: "2026-03-12", staked: 0.3, apr: 0 },
    { label: "2026-03-18", staked: 0.3, apr: 0 },
    { label: "2026-03-22", staked: 0.35, apr: 0 },
    { label: "2026-03-25", staked: 0.35, apr: 0 },
  ],
} as const;

const MOBILE_HOLDER_ROWS = [
  { address: "HuAo39ee...93ujhMq1", amount: "785.19", age: "1s" },
  { address: "HuAo39ee...93ujhMq1", amount: "785.19", age: "3m" },
  { address: "HuAo39ee...93ujhMq1", amount: "785.19", age: "4h" },
  { address: "HuAo39ee...93ujhMq1", amount: "785.19", age: "1d" },
  { address: "HuAo39ee...93ujhMq1", amount: "785.19", age: "30d" },
] as const;

export function TradeHomePage() {
  return <TradingLandingPage activeNav={0} />;
}

export function MarketPage() {
  const router = useRouter();
  const [marketTab, setMarketTab] = useState<"watchlist" | "yield" | "new">("new");
  const marketRows = [
    {
      symbol: "rXWCT",
      iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rXWCT.png",
      issuer: "Asset USD",
      marketCap: "$439.87K",
      apr: "8%",
      volume: "$4.45K",
      totalSupply: "440.00K",
      circulatingSupply: "435.56K",
    },
    {
      symbol: "rSDCT",
      iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rSDCT.png",
      issuer: "Asset USD",
      marketCap: "$1.46M",
      apr: "7.9%",
      volume: "$46.99",
      totalSupply: "1.46M",
      circulatingSupply: "1.46M",
    },
  ] as const;
  return (
    <RealRwaShell activeNav={1}>
      {/* 顶部横幅展位 */}
      <section className="bg-black pt-8 pb-4">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-8">
          <div className="mb-4 overflow-hidden rounded-[18px] border border-white/8 bg-[linear-gradient(120deg,rgba(13,13,14,0.98)_0%,rgba(19,16,11,0.95)_48%,rgba(45,28,11,0.84)_100%)] p-4 md:hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="max-w-[220px]">
                <p className="text-[12px] uppercase tracking-[0.26em] text-[#d8ab4d]">REAL FINANCE</p>
                <h2 className="mt-2 text-[22px] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
                  债券资产列表
                </h2>
                <p className="mt-2 text-[12px] leading-5 text-zinc-400">
                  在手机端优先浏览核心价格、APR 与购买入口，低频信息留到详情页查看。
                </p>
              </div>
              <div className="relative mt-1 h-16 w-16 shrink-0 rounded-2xl border border-[#e0b852]/18 bg-[radial-gradient(circle_at_35%_30%,rgba(240,196,86,0.28),transparent_30%),linear-gradient(180deg,rgba(26,22,16,0.96),rgba(12,12,12,0.96))]">
                <div className="absolute inset-[12px] rounded-xl border border-white/10" />
              </div>
            </div>
          </div>
          <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden hidden gap-4 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible md:gap-6">
            <div className="h-[120px] min-w-[280px] rounded-[16px] border border-white/5 bg-[linear-gradient(135deg,rgba(40,30,80,0.5),rgba(17,17,17,0.9))] md:min-w-0"></div>
            <div className="h-[120px] min-w-[280px] rounded-[16px] border border-white/5 bg-[#111111] md:min-w-0"></div>
            <div className="h-[120px] min-w-[280px] rounded-[16px] border border-white/5 bg-[#111111] md:min-w-0"></div>
          </div>
        </div>
      </section>

      {/* 下沉操控区 (Tabs + Search) */}
      <section className="bg-black py-4">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-8">
          <div className="flex flex-col gap-3 rounded-[16px] border border-white/5 bg-[#111111] px-4 py-4 md:h-[72px] md:flex-row md:items-center md:justify-between md:px-5 md:py-0">
            <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex items-center gap-2 overflow-x-auto">
              <button
                className={`shrink-0 rounded-lg px-4 py-2 text-[14px] font-medium transition-colors md:px-6 md:text-[15px] ${
                  marketTab === "watchlist" ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setMarketTab("watchlist")}
              >
                自选
              </button>
              <button
                className={`shrink-0 rounded-lg px-4 py-2 text-[14px] font-medium transition-colors md:px-6 md:text-[15px] ${
                  marketTab === "yield" ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setMarketTab("yield")}
              >
                收益榜
              </button>
              <button
                className={`shrink-0 rounded-lg px-4 py-2 text-[14px] font-medium transition-colors md:px-6 md:text-[15px] ${
                  marketTab === "new" ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setMarketTab("new")}
              >
                新币榜
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="请输入"
                className="w-full rounded-[10px] border border-white/10 bg-transparent py-2.5 pl-4 pr-10 text-[14px] text-white placeholder:text-zinc-600 transition-colors focus:border-white/20 focus:outline-none md:w-[300px]"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-[18px] text-zinc-500" />
            </div>
          </div>
        </div>
      </section>

      {/* 核心市场交易宽表 */}
      <section className="bg-black py-4 pb-24">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-8">
          <div className="rounded-[16px] bg-[#111111] pb-6 border border-white/5">
            <div className="space-y-4 p-4 md:hidden">
              {marketRows.map((row) => (
                <article key={row.symbol} className="rounded-[16px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-[42px] overflow-hidden rounded-full border border-[#d2a353]/30 bg-[#16130d] p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={row.iconUrl} className="size-full rounded-full object-cover" alt={row.symbol} />
                      </div>
                      <div>
                        <div className="text-[16px] font-semibold tracking-wide text-[#32d4d4]">{row.symbol}</div>
                        <div className="mt-0.5 text-[12px] text-zinc-600">{row.issuer}</div>
                      </div>
                    </div>
                    <span className="rounded bg-[#a07e2a]/20 px-2 py-0.5 text-[13px] font-medium text-[#e0b852]">{row.apr}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-3">
                      <p className="text-[12px] text-zinc-500">市值</p>
                      <p className="mt-1 text-[14px] text-white">{row.marketCap}</p>
                    </div>
                    <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-3">
                      <p className="text-[12px] text-zinc-500">成交量 (24h)</p>
                      <p className="mt-1 text-[14px] text-white">{row.volume}</p>
                    </div>
                  </div>
                  <details className="mt-3">
                    <summary className="list-none rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] text-zinc-300">
                      更多指标
                    </summary>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-2.5">
                        <p className="text-[11px] text-zinc-500">总供应量</p>
                        <p className="mt-1 text-[13px] text-white">{row.totalSupply}</p>
                      </div>
                      <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-2.5">
                        <p className="text-[11px] text-zinc-500">流通供应量</p>
                        <p className="mt-1 text-[13px] text-white">{row.circulatingSupply}</p>
                      </div>
                    </div>
                  </details>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      className="rounded border border-white/20 px-4 py-2.5 text-[13px] text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
                      onClick={() => router.push(REALRWA_ROUTES.homeDetail)}
                    >
                      Detail
                    </button>
                    <button className="rounded border border-[#c8a24d]/60 bg-[#1f1708] px-4 py-2.5 text-[13px] text-[#e7c56f] transition-colors hover:bg-[#2a1f0c]">
                      购买
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-[14px] whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500">
                    <th className="py-5 pl-8 font-medium">债券</th>
                    <th className="py-5 font-medium">市值</th>
                    <th className="py-5 font-medium">APR</th>
                    <th className="py-5 font-medium">成交量 (24h)</th>
                    <th className="py-5 font-medium">总供应量</th>
                    <th className="py-5 font-medium">流通供应量</th>
                    <th className="py-5 pr-8 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {/* Row 1 - rXWCT */}
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 pl-8">
                      <div className="flex items-center gap-6">
                        <button className="text-zinc-500 hover:text-zinc-300">
                          <Star className="size-[18px]" />
                        </button>
                        <div className="flex items-center gap-3">
                          <div className="size-[42px] overflow-hidden rounded-full border border-[#d2a353]/30 bg-[#16130d] p-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rXWCT.png" className="size-full rounded-full object-cover" alt="icon" />
                          </div>
                          <div>
                            <div className="text-[16px] font-semibold tracking-wide text-[#32d4d4]">rXWCT</div>
                            <div className="mt-0.5 text-[12px] text-zinc-600">Asset USD</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 tracking-wide text-white">$439.87K</td>
                    <td className="py-5">
                      <span className="rounded bg-[#a07e2a]/20 px-2 py-0.5 text-[13px] font-medium text-[#e0b852]">8%</span>
                    </td>
                    <td className="py-5 tracking-wide text-white">$4.45K</td>
                    <td className="py-5 tracking-wide text-white">440.00K</td>
                    <td className="py-5 tracking-wide text-white">435.56K</td>
                    <td className="py-5 pr-8 text-right">
                      <button className="rounded border border-white/20 px-5 py-1.5 text-[13px] text-zinc-200 transition-colors hover:bg-white/10 hover:text-white">
                        购买
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 - rSDCT */}
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 pl-8">
                      <div className="flex items-center gap-6">
                        <button className="text-zinc-500 hover:text-zinc-300">
                          <Star className="size-[18px]" />
                        </button>
                        <div className="flex items-center gap-3">
                          <div className="size-[42px] overflow-hidden rounded-full border border-[#d2a353]/30 bg-[#16130d] p-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rSDCT.png" className="size-full rounded-full object-cover" alt="icon" />
                          </div>
                          <div>
                            <div className="text-[16px] font-semibold tracking-wide text-[#32d4d4]">rSDCT</div>
                            <div className="mt-0.5 text-[12px] text-zinc-600">Asset USD</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 tracking-wide text-white">$1.46M</td>
                    <td className="py-5">
                      <span className="rounded bg-[#a07e2a]/20 px-2 py-0.5 text-[13px] font-medium text-[#e0b852]">7.9%</span>
                    </td>
                    <td className="py-5 tracking-wide text-white">$46.99</td>
                    <td className="py-5 tracking-wide text-white">1.46M</td>
                    <td className="py-5 tracking-wide text-white">1.46M</td>
                    <td className="py-5 pr-8 text-right">
                      <button className="rounded border border-white/20 px-5 py-1.5 text-[13px] text-zinc-200 transition-colors hover:bg-white/10 hover:text-white">
                        购买
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex justify-start px-4 md:mt-8 md:justify-end md:px-0 md:pr-8">
              <div className="text-[12px] text-zinc-600">更新时间: 2026-04-02T16:29:08.068</div>
            </div>
          </div>
        </div>
      </section>

      <MobileTradeBottomNav active="market" />
    </RealRwaShell>
  );
}

function TradingLandingPage({ activeNav }: { activeNav: number }) {
  const { lang, text, identityBound } = useRwaAppState();
  const router = useRouter();
  const [buyOpen, setBuyOpen] = useState(false);
  const [stakeOpen, setStakeOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedBuyAsset, setSelectedBuyAsset] = useState<BuyModalAsset>(() => ({
    symbol: TRADE_MARKET_CARDS[0]?.symbol ?? "rSDCT",
    iconUrl: TRADE_MARKET_CARDS[0]?.iconUrl,
  }));

  const onBuyAttempt = (asset: BuyModalAsset) => {
    if (!identityBound) {
      window.dispatchEvent(new Event(OPEN_IDENTITY_VERIFICATION_EVENT));
      return;
    }
    setSelectedBuyAsset(asset);
    setBuyOpen(true);
  };

  const filteredCards = TRADE_MARKET_CARDS.filter((item) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return true;
    }
    return [
      item.symbol,
      item.issuerCn,
      item.issuerEn,
      item.tagCn,
      item.tagEn,
      item.descCn,
      item.descEn,
    ].some((value) =>
      value.toLowerCase().includes(normalized)
    );
  });

  return (
    <RealRwaShell activeNav={activeNav}>
      <section className="bg-[#050505]">
        <div className="mx-auto max-w-[1240px] px-6 pb-14 pt-8 lg:px-8">
          <div className="hidden md:block">
            <h2 className="text-[34px] font-semibold tracking-[-0.04em] text-white">
              {lang === "cn" ? "市场" : "Market"}
            </h2>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-white/8 bg-[linear-gradient(120deg,rgba(11,11,12,0.98)_0%,rgba(18,15,12,0.94)_52%,rgba(52,34,15,0.78)_100%)] p-4 md:hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="max-w-[220px]">
                <p className="text-[12px] uppercase tracking-[0.28em] text-[#d4a64b]">REAL FINANCE</p>
                <h2 className="mt-2 text-[24px] font-semibold leading-[1.02] tracking-[-0.05em] text-white">
                  {lang === "cn" ? "债券产品列表" : "Bond Market"}
                </h2>
                <p className="mt-2 text-[12px] leading-5 text-zinc-400">
                  {lang === "cn"
                    ? "优先查看收益、价格与申购入口。低频明细进入 Detail 页面查看。"
                    : "Focus on APR, price, and the subscription entry first. Move deeper info into Detail."}
                </p>
              </div>
              <div className="relative h-[72px] w-[72px] shrink-0 rounded-[20px] border border-[#d4a64b]/18 bg-[radial-gradient(circle_at_34%_28%,rgba(244,201,74,0.26),transparent_30%),linear-gradient(180deg,rgba(18,18,18,0.96),rgba(10,10,10,0.96))]">
                <div className="absolute inset-[14px] rounded-[16px] border border-white/10" />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[16px] border border-white/6 bg-[#171717] p-3 md:mt-7 md:p-4">
            <label className="ml-auto flex h-11 w-full items-center gap-3 rounded-[12px] border border-white/10 bg-[#191919] px-4 text-zinc-400 md:h-12 md:max-w-[320px]">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={lang === "cn" ? "搜索代币" : "Search token"}
                className="h-full flex-1 bg-transparent text-[14px] text-white placeholder:text-zinc-600 focus:outline-none md:text-[15px]"
              />
              <Search className="size-5 text-zinc-500" />
            </label>
          </div>

          <div className="mt-5 grid gap-4 md:mt-6 md:gap-6 lg:grid-cols-2">
            {filteredCards.map((item) => {
            const issuer = lang === "cn" ? item.issuerCn : item.issuerEn;
            const tag = lang === "cn" ? item.tagCn : item.tagEn;
            const desc = lang === "cn" ? item.descCn : item.descEn;
            const issuerFull = lang === "cn" ? item.issuerFullCn : item.issuerFullEn;
            const issueTime = lang === "cn" ? item.issueTimeCn : item.issueTimeEn;
            const maturity = lang === "cn" ? item.maturityCn : item.maturityEn;

            return (
              <article
                key={item.id}
                className="relative flex min-h-0 flex-col overflow-hidden rounded-[14px] border border-white/12 bg-[linear-gradient(135deg,#111111_0%,#211b16_100%)] px-4 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] lg:min-h-[534px] lg:px-5 lg:py-6"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_4%,rgba(221,181,90,0.06),transparent_24%)]" />
                {item.presale ? (
                  <div className="pointer-events-none absolute right-6 top-6 hidden h-[118px] w-[118px] lg:block">
                    <div className="absolute inset-0 rounded-full border-[5px] border-white/18" />
                    <div className="absolute inset-[18px] rounded-full border border-dashed border-white/16" />
                    <div className="absolute left-1/2 top-1/2 w-[122px] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[10px] border-[4px] border-white/20 bg-[#242320]/60 px-4 py-2 text-center text-[22px] font-semibold tracking-[0.08em] text-white/34">
                      {lang === "cn" ? "预售" : "PRE-SALE"}
                    </div>
                  </div>
                ) : null}

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start gap-4">
                    <div className="grid size-[50px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#202123] ring-1 ring-white/8 md:size-[58px]">
                      {/* Remote token assets are served from jsDelivr and don't need Next image optimization here. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.iconUrl} alt={item.symbol} className="h-[36px] w-[36px] object-contain md:h-[42px] md:w-[42px]" loading="lazy" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[24px] font-medium leading-none tracking-[-0.04em] text-white md:text-[28px]">
                        {item.symbol}
                      </h3>
                      <p className="mt-1.5 text-[13px] text-zinc-500 md:mt-2 md:text-[15px]">{issuer}</p>
                      <span className="mt-3 inline-flex rounded-[10px] border border-white/12 bg-[#1f1f21] px-3 py-1.5 text-[12px] text-zinc-200 md:mt-4 md:text-[13px]">
                        {tag}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 lg:mt-8 lg:gap-8">
                    <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-3 md:border-0 md:bg-transparent md:px-0 md:py-0">
                      <div className="text-[12px] text-zinc-500 md:text-[14px]">
                        {lang === "cn" ? "质押年化收益率" : "Stake APR"}
                      </div>
                      <div className="mt-2 inline-flex items-end md:mt-3">
                        <span className="font-mono text-[26px] font-semibold leading-none tracking-[-0.04em] text-white md:text-[48px]">
                          {item.apr}
                        </span>
                        <span className="mb-[2px] ml-2 font-mono text-[15px] text-zinc-400 md:mb-[4px] md:text-[20px]">%</span>
                      </div>
                    </div>
                    <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-3 md:border-0 md:bg-transparent md:px-0 md:py-0">
                      <div className="text-[12px] text-zinc-400 md:text-[14px]">{lang === "cn" ? "价格" : "Price"}</div>
                      <div className="mt-2 inline-flex flex-wrap items-end md:mt-3">
                        <span className="mb-[2px] font-mono text-[15px] text-zinc-400 md:mb-[3px] md:text-[18px]">$</span>
                        <span className="ml-2 font-mono text-[26px] font-semibold leading-none tracking-[-0.04em] text-white md:text-[48px]">
                          {item.price}
                        </span>
                        <span className="mt-1 basis-full font-mono text-[11px] text-zinc-500 md:mt-0 md:ml-3 md:basis-auto md:text-[14px]">
                          ≈ {item.approx}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p
                    className="mt-4 hidden max-w-[560px] overflow-hidden text-[14px] leading-8 text-zinc-400 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:block"
                  >
                    {desc}
                  </p>

                  <div className="mt-4 rounded-[12px] bg-[#1d1d1f] p-3 md:p-4">
                    <div className="text-[13px] font-semibold leading-none text-[#f0c456] md:text-[14px]">{item.soldProgress}</div>
                    <div className="mt-2 ml-[2px] h-0 w-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-[#f0c456]" />
                    <div className="mt-3 h-[6px] rounded-full bg-white/14" />
                    <div className="mt-3 flex items-center justify-between text-[12px] text-zinc-400 md:mt-4 md:text-[14px]">
                      <span>{lang === "cn" ? "已售出：" : "Sold:"} {item.sold}</span>
                      <span>{lang === "cn" ? "总供应量：" : "Supply:"} {item.supply}</span>
                    </div>
                    <div className="mt-3 rounded-[10px] border border-white/8 bg-black/20 px-3 py-2.5 text-[12px] text-zinc-400 md:hidden">
                      <div className="flex items-center justify-between">
                        <span>Pool</span>
                        <span className="font-mono text-zinc-300">{item.issueSize}</span>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <p className="mt-3 text-[14px] font-medium text-zinc-300">
                        {lang === "cn" ? "价格趋势" : "Price Trend"}
                      </p>
                      <div className="mt-3 h-[70px] rounded-[2px] border-t border-[#cda531]/85 bg-[linear-gradient(180deg,rgba(205,165,49,0.28)_0%,rgba(205,165,49,0.12)_38%,rgba(33,33,35,1)_100%)]" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-zinc-400 md:hidden">
                    <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-3">
                      <p className="text-zinc-500">{lang === "cn" ? "发行方" : "Issuer"}</p>
                      <p className="mt-1 truncate text-zinc-200">{issuerFull}</p>
                    </div>
                    <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-3">
                      <p className="text-zinc-500">{lang === "cn" ? "起购" : "Minimum"}</p>
                      <p className="mt-1 font-mono text-zinc-200">{item.minBuy}</p>
                    </div>
                  </div>

                  <div className="mt-4 hidden grid-cols-2 gap-x-8 gap-y-2 text-[14px] text-zinc-400 md:grid">
                    <div className="flex items-center gap-2">
                      <span>{lang === "cn" ? "金融发行方：" : "Issuer:"}</span>
                      <span className="text-zinc-300">{issuerFull}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{lang === "cn" ? "发行时间：" : "Issue time:"}</span>
                      <span className="font-mono text-zinc-300">{issueTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{lang === "cn" ? "到期时间：" : "Maturity:"}</span>
                      <span className="font-mono text-zinc-300">{maturity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{lang === "cn" ? "发行规模：" : "Issue size:"}</span>
                      <span className="font-mono text-zinc-300">{item.issueSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{lang === "cn" ? "单次起购数量：" : "Min purchase:"}</span>
                      <span className="font-mono text-zinc-300">{item.minBuy}</span>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                    <Button
                      variant="outline"
                      className="h-[46px] rounded-[12px] border-white/24 bg-transparent text-[15px] font-semibold text-white hover:bg-white/5"
                      onClick={() => router.push(REALRWA_ROUTES.homeDetail)}
                    >
                      {text.details}
                    </Button>
                    <Button
                      className={`h-[46px] rounded-[12px] text-[15px] font-semibold ${
                        item.presale
                          ? "cursor-not-allowed bg-[#3a3a3d] text-zinc-500 hover:bg-[#3a3a3d]"
                          : "bg-[#caa24d] text-black hover:bg-[#ddb458]"
                      }`}
                      onClick={item.presale ? undefined : () => onBuyAttempt({
                        symbol: item.symbol,
                        iconUrl: item.iconUrl,
                      })}
                      disabled={item.presale}
                    >
                      {text.buy}
                    </Button>
                  </div>
                </div>
              </article>
            );
            })}
          </div>

          {filteredCards.length === 0 ? (
            <div className="mt-6 rounded-[18px] border border-white/8 bg-[#101010] px-6 py-14 md:mt-8 md:py-16">
              <div className="mx-auto flex max-w-[320px] flex-col items-center">
                <div className="grid h-[99px] w-[121px] place-items-center rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
                  <SearchX className="size-10 text-zinc-500" strokeWidth={1.6} />
                </div>
                <p className="mt-4 text-[16px] font-medium text-zinc-300">
                  {lang === "cn" ? "暂无匹配结果" : "No matching result"}
                </p>
                <p className="mt-2 text-center text-[12px] leading-6 text-zinc-500">
                  {lang === "cn"
                    ? "请尝试其他关键词，或返回市场列表查看全部债券资产。"
                    : "Try another keyword or return to the market list to view all assets."}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <MobileTradeBottomNav active="market" />

      <BuyModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        platformBalance={10.0001}
        assetSymbol={selectedBuyAsset.symbol}
        assetIcon={selectedBuyAsset.iconUrl}
        onStakeNow={() => setStakeOpen(true)}
      />
      <StakeModal
        open={stakeOpen}
        onClose={() => setStakeOpen(false)}
        onBuyRequest={() => setBuyOpen(true)}
      />
    </RealRwaShell>
  );
}

export function LendingPage() {
  const { lang } = useRwaAppState();
  return (
    <FeatureOverviewPage
      activeNav={4}
      title={lang === "cn" ? "链上借贷市场" : "On-chain Lending"}
      subtitle={
        lang === "cn"
          ? "面向 RWA 资产的低波动借贷深度池，透明展示资金使用效率。"
          : "Low-volatility lending pools for RWA assets with transparent capital efficiency."
      }
      primaryMetric={lang === "cn" ? "总借出规模" : "Total Supplied"}
      primaryValue="$ 18.72M"
      secondaryMetric="Utilization"
      secondaryValue="74.8%"
      tertiaryMetric={lang === "cn" ? "平均借贷 APR" : "Average APR"}
      tertiaryValue="6.24%"
      tableTitle={lang === "cn" ? "借贷池列表" : "Lending Markets"}
      rows={[
        ["USD1 Pool", "$ 6.84M", "4.82%", "82.4%"],
        ["RWA Senior", "$ 4.12M", "5.10%", "76.8%"],
        ["Treasury Note", "$ 7.76M", "6.80%", "65.2%"],
      ]}
      headers={[
        lang === "cn" ? "池子" : "Pool",
        lang === "cn" ? "规模" : "TVL",
        "APR",
        lang === "cn" ? "利用率" : "Utilization",
      ]}
    />
  );
}

export function LendingDetailPage() {
  const { lang } = useRwaAppState();
  return (
    <FeatureOverviewPage
      activeNav={4}
      title={lang === "cn" ? "借贷详情" : "Lending Detail"}
      subtitle={
        lang === "cn"
          ? "查看单个借贷池的抵押效率、风险区间与清算缓冲。"
          : "Inspect collateral efficiency, risk bands, and liquidation buffers for a single pool."
      }
      primaryMetric={lang === "cn" ? "可借总额" : "Borrow Capacity"}
      primaryValue="$ 2.95M"
      secondaryMetric="Health Factor"
      secondaryValue="8.23"
      tertiaryMetric="LTV"
      tertiaryValue="0.034"
      tableTitle={lang === "cn" ? "最近借贷记录" : "Recent Positions"}
      rows={[
        ["2026-03-02 11:00:00", "USD1", "Supply", "$ 100,000"],
        ["2026-03-01 09:40:25", "RWA1", "Borrow", "$ 39,147"],
        ["2026-02-28 21:13:16", "RWA3", "Repay", "$ 12,500"],
      ]}
      headers={[
        lang === "cn" ? "时间" : "Time",
        lang === "cn" ? "资产" : "Asset",
        lang === "cn" ? "类型" : "Type",
        lang === "cn" ? "金额" : "Amount",
      ]}
    />
  );
}

export function ReserveFundPage() {
  const { lang } = useRwaAppState();
  return (
    <FeatureOverviewPage
      activeNav={5}
      title={lang === "cn" ? "储备金透明看板" : "Reserve Fund"}
      subtitle={
        lang === "cn"
          ? "以实时储备和资产负债视图支撑平台安全垫，展示可验证的偿付能力。"
          : "A real-time reserve dashboard with asset-liability transparency and verifiable solvency."
      }
      primaryMetric={lang === "cn" ? "储备总额" : "Total Reserve"}
      primaryValue="$ 24.80M"
      secondaryMetric={lang === "cn" ? "覆盖率" : "Coverage Ratio"}
      secondaryValue="132%"
      tertiaryMetric={lang === "cn" ? "审计更新" : "Last Audit"}
      tertiaryValue="Today"
      tableTitle={lang === "cn" ? "储备资产构成" : "Reserve Allocation"}
      rows={[
        ["USD1 Cash", "$ 8.60M", "34.7%", "Low"],
        ["US T-Bills", "$ 11.20M", "45.2%", "Low"],
        ["RWA Notes", "$ 5.00M", "20.1%", "Medium"],
      ]}
      headers={[
        lang === "cn" ? "资产" : "Asset",
        lang === "cn" ? "估值" : "Value",
        lang === "cn" ? "占比" : "Weight",
        lang === "cn" ? "风险" : "Risk",
      ]}
    />
  );
}

export function InsurancePage() {
  const { lang } = useRwaAppState();
  const router = useRouter();
  const { insuranceProjects, insurancePolicies, getAssetProject } = useInsuranceDemo();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [mobileInsuranceSection, setMobileInsuranceSection] = useState<"markets" | "records" | "advantages" | "faq">("markets");
  const [activeAssetSymbol, setActiveAssetSymbol] = useState<string | null>(insuranceProjects[0]?.assetSymbol ?? null);
  const projects = insuranceProjects;
  const activeProject =
    projects.find((item) => item.assetSymbol === activeAssetSymbol) ?? projects[0] ?? null;
  const advantageCards = [
    {
      titleCn: "保险智能合约",
      titleEn: "Insurance Smart Contracts",
      descCn: "通过智能合约实现企业债违约的自动化、零延迟风险偿付。",
      descEn: "Automated and near real-time claim execution through smart-contract settlement.",
      icon: LockKeyhole,
      visualClass:
        "bg-[radial-gradient(circle_at_25%_30%,rgba(86,130,196,0.35),transparent_24%),linear-gradient(135deg,rgba(18,29,39,0.98)_0%,rgba(10,13,18,0.92)_46%,rgba(18,28,42,0.88)_100%)]",
    },
    {
      titleCn: "创始保险池",
      titleEn: "Genesis Insurance Pool",
      descCn: "使用平台储备和历史保费建立保险池，展示剩余承保额度如何影响保单创建。",
      descEn: "A reserve-backed pool that shows how remaining quota impacts policy creation.",
      icon: ShieldCheck,
      visualClass:
        "bg-[radial-gradient(circle_at_62%_28%,rgba(245,202,96,0.26),transparent_22%),linear-gradient(135deg,rgba(27,24,18,0.98)_0%,rgba(13,12,12,0.94)_48%,rgba(34,27,15,0.92)_100%)]",
    },
    {
      titleCn: "状态管理与实时切换",
      titleEn: "State Management & Live Switching",
      descCn: "可直接切换赔付状态，查看保单标签、文案和记录面板的联动变化。",
      descEn: "Switch payout states directly in the UI to review policy labels, copy, and record transitions.",
      icon: ScrollText,
      visualClass:
        "bg-[radial-gradient(circle_at_72%_20%,rgba(255,223,197,0.24),transparent_18%),linear-gradient(135deg,rgba(44,33,26,0.95)_0%,rgba(23,19,18,0.92)_46%,rgba(49,39,34,0.9)_100%)]",
    },
  ] as const;

  return (
    <RealRwaShell activeNav={6}>
      <section className="relative overflow-hidden border-b border-white/6 bg-[#050505]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.98)_0%,rgba(5,5,5,0.96)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(241,178,94,0.16),transparent_22%),radial-gradient(circle_at_66%_46%,rgba(61,118,166,0.16),transparent_26%)]" />
        <div className="mx-auto max-w-[1360px] px-6 py-8 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(105deg,rgba(10,10,11,0.98)_0%,rgba(8,10,12,0.93)_44%,rgba(21,15,10,0.88)_100%)]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,6,0.94)_0%,rgba(5,7,8,0.82)_42%,rgba(12,10,8,0.56)_100%)]" />
            <div className="absolute inset-y-0 right-0 hidden w-[45%] bg-[linear-gradient(180deg,rgba(255,183,75,0.06)_0%,rgba(255,183,75,0)_100%)] lg:block" />
            <div className="absolute inset-y-[14%] right-[8%] hidden w-[30%] rounded-[42px] border border-[#f1b24e]/12 bg-[linear-gradient(180deg,rgba(255,183,75,0.07),rgba(255,183,75,0.01))] lg:block" />
            <div className="absolute inset-y-[22%] right-[15%] hidden w-[20%] rounded-[26px] border border-white/7 lg:block" />
            <div className="grid min-h-[500px] items-center gap-10 px-8 py-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:px-12 lg:py-16">
              <div className="relative z-10 max-w-[980px]">
                <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-[#d6a152]">
                  PROTECTION
                </p>
                <h1 className="mt-6 max-w-[980px] text-[42px] font-semibold leading-[1.12] tracking-[-0.045em] text-white md:text-[54px] lg:text-[64px]">
                  {lang === "cn"
                    ? "守护资产，为您持有的债券代币保驾护航"
                    : "Protecting bond-token holdings with on-chain coverage"}
                </h1>
                <p className="mt-8 max-w-[1020px] text-[17px] leading-9 text-zinc-300 lg:text-[18px]">
                  {lang === "cn"
                    ? "RealFinance 保险模块展示“质押 -> 选择是否投保 -> 生成保单 -> 管理赔付状态”的完整保障流程。具体承保、清结算与链上执行以正式市场规则为准。"
                    : "RealFinance insurance presents the full stake-to-policy coverage flow. Coverage, settlement, and on-chain execution are subject to final market rules."}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button
                    className="real-gold-btn h-12 rounded-[16px] px-6 text-[17px] font-semibold lg:h-14 lg:px-8 lg:text-[20px]"
                    onClick={() => router.push(REALRWA_ROUTES.stakedDetail)}
                  >
                    {lang === "cn" ? "去质押并投保" : "Go Stake + Insure"}
                    <ArrowRight className="size-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="real-outline-btn h-12 rounded-[16px] border-white/25 bg-transparent px-6 text-[17px] font-semibold lg:h-14 lg:px-8 lg:text-[20px]"
                    onClick={() => router.push(REALRWA_ROUTES.staked)}
                  >
                    {lang === "cn" ? "查看记录面板" : "View Records"}
                  </Button>
                </div>
              </div>

              <div className="relative hidden lg:flex lg:justify-end">
                <div className="relative flex aspect-[0.94] w-full max-w-[340px] items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,15,0.9),rgba(11,13,17,0.75))]">
                  <div className="absolute inset-6 rounded-[28px] border border-[#efaf58]/14" />
                  <div className="absolute inset-y-10 right-10 w-[42%] rounded-[22px] border border-[#efaf58]/18" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_34%,rgba(255,184,82,0.16),transparent_20%),radial-gradient(circle_at_54%_54%,rgba(55,123,160,0.18),transparent_28%)]" />
                  <div className="relative flex size-[180px] items-center justify-center rounded-full border border-[#efaf58]/18 bg-[radial-gradient(circle,rgba(16,30,36,0.96)_0%,rgba(8,10,12,0.84)_72%)] shadow-[0_0_80px_rgba(31,141,187,0.12)]">
                    <LockKeyhole className="size-[88px] text-[#9dd2d2]" strokeWidth={1.6} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/6 bg-[#050505] lg:hidden">
        <div className="mx-auto max-w-[1360px] px-6 py-4">
          <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-2 overflow-x-auto">
            {[
              { key: "markets", label: lang === "cn" ? "承保项目" : "Markets" },
              { key: "records", label: lang === "cn" ? "记录面板" : "Records" },
              { key: "advantages", label: lang === "cn" ? "产品优势" : "Advantages" },
              { key: "faq", label: "FAQ" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  mobileInsuranceSection === item.key
                    ? "border-[#f0c456]/55 bg-[#241b09] text-[#f0c456]"
                    : "border-white/10 bg-white/[0.03] text-zinc-300"
                }`}
                onClick={() => setMobileInsuranceSection(item.key as "markets" | "records" | "advantages" | "faq")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={mobileInsuranceSection === "markets" ? "bg-[#050505]" : "hidden lg:block bg-[#050505]"}>
        <div className="mx-auto max-w-[1360px] px-6 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.25em] text-[#d6a152]">
                INSURED MARKETS
              </p>
              <h2 className="mt-4 text-[34px] font-semibold tracking-[-0.04em] text-white md:text-[44px]">
                {lang === "cn" ? "承保项目" : "Insured Projects"}
              </h2>
            </div>
            <Button
              variant="outline"
              className="real-outline-btn h-11 rounded-[12px] border-white/20 bg-transparent px-5 text-[14px]"
              onClick={() => router.push(REALRWA_ROUTES.stakedDetail)}
            >
              {lang === "cn" ? "前往质押详情投保" : "Go to Staking Detail"}
            </Button>
          </div>

          <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-8 flex gap-6 overflow-x-auto pb-1 xl:grid xl:grid-cols-2 xl:overflow-visible">
            {projects.map((project) => {
              const latestPolicy = insurancePolicies.find((item) => item.assetSymbol === project.assetSymbol);
              const assetProject = getAssetProject(project.assetSymbol);
              return (
                <div key={project.assetSymbol} className="min-w-[320px] xl:min-w-0" onMouseEnter={() => setActiveAssetSymbol(project.assetSymbol)}>
                  <InsuranceProjectCard
                    lang={lang}
                    project={project}
                    unitPriceUsd1={assetProject?.unitPriceUsd1 ?? 1}
                    previewUnits={latestPolicy?.insuredUnits ?? assetProject?.minStakeUnits ?? 1}
                    previewRatio={latestPolicy?.coverageRatio ?? project.defaultCoverageRatio}
                    actionLabel={lang === "cn" ? "去质押并投保" : "Go Stake + Insure"}
                    onAction={() => router.push(REALRWA_ROUTES.stakedDetail)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={mobileInsuranceSection === "records" ? "border-t border-white/6 bg-[#050505]" : "hidden lg:block border-t border-white/6 bg-[#050505]"}>
        <div className="mx-auto max-w-[1360px] px-6 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-center gap-2">
            {projects.map((project) => (
              <button
                key={project.assetSymbol}
                type="button"
                onClick={() => setActiveAssetSymbol(project.assetSymbol)}
                className={`rounded-full border px-4 py-2 text-[13px] transition ${
                  project.assetSymbol === activeProject?.assetSymbol
                    ? "border-[#e4bd55] bg-[#e4bd55]/15 text-[#f0cd7a]"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25"
                }`}
              >
                {project.assetSymbol}
              </button>
            ))}
          </div>
          {activeProject ? (
            <div className="mt-4">
              <InsuranceStatusRail lang={lang} activeStatus={activeProject.currentStatus} />
            </div>
          ) : null}

          <InsuranceDemoPanels className="mt-8" />
        </div>
      </section>

      <section className={mobileInsuranceSection === "advantages" ? "bg-[#050505]" : "hidden lg:block bg-[#050505]"}>
        <div className="mx-auto max-w-[1360px] px-6 py-18 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-[#d6a152]">
              WHY REAL INSURANCE
            </p>
            <h2 className="mt-5 text-[42px] font-semibold tracking-[-0.04em] text-white md:text-[56px]">
              {lang === "cn" ? "产品优势" : "Product Advantages"}
            </h2>
          </div>

          <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-12 flex gap-6 overflow-x-auto pb-1 xl:grid xl:grid-cols-3 xl:overflow-visible">
            {advantageCards.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.titleCn}
                  className="min-w-[300px] overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0b] xl:min-w-0"
                >
                  <div className={`relative h-[240px] overflow-hidden border-b border-white/8 ${item.visualClass}`}>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(0,0,0,0.32)_100%)]" />
                    <div className="absolute bottom-6 right-6 flex size-16 items-center justify-center rounded-2xl border border-white/12 bg-[#131314]">
                      <Icon className="size-8 text-white/90" strokeWidth={1.8} />
                    </div>
                  </div>
                  <div className="px-8 py-8">
                    <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-white">
                      {lang === "cn" ? item.titleCn : item.titleEn}
                    </h3>
                    <p className="mt-6 text-[17px] leading-9 text-zinc-300">
                      {lang === "cn" ? item.descCn : item.descEn}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={mobileInsuranceSection === "faq" ? "border-t border-white/6 bg-[#050505]" : "hidden lg:block border-t border-white/6 bg-[#050505]"}>
        <div className="mx-auto max-w-[1360px] px-6 py-18 lg:px-8 lg:py-24">
          <div className="text-center">
            <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-[#d6a152]">
              FAQ
            </p>
            <h2 className="mt-5 text-[42px] font-semibold tracking-[-0.04em] text-white md:text-[56px]">
              {lang === "cn" ? "常见问题" : "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="mt-12 space-y-5">
            {INSURANCE_FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <article
                  key={item.questionCn}
                  className="overflow-hidden rounded-[22px] border border-white/12 bg-[#0b0b0c]"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 px-6 py-7 text-left md:px-8"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                  >
                    <span className="text-[22px] font-semibold tracking-[-0.03em] text-white md:text-[26px]">
                      {lang === "cn" ? item.questionCn : item.questionEn}
                    </span>
                    <ChevronDown
                      className={`size-6 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen ? (
                    <div className="border-t border-white/8 px-6 pb-8 pt-6 md:px-8">
                      <p className="max-w-[1180px] text-[17px] leading-9 text-zinc-300">
                        {lang === "cn" ? item.answerCn : item.answerEn}
                      </p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

    </RealRwaShell>
  );
}

export function OtcPage() {
  const { lang } = useRwaAppState();
  return (
    <FeatureOverviewPage
      activeNav={7}
      title={lang === "cn" ? "OTC 大宗交易" : "OTC Block Trading"}
      subtitle={
        lang === "cn"
          ? "为机构与高净值客户提供低滑点、定制化的大宗 RWA 交易入口。"
          : "Low-slippage, bespoke block trading access for institutional and high-net-worth clients."
      }
      primaryMetric={lang === "cn" ? "今日撮合额" : "Matched Today"}
      primaryValue="$ 4.28M"
      secondaryMetric={lang === "cn" ? "平均报价差" : "Avg Spread"}
      secondaryValue="0.12%"
      tertiaryMetric={lang === "cn" ? "可用流动性" : "Available Liquidity"}
      tertiaryValue="$ 19.4M"
      tableTitle={lang === "cn" ? "最近报价" : "Recent Quotes"}
      rows={[
        ["RWA1 / USD1", "$ 1.50M", "0.08%", "Ready"],
        ["RWA3 / USD1", "$ 2.20M", "0.15%", "Ready"],
        ["RWA5 / USD1", "$ 0.58M", "0.22%", "Quoted"],
      ]}
      headers={[
        lang === "cn" ? "交易对" : "Pair",
        lang === "cn" ? "深度" : "Depth",
        lang === "cn" ? "报价差" : "Spread",
        lang === "cn" ? "状态" : "Status",
      ]}
    />
  );
}

export function StakedPage() {
  const { lang, identityBound } = useRwaAppState();
  const router = useRouter();
  const [buyOpen, setBuyOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"overview" | "bonds" | "records">("overview");
  const [selectedBuyAsset, setSelectedBuyAsset] = useState<BuyModalAsset>(() => ({
    symbol: STAKED_TABLE_ROWS[0]?.symbol ?? "rXWCT",
    iconUrl: STAKED_TABLE_ROWS[0]?.iconUrl,
  }));

  const onBuyAttempt = (asset: BuyModalAsset) => {
    if (!identityBound) {
      window.dispatchEvent(new Event(OPEN_IDENTITY_VERIFICATION_EVENT));
      return;
    }
    setSelectedBuyAsset(asset);
    setBuyOpen(true);
  };

  return (
    <RealRwaShell activeNav={3}>
      <section className="bg-[#050505]">
        <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-0 lg:px-8">
          <div className="relative min-h-[282px] overflow-hidden border border-white/6 bg-[#090909]">
            <div
              className="absolute inset-y-0 right-0 hidden w-[70%] bg-cover bg-center opacity-75 lg:block"
              style={{
                backgroundImage: "url('/realrwa/staked-hero-right.png')",
                WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 14%, black 100%)",
                maskImage: "linear-gradient(90deg, transparent 0%, black 14%, black 100%)",
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.84)_34%,rgba(0,0,0,0.64)_58%,rgba(0,0,0,0.48)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_52%,rgba(146,90,29,0.18),transparent_32%),radial-gradient(circle_at_42%_20%,rgba(255,255,255,0.04),transparent_28%)]" />
            <div className="relative px-8 py-20 md:px-10">
              <h1 className="max-w-[540px] text-[36px] font-semibold tracking-[-0.04em] text-white md:text-[52px]">
                {lang === "cn" ? "质押债券RWA资产" : "Stake Bond RWA Assets"}
              </h1>
              <Button
                variant="outline"
                className="mt-9 h-[48px] rounded-[12px] border-white/28 bg-transparent px-8 text-[16px] font-semibold text-white hover:bg-white/5"
                onClick={() => router.push(REALRWA_ROUTES.stakedDetail)}
              >
                {lang === "cn" ? "如何质押?" : "How to Stake?"}
              </Button>
            </div>
          </div>

          <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {[
              { key: "overview", label: lang === "cn" ? "总览" : "Overview" },
              { key: "bonds", label: lang === "cn" ? "债券列表" : "Bonds" },
              { key: "records", label: lang === "cn" ? "我的记录" : "Records" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  mobileSection === item.key
                    ? "border-[#f0c456]/55 bg-[#241b09] text-[#f0c456]"
                    : "border-white/10 bg-white/[0.03] text-zinc-300"
                }`}
                onClick={() => setMobileSection(item.key as "overview" | "bonds" | "records")}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-10 flex gap-5 overflow-x-auto pb-1 lg:grid lg:grid-cols-3">
            {STAKED_SUMMARY_ITEMS.map((item) => (
              <article
                key={item.key}
                className="relative min-w-[240px] overflow-hidden rounded-[14px] border border-white/8 bg-[#151515] px-5 py-5 lg:min-w-0"
              >
                <Target className="pointer-events-none absolute right-5 top-1/2 size-[68px] -translate-y-1/2 text-white/[0.06]" strokeWidth={1.4} />
                <div className="relative">
                  <div className="flex items-center gap-2 text-[16px] font-semibold text-zinc-300">
                    <span>{lang === "cn" ? item.labelCn : item.labelEn}</span>
                    <Info className="size-4 text-zinc-500" strokeWidth={2} />
                  </div>
                  <p className="mt-5 font-mono text-[26px] font-semibold tracking-[-0.04em] text-white">
                    {item.value}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <section className={mobileSection === "overview" ? "mt-10 lg:mt-20" : "hidden lg:block lg:mt-20"}>
            <div className="rounded-[2px] border border-white/6 bg-[#050505] px-6 py-6">
              <div className="flex items-center justify-between gap-2 text-[14px] text-zinc-300">
                <p className="text-[15px] font-semibold text-white lg:hidden">
                  {lang === "cn" ? "质押总览" : "Staking Overview"}
                </p>
                <span className="size-2 rounded-full bg-[#6c8f90]" />
                <span>{lang === "cn" ? "已质押" : "Staked"}</span>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[56px_minmax(0,1fr)]">
                <div className="hidden h-[360px] flex-col justify-between text-[14px] text-zinc-500 lg:flex">
                  {["$5.00K", "$4.00K", "$3.00K", "$2.00K", "$1.00K", "$0.00"].map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                <div className="relative h-[280px] lg:h-[360px]">
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={`staking-grid-${index}`}
                        className={index === 5 ? "border-t border-white/18" : "border-t border-dashed border-white/16"}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-7 top-0 flex items-end gap-4">
                    {STAKED_CHART_VALUES.map((value, index) => (
                      <div key={`staking-bar-${index}`} className="flex h-full flex-1 items-end justify-center">
                        <div
                          className={`w-full max-w-[18px] rounded-t-[6px] ${
                            value > 0
                              ? "bg-[linear-gradient(180deg,rgba(121,162,163,0.88),rgba(63,92,94,0.72)_52%,rgba(8,15,16,0.08)_100%)]"
                              : "bg-transparent"
                          }`}
                          style={{ height: `${(value / 5) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex justify-between text-[12px] text-zinc-500 lg:text-[14px]">
                    <span>2026-03-03</span>
                    <span>2026-04-02</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-left text-[12px] text-zinc-500 lg:text-right lg:text-[14px]">
                {lang === "cn" ? "更新时间: 2026-04-02 13:51:00" : "Updated: 2026-04-02 13:51:00"}
              </p>
            </div>
          </section>

          <section className={mobileSection === "bonds" ? "mt-10 lg:mt-24" : "hidden lg:block lg:mt-24"}>
            <h2 className="text-[26px] font-semibold tracking-[-0.04em] text-white">
              {lang === "cn" ? "债券列表" : "Bond List"}
            </h2>
            <div className="mt-6 space-y-4 md:hidden">
              {STAKED_TABLE_ROWS.map((row) => (
                <article
                  key={row.symbol}
                  className="rounded-[18px] border border-white/8 bg-[#0e0e0f] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-[42px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#202123] ring-1 ring-white/8">
                        {/* Remote token assets are served from jsDelivr and don't need Next image optimization here. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={row.iconUrl} alt={row.symbol} className="h-[30px] w-[30px] object-contain" loading="lazy" />
                      </div>
                      <div>
                        <p className={`text-[16px] font-semibold ${row.symbol === "rXWCT" ? "text-[#42c3e8]" : "text-[#32c4a4]"}`}>
                          {row.symbol}
                        </p>
                        <p className="mt-1 text-[13px] text-zinc-500">{lang === "cn" ? row.issuerCn : row.issuerEn}</p>
                      </div>
                    </div>
                    <span className="inline-flex rounded-full bg-[#3d3318] px-3 py-1 text-[12px] font-medium text-[#f0c456]">
                      {row.apr}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                      <p className="text-[12px] text-zinc-500">{lang === "cn" ? "总质押" : "Total Stake"}</p>
                      <p className="mt-1 font-mono text-[15px] text-white">{row.totalStake}</p>
                      <p className="mt-1 font-mono text-[12px] text-zinc-500">{row.totalStakeUsd}</p>
                    </div>
                    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                      <p className="text-[12px] text-zinc-500">{lang === "cn" ? "未领取" : "Unclaimed"}</p>
                      <p className="mt-1 font-mono text-[15px] text-white">{row.unclaimed}</p>
                    </div>
                    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                      <p className="text-[12px] text-zinc-500">{lang === "cn" ? "RWA总奖励" : "RWA Reward"}</p>
                      <p className="mt-1 font-mono text-[15px] text-white">{row.rwaReward}</p>
                      <p className="mt-1 font-mono text-[12px] text-zinc-500">{row.rwaRewardUsd}</p>
                    </div>
                    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                      <p className="text-[12px] text-zinc-500">{lang === "cn" ? "REAL总奖励" : "REAL Reward"}</p>
                      <p className="mt-1 font-mono text-[15px] text-white">{row.realReward}</p>
                      <p className="mt-1 font-mono text-[12px] text-zinc-500">{row.realRewardUsd}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 h-[42px] w-full rounded-[12px] border-white/20 bg-transparent text-[15px] font-semibold text-white hover:bg-white/5"
                    onClick={() => onBuyAttempt({
                      symbol: row.symbol,
                      iconUrl: row.iconUrl,
                    })}
                  >
                    Buy
                  </Button>
                </article>
              ))}
            </div>
            <div className="mt-6 hidden overflow-hidden rounded-[14px] border border-white/8 bg-[#0e0e0f] md:block">
              <div className="grid grid-cols-[1.25fr_1.15fr_0.6fr_1.45fr_1.45fr_0.8fr_0.6fr] gap-6 border-b border-white/8 bg-[#1a1a1b] px-4 py-5 text-[14px] font-semibold text-zinc-400 md:px-6">
                {[
                  lang === "cn" ? "债券" : "Bond",
                  lang === "cn" ? "总质押" : "Total Stake",
                  "APR",
                  lang === "cn" ? "RWA总奖励" : "RWA Reward",
                  lang === "cn" ? "REAL总奖励" : "REAL Reward",
                  lang === "cn" ? "未领取" : "Unclaimed",
                  lang === "cn" ? "操作" : "Action",
                ].map((head) => (
                  <div key={head}>{head}</div>
                ))}
              </div>

              {STAKED_TABLE_ROWS.map((row, index) => (
                <div
                  key={row.symbol}
                  className={`grid grid-cols-[1.25fr_1.15fr_0.6fr_1.45fr_1.45fr_0.8fr_0.6fr] items-center gap-6 px-4 py-5 text-[15px] text-zinc-300 md:px-6 ${
                    index === 0 ? "border-b border-white/8" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="grid size-[42px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#202123] ring-1 ring-white/8">
                      {/* Remote token assets are served from jsDelivr and don't need Next image optimization here. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={row.iconUrl} alt={row.symbol} className="h-[30px] w-[30px] object-contain" loading="lazy" />
                    </div>
                    <div>
                      <p className={`text-[16px] font-semibold ${row.symbol === "rXWCT" ? "text-[#42c3e8]" : "text-[#32c4a4]"}`}>
                        {row.symbol}
                      </p>
                      <p className="mt-1 text-[14px] text-zinc-500">{lang === "cn" ? row.issuerCn : row.issuerEn}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[16px] text-white">{row.totalStake}</p>
                    <p className="mt-1 font-mono text-[14px] text-zinc-500">{row.totalStakeUsd}</p>
                  </div>
                  <div>
                    <span className="inline-flex rounded-[4px] bg-[#3d3318] px-3 py-1.5 font-mono text-[15px] text-[#f0c456]">
                      {row.apr}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[16px] text-white">{row.rwaReward}</p>
                    <p className="mt-1 font-mono text-[14px] text-zinc-500">{row.rwaRewardUsd}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[16px] text-white">{row.realReward}</p>
                    <p className="mt-1 font-mono text-[14px] text-zinc-500">{row.realRewardUsd}</p>
                  </div>
                  <div className="font-mono text-[16px] text-white">{row.unclaimed}</div>
                  <div>
                    <Button
                      variant="outline"
                      className="h-[34px] rounded-[10px] border-white/20 bg-transparent px-4 text-[15px] font-semibold text-white hover:bg-white/5"
                      onClick={() => onBuyAttempt({
                        symbol: row.symbol,
                        iconUrl: row.iconUrl,
                      })}
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-left text-[12px] text-zinc-500 md:text-right md:text-[14px]">
              {lang === "cn" ? "更新时间: 2026-04-02 13:51:00" : "Updated: 2026-04-02 13:51:00"}
            </p>
          </section>

          <div className={mobileSection === "records" ? "mt-10 lg:mt-20" : "hidden lg:block lg:mt-20"}>
            <InsuranceDemoPanels />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/8 bg-[#121212]">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-14 md:grid-cols-[1.15fr_repeat(4,minmax(0,1fr))] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo-mark.svg" alt="REAL" width={34} height={34} className="h-[34px] w-[34px]" />
              <span className="text-[28px] font-semibold tracking-[-0.03em] text-white">REAL</span>
            </div>
          </div>

          {APP_FOOTER_COLUMNS.map((column) => (
            <div key={column.titleCn}>
              <p className="text-[16px] font-semibold text-white">{lang === "cn" ? column.titleCn : column.titleEn}</p>
              <ul className="mt-4 space-y-3 text-[14px] text-zinc-500">
                {(lang === "cn" ? column.itemsCn : column.itemsEn).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>

      <BuyModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        platformBalance={10.0001}
        assetSymbol={selectedBuyAsset.symbol}
        assetIcon={selectedBuyAsset.iconUrl}
        onStakeNow={() => router.push(REALRWA_ROUTES.stakedDetail)}
      />
    </RealRwaShell>
  );
}

export function TradeOrdersPage() {
  const { lang } = useRwaAppState();
  const rows = [
    {
      id: "trade-001",
      time: "2025-10-20 12:23",
      pair: "rXWCT / USD1",
      type: "Buy",
      price: "1.0001",
      qty: "10.00",
      value: "+10.001",
      status: "Success",
      sideTone: "text-emerald-400",
      settlement: "USD1",
      wallet: "0xda22se2b...9f3c8a22se2b",
    },
    {
      id: "trade-002",
      time: "2025-10-20 12:23",
      pair: "rXWCT / USD1",
      type: "Sell",
      price: "1.0001",
      qty: "1.00",
      value: "-1.0001",
      status: "Success",
      sideTone: "text-rose-400",
      settlement: "USD1",
      wallet: "0xda22se2b...9f3c8a22se2b",
    },
    {
      id: "trade-003",
      time: "2025-10-20 12:23",
      pair: "rXWCT / USD1",
      type: "Stake",
      price: "1.0001",
      qty: "1.00",
      value: "+1.0001",
      status: "Success",
      sideTone: "text-emerald-400",
      settlement: "USD1",
      wallet: "0xda22se2b...9f3c8a22se2b",
    },
    {
      id: "trade-004",
      time: "2025-10-20 12:23",
      pair: "rXWCT / USD1",
      type: "Redeem",
      price: "1.0001",
      qty: "1.00",
      value: "-1.0001",
      status: "Success",
      sideTone: "text-rose-400",
      settlement: "USD1",
      wallet: "0xda22se2b...9f3c8a22se2b",
    },
    {
      id: "trade-005",
      time: "2025-10-20 12:23",
      pair: "rXWCT / USD1",
      type: "Claim",
      price: "1.0001",
      qty: "10.00",
      value: "+10.001",
      status: "Success",
      sideTone: "text-emerald-400",
      settlement: "USD1",
      wallet: "0xda22se2b...9f3c8a22se2b",
    },
  ];
  const [selectedOrder, setSelectedOrder] = useState<(typeof rows)[number] | null>(null);
  const visibleRows = rows;
  return (
    <RealRwaShell activeNav={0}>
      <section className="real-page-wrap portfolio-page mx-auto max-w-[1560px] px-6 py-8">
        <button className="portfolio-page-title mb-6 hidden items-center gap-2 text-2xl font-semibold md:flex md:text-3xl">
          <ArrowLeft className="size-8" />
          {lang === "cn" ? "订单列表" : "Order List"}
        </button>
        <h2 className="mb-4 text-[22px] font-semibold md:hidden">{lang === "cn" ? "订单列表" : "Order List"}</h2>
        <div className="flex flex-col gap-6 md:flex-row">
          <PortfolioSidebar active="trade" />
          <div className="portfolio-table-wrap flex-1 rounded-2xl bg-[#1a1a1a] p-4">
            <div className="md:hidden">
              <div className="rounded-[12px] border border-white/8 bg-[#0f0f12] p-2">
                <div className="grid grid-cols-[130px_1fr_28px] items-center gap-2">
                  <div className="rounded-[8px] border border-white/10 bg-[#17191f] px-2 py-1.5 text-[12px] text-zinc-300">
                    {lang === "cn" ? "所有订单" : "All Orders"}
                  </div>
                  <div className="rounded-[8px] border border-white/10 bg-[#17191f] px-2 py-1.5 text-[12px] text-zinc-500">
                    {lang === "cn" ? "开始日期  →  结束日期" : "Start  →  End"}
                  </div>
                  <button type="button" className="grid size-7 place-items-center rounded-[8px] border border-white/10 bg-[#17191f] text-zinc-500">
                    <Calendar className="size-3.5" />
                  </button>
                </div>
              </div>

              {visibleRows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-18">
                  <SearchX className="size-12 text-zinc-600" strokeWidth={1.5} />
                  <p className="mt-2 text-[14px] text-zinc-500">{lang === "cn" ? "暂无订单" : "No orders"}</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2.5">
                  {visibleRows.map((row) => (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => setSelectedOrder(row)}
                      className="block w-full rounded-[12px] border border-white/10 bg-[#0f0f12] px-3 py-3 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                      <div>
                          <p className="text-[18px] font-semibold text-zinc-100">
                            {row.type === "Buy"
                              ? (lang === "cn" ? "购买" : "Buy")
                              : row.type === "Sell"
                                ? (lang === "cn" ? "卖出" : "Sell")
                                : row.type === "Stake"
                                  ? (lang === "cn" ? "质押" : "Stake")
                                  : row.type === "Redeem"
                                    ? (lang === "cn" ? "赎回" : "Redeem")
                                    : (lang === "cn" ? "领取奖励" : "Claim")}{" "}
                            {row.pair.split("/")[0]?.trim()}
                          </p>
                          <p className="mt-1 text-[12px] text-zinc-500">{row.time}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-mono text-[18px] leading-none ${row.sideTone}`}>{row.value}</p>
                          <p className="mt-0.5 text-[11px] text-zinc-500">{row.pair.split("/")[0]?.trim()}</p>
                          <span className="mt-1 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
                            {lang === "cn" ? "交易成功" : row.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {visibleRows.length > 0 ? (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button type="button" className="grid size-7 place-items-center text-zinc-500">{"<"}</button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={`order-page-${page}`}
                      type="button"
                      className={`grid h-8 w-8 place-items-center rounded-[6px] text-[13px] ${
                        page === 1 ? "bg-[#d5b253] text-black" : "bg-[#15161a] text-zinc-500"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button type="button" className="grid size-7 place-items-center text-zinc-500">{">"}</button>
                </div>
              ) : null}
            </div>
            <div className="portfolio-table-head hidden grid-cols-7 rounded-xl bg-white/5 px-4 py-4 text-base text-zinc-400 md:grid">
              {(lang === "cn"
                ? ["时间", "币种", "类型", "价格", "数量", "价值", "状态"]
                : ["Time", "Pair", "Type", "Price", "Qty", "Value", "Status"]
              ).map((h) => (
                <div key={h}>{h}</div>
              ))}
            </div>
            {rows.map((row, index) => (
              <div
                key={`${row.time}-${row.pair}`}
                className={`portfolio-table-row hidden grid-cols-7 rounded-xl px-4 py-4 transition-colors hover:bg-white/[0.04] md:grid ${
                  index === 0 ? "border-b border-white/10" : ""
                }`}
              >
              <div className="font-mono">{row.time}</div>
              <div>{row.pair}</div>
              <div>{row.type}</div>
              <div className="font-mono">{row.price}</div>
              <div className="font-mono">{row.qty}</div>
              <div className={`font-mono ${row.sideTone}`}>{row.value}</div>
              <div className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">{row.status}</div>
            </div>
            ))}
          </div>
        </div>
      </section>

      <MobileOrderDetailSheet
        open={!!selectedOrder}
        title={lang === "cn" ? "订单详情" : "Order Detail"}
        onClose={() => setSelectedOrder(null)}
        rows={
          selectedOrder
            ? [
                { label: lang === "cn" ? "交易对" : "Pair", value: selectedOrder.pair },
                { label: lang === "cn" ? "交易类型" : "Type", value: selectedOrder.type },
                { label: lang === "cn" ? "卖出地址" : "Wallet", value: selectedOrder.wallet, mono: true },
                { label: lang === "cn" ? "卖出价格" : "Price", value: selectedOrder.price },
                { label: lang === "cn" ? "卖出数量" : "Amount", value: selectedOrder.qty },
                { label: lang === "cn" ? "卖出价值" : "Value", value: selectedOrder.value },
                { label: lang === "cn" ? "创建时间" : "Created At", value: selectedOrder.time },
                { label: lang === "cn" ? "成交时间" : "Filled At", value: selectedOrder.time },
                { label: lang === "cn" ? "订单状态" : "Status", value: lang === "cn" ? "交易成功" : selectedOrder.status },
              ]
            : []
        }
        statusLabel={selectedOrder?.status}
      />
      <MobileTradeBottomNav active="orders" />
    </RealRwaShell>
  );
}

export function StakeOrdersPage() {
  const { lang } = useRwaAppState();
  const [mobileRecordTab, setMobileRecordTab] = useState<"stake" | "yield" | "claim">("stake");
  const [mobileShowAll, setMobileShowAll] = useState(false);
  const mobileStakeRows = {
    stake: [
      { symbol: "rXWCT", time: "2026-02-02 14:08:25", amount: "4.4200", value: "$4.41K", status: lang === "cn" ? "质押中" : "Staked" },
      { symbol: "rSDCT", time: "2026-02-01 11:33:18", amount: "2.0000", value: "$2.00", status: lang === "cn" ? "已投保" : "Insured" },
    ],
    yield: [
      { symbol: "rXWCT", time: "2026-02-03 08:00:00", amount: "1.20 USDC", value: "$1.20", status: lang === "cn" ? "收益中" : "Yielding" },
      { symbol: "rSDCT", time: "2026-02-02 08:00:00", amount: "0.05 USDC", value: "$0.05", status: lang === "cn" ? "收益中" : "Yielding" },
    ],
    claim: [
      { symbol: "rXWCT", time: "2026-02-04 09:11:02", amount: "1.20 USDC", value: "$1.20", status: lang === "cn" ? "已领取" : "Claimed" },
    ],
  } as const;
  const activeRows = mobileStakeRows[mobileRecordTab];
  const visibleRows = mobileShowAll ? activeRows : activeRows.slice(0, 2);
  const summaryMetrics = [
    {
      label: lang === "cn" ? "已质押价值" : "Staked Value",
      value: "$4.43K",
    },
    {
      label: lang === "cn" ? "累计收益" : "Total Yield",
      value: "$1.25",
    },
    {
      label: lang === "cn" ? "已领取" : "Claimed",
      value: "$1.20",
    },
  ] as const;

  return (
    <RealRwaShell activeNav={3}>
      <section className="real-page-wrap portfolio-page mx-auto max-w-[1560px] px-6 py-8">
        <button className="portfolio-page-title mb-6 flex items-center gap-2 text-2xl font-semibold md:text-3xl">
          <ArrowLeft className="size-8" />
          {lang === "cn" ? "我的投资组合" : "My Portfolio"}
        </button>
        <div className="flex flex-col gap-6 md:flex-row">
          <PortfolioSidebar active="stake" />
          <div className="portfolio-table-wrap flex-1 rounded-2xl bg-[#1a1a1a] p-4">
            <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-4 flex gap-3 overflow-x-auto border-b border-white/10 px-1 pb-3 text-sm md:px-3 md:text-base">
              {[
                { key: "stake", label: lang === "cn" ? "质押记录" : "Staking Records" },
                { key: "yield", label: lang === "cn" ? "收益记录" : "Yield Records" },
                { key: "claim", label: lang === "cn" ? "收益领取" : "Claim Records" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                    className={`shrink-0 rounded-full border px-4 py-2 md:rounded-none md:border-0 md:px-0 md:py-0 ${
                      mobileRecordTab === item.key
                        ? "border-[#FACC15]/55 bg-[#241b09] text-[#FACC15] md:border-b-2 md:bg-transparent md:pb-2"
                        : "border-white/10 bg-white/[0.03] text-zinc-400 md:bg-transparent md:pb-2"
                    }`}
                  onClick={() => {
                    setMobileRecordTab(item.key as "stake" | "yield" | "claim");
                    setMobileShowAll(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="space-y-3 md:hidden">
              <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-3 overflow-x-auto pb-1">
                {summaryMetrics.map((metric) => (
                  <div key={metric.label} className="min-w-[170px] rounded-[14px] border border-white/8 bg-white/[0.03] px-4 py-3">
                    <p className="text-[12px] text-zinc-500">{metric.label}</p>
                    <p className="mt-1 font-mono text-[15px] text-white">{metric.value}</p>
                  </div>
                ))}
              </div>

              {visibleRows.map((row) => (
                <article key={`${mobileRecordTab}-${row.symbol}-${row.time}`} className="rounded-[16px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[16px] font-semibold text-white">{row.symbol}</p>
                      <p className="mt-1 text-[12px] text-zinc-500">{row.time}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] text-zinc-300">
                      {row.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-3">
                      <p className="text-[12px] text-zinc-500">{lang === "cn" ? "资产" : "Asset"}</p>
                      <p className="mt-1 text-[14px] text-white">{row.symbol}</p>
                    </div>
                    <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-3">
                      <p className="text-[12px] text-zinc-500">
                        {mobileRecordTab === "claim"
                          ? lang === "cn" ? "领取数量" : "Claimed"
                          : mobileRecordTab === "yield"
                            ? lang === "cn" ? "收益" : "Reward"
                            : lang === "cn" ? "质押数量" : "Amount"}
                      </p>
                      <p className="mt-1 font-mono text-[14px] text-white">{row.amount}</p>
                    </div>
                    <div className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-3 col-span-2">
                      <p className="text-[12px] text-zinc-500">{lang === "cn" ? "价值" : "Value"}</p>
                      <p className="mt-1 font-mono text-[14px] text-white">{row.value}</p>
                    </div>
                  </div>
                </article>
              ))}

              {activeRows.length > 2 ? (
                <button
                  type="button"
                  className="w-full rounded-[12px] border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] text-zinc-300"
                  onClick={() => setMobileShowAll((prev) => !prev)}
                >
                  {mobileShowAll
                    ? (lang === "cn" ? "收起记录" : "Collapse")
                    : (lang === "cn" ? `展开其余 ${activeRows.length - 2} 条` : `Show ${activeRows.length - 2} more`)}
                </button>
              ) : null}
            </div>
            <div className="portfolio-table-head hidden grid-cols-3 rounded-xl bg-white/5 px-4 py-4 text-base text-zinc-400 md:grid">
              {(lang === "cn"
                ? ["质押时间", "质押名称", "质押数量"]
                : ["Staked Time", "Asset", "Amount"]
              ).map((h) => (
                <div key={h}>{h}</div>
              ))}
            </div>
            <div className="portfolio-table-row hidden grid-cols-3 rounded-xl px-4 py-4 transition-colors hover:bg-white/[0.04] md:grid">
              <div className="font-mono">2026-02-02 14:08:25</div>
              <div>RWA1</div>
              <div className="font-mono">10</div>
            </div>
          </div>
        </div>
      </section>
    </RealRwaShell>
  );
}

export function TokenBalancePage() {
  const { lang, platformUsd1Balance, identityBound } = useRwaAppState();
  const router = useRouter();
  const [stakeOpen, setStakeOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [mobileExpandedAsset, setMobileExpandedAsset] = useState("rXWCT-2");
  const rows = [
    {
      id: "rXWCT-1",
      name: "rXWCT",
      issuer: "兴财城投",
      iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rXWCT.png",
      value: "123,012.00",
      approx: "≈ 1.00228 USDC",
      apr: "10.00%",
      reward: "10,000.0001USD",
      yesterday: "10,000.0001USD",
      available: "10,000.0001USD",
      category: "rwa",
    },
    {
      id: "rXWCT-2",
      name: "rXWCT",
      issuer: "兴财城投",
      iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rFUIDL.png",
      value: "123,012.00",
      approx: "≈ 1.00228 USDC",
      apr: "10.00%",
      reward: "10,000.0001USD",
      yesterday: "10,000.0001USDC",
      available: "10,000.0001USD",
      category: "rwa",
    },
    {
      id: "rXWCT-3",
      name: "rXWCT",
      issuer: "兴财城投",
      iconUrl: "https://cdn.jsdelivr.net/gh/jiangnan0622/token-assets@main/rSDCT.png",
      value: "123,012.00",
      approx: "≈ 1.00228 USDC",
      apr: "10.00%",
      reward: "10,000.0001USD",
      yesterday: "10,000.0001USDC",
      available: "10,000.0001USD",
      category: "rwa",
    },
  ];
  const onBuyAttempt = () => {
    if (!identityBound) {
      window.dispatchEvent(new Event(OPEN_IDENTITY_VERIFICATION_EVENT));
      return;
    }
    setBuyOpen(true);
  };
  return (
    <RealRwaShell activeNav={3}>
      <section className="real-page-wrap portfolio-page mx-auto max-w-[1560px] px-4 py-5 md:px-6 md:py-8">
        <div className="md:hidden">
          <button
            type="button"
            className="mb-4 flex items-center gap-2 text-[20px] font-semibold"
            onClick={() => router.push(REALRWA_ROUTES.home)}
          >
            <ArrowLeft className="size-5" />
            {lang === "cn" ? "我的投资组合" : "My Portfolio"}
          </button>

          <h3 className="mb-2 text-[18px] font-semibold">{lang === "cn" ? "资产概览" : "Summary"}</h3>
          <div className="rounded-[12px] border border-[#514fb5]/35 bg-[radial-gradient(circle_at_85%_35%,rgba(91,108,242,0.18),transparent_35%),linear-gradient(135deg,rgba(20,21,45,0.95),rgba(31,24,53,0.88))] px-3 py-3.5">
            <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
              <div>
                <p className="text-[11px] text-zinc-400">{lang === "cn" ? "总资产价值" : "Total Value"}</p>
                <p className="mt-1 font-mono text-[16px] font-semibold leading-tight text-zinc-100">$ 31,020,232.58</p>
                <p className="mt-1 text-[11px] leading-none text-zinc-500">≈ 1.00228 USDC</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400">{lang === "cn" ? "可用资产价值" : "Available Value"}</p>
                <p className="mt-1 font-mono text-[16px] font-semibold leading-tight text-zinc-100">$ 31,020,232.58</p>
                <p className="mt-1 text-[11px] leading-none text-zinc-500">≈ 1.00228 USDC</p>
              </div>
            </div>
            <div className="mt-3 rounded-[10px] border border-white/10 bg-black/10 px-3 py-2.5">
              <p className="text-[11px] text-zinc-400">iREAL {lang === "cn" ? "余额" : "Balance"}</p>
              <p className="mt-1 break-all font-mono text-[17px] font-semibold leading-tight text-zinc-100">31,020,232.58 REAL</p>
            </div>
          </div>

          <h3 className="mb-2 mt-5 text-[18px] font-semibold">{lang === "cn" ? "资产列表" : "Assets"}</h3>
          {rows.length === 0 ? (
            <div className="flex flex-col items-center py-14">
              <SearchX className="size-12 text-zinc-600" strokeWidth={1.5} />
              <p className="mt-2 text-[14px] text-zinc-500">{lang === "cn" ? "暂无资产" : "No assets"}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {rows.map((row) => {
                const expanded = mobileExpandedAsset === row.id;
                return (
                  <article key={row.id} className="rounded-[12px] border border-white/10 bg-[#111216] px-3.5 py-3.5">
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-2 text-left"
                      onClick={() => setMobileExpandedAsset((prev) => (prev === row.id ? "" : row.id))}
                    >
                      <div className="flex items-center gap-2">
                        <div className="grid size-8 place-items-center overflow-hidden rounded-full border border-white/10 bg-[#1b1d24]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.iconUrl} alt={row.name} className="size-6 object-contain" />
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-zinc-100">{row.name}</p>
                          <p className="text-[12px] text-zinc-500">{row.issuer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[16px] font-semibold text-[#f5cb61]">{row.value}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">{row.approx}</p>
                      </div>
                    </button>

                    {expanded ? (
                      <div className="mt-3 rounded-[10px] border border-white/10 bg-white/[0.02] px-3 py-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-[10px] border border-white/8 bg-black/20 px-2.5 py-2">
                            <p className="text-[11px] text-zinc-500">{lang === "cn" ? "质押收益率" : "APR"}</p>
                            <p className="mt-1 text-[13px] font-medium text-zinc-200">{row.apr}</p>
                          </div>
                          <div className="rounded-[10px] border border-white/8 bg-black/20 px-2.5 py-2">
                            <p className="text-[11px] text-zinc-500">{lang === "cn" ? "累计收益" : "Total Yield"}</p>
                            <p className="mt-1 break-all font-mono text-[12px] text-zinc-200">{row.reward}</p>
                          </div>
                          <div className="rounded-[10px] border border-white/8 bg-black/20 px-2.5 py-2">
                            <p className="text-[11px] text-zinc-500">{lang === "cn" ? "昨日收益" : "Yesterday"}</p>
                            <p className="mt-1 break-all font-mono text-[12px] text-zinc-200">{row.yesterday}</p>
                          </div>
                          <div className="rounded-[10px] border border-white/8 bg-black/20 px-2.5 py-2">
                            <p className="text-[11px] text-zinc-500">{lang === "cn" ? "可用余额" : "Available"}</p>
                            <p className="mt-1 break-all font-mono text-[12px] text-zinc-200">{row.available}</p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button type="button" className="h-9 rounded-[8px] border border-white/15 bg-white/[0.03] text-[13px]" onClick={() => router.push(REALRWA_ROUTES.homeDetail)}>
                            {lang === "cn" ? "更多" : "More"}
                          </button>
                          <button type="button" className="h-9 rounded-[8px] border border-white/15 bg-white/[0.03] text-[13px]" onClick={() => setStakeOpen(true)}>
                            {lang === "cn" ? "质押" : "Stake"}
                          </button>
                          <button type="button" className="col-span-2 h-9 rounded-[8px] bg-[#d5b253] text-[13px] font-semibold text-black" onClick={onBuyAttempt}>
                            {lang === "cn" ? "购买" : "Buy"}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="hidden md:flex md:flex-col md:gap-6">
          <div className="flex gap-6">
            <PortfolioSidebar active="balance" />
            <div className="flex-1 rounded-2xl bg-[#171717] p-6 text-zinc-300">
              {lang === "cn" ? "桌面端保持原有信息结构，移动端已按设计稿重排。" : "Desktop layout keeps existing structure."}
            </div>
          </div>
        </div>
      </section>
      <StakeModal
        key={stakeOpen ? "stake-rwa1-open" : "stake-rwa1-closed"}
        open={stakeOpen}
        onClose={() => setStakeOpen(false)}
        onBuyRequest={() => setBuyOpen(true)}
      />
      <BuyModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        platformBalance={platformUsd1Balance}
        assetSymbol="RWA1"
        assetIcon="/tokens/rwa.svg"
        onStakeNow={() => setStakeOpen(true)}
      />
    </RealRwaShell>
  );
}

export function DetailPage() {
  return <BondDetailScreen activeNav={0} />;
}

export function StakedDetailPage() {
  return <BondDetailScreen activeNav={3} />;
}

function BondDetailScreen({ activeNav }: { activeNav: number }) {
  const { lang, text, identityBound } = useRwaAppState();
  const { insurancePolicies, stakingPositions, defaultEvents, getInsuranceProject } = useInsuranceDemo();
  const router = useRouter();
  const [stakeOpen, setStakeOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [mobileDetailSection, setMobileDetailSection] = useState<"detail" | "trade" | "stake" | "holder">("detail");
  const [mobileTradeMode, setMobileTradeMode] = useState<"buy" | "sell">("buy");
  const [mobileStakeMode, setMobileStakeMode] = useState<"stake" | "withdraw" | "claim">("stake");
  const detailAsset = PRIMARY_BOND_DETAIL;
  const insuranceProject = getInsuranceProject(detailAsset.symbol);
  const assetPolicies = insurancePolicies.filter((item) => item.assetSymbol === detailAsset.symbol);
  const latestPolicy = assetPolicies[0] ?? null;
  const assetPositions = stakingPositions.filter((item) => item.assetSymbol === detailAsset.symbol).slice(0, 2);
  const latestEvent = latestPolicy
    ? defaultEvents.find((item) => item.policyId === latestPolicy.policyId)
    : undefined;
  const latestPolicyStatus = latestPolicy
    ? getInsuranceStatusText(latestPolicy.policyStatus, lang)
    : null;
  const chartUpperBound = detailAsset.chartUpperBound;
  const chartAxisValues = [120, 100, 80, 60, 40, 20, 0];
  const chartPercentAxisValues = [210, 180, 150, 120, 90, 60, 30, 0];
  const firstChartPoint = detailAsset.chartPoints[0];
  const latestChartPoint = detailAsset.chartPoints[detailAsset.chartPoints.length - 1];
  const chartLinePoints = detailAsset.chartPoints
    .map((point, index) => {
      const x = (index / Math.max(detailAsset.chartPoints.length - 1, 1)) * 100;
      const y = 100 - (point.staked / chartUpperBound) * 100;
      return `${x},${y.toFixed(2)}`;
    })
    .join(" ");
  const detailMetrics = [
    {
      key: "price",
      label: lang === "cn" ? "价格" : "Price",
      value: (
        <>
          <span className="font-mono text-[25px] font-semibold tracking-[-0.03em] text-white xl:text-[27px]">
            ${detailAsset.price}
          </span>
          <span className="ml-2.5 font-mono text-[17px] text-zinc-400 xl:text-[18px]">
            ≈ {detailAsset.approx}
          </span>
        </>
      ),
    },
    {
      key: "apr",
      label: lang === "cn" ? "质押年化收益率" : "Stake APR",
      value: (
        <>
          <span className="font-mono text-[25px] font-semibold tracking-[-0.03em] text-white xl:text-[27px]">
            {detailAsset.apr}
          </span>
          <span className="mb-[1px] ml-2 font-mono text-[17px] text-zinc-400 xl:text-[18px]">%</span>
        </>
      ),
    },
    {
      key: "volume",
      label: lang === "cn" ? "总交易量" : "Total Volume",
      value: (
        <span className="font-mono text-[25px] font-semibold tracking-[-0.03em] text-white xl:text-[27px]">
          $ {detailAsset.volume}
        </span>
      ),
    },
  ] as const;
  const detailInfoRows = [
    {
      label: lang === "cn" ? "金融发行方:" : "Issuer:",
      value: detailAsset.issuerFull,
    },
    {
      label: lang === "cn" ? "发行时间:" : "Issue Time:",
      value: detailAsset.issueTime,
    },
    {
      label: lang === "cn" ? "债券期限:" : "Duration:",
      value: detailAsset.duration,
    },
    {
      label: lang === "cn" ? "发行规模:" : "Issue Size:",
      value: detailAsset.issueScale,
    },
    {
      label: lang === "cn" ? "单次起购数量:" : "Min Purchase:",
      value: detailAsset.minBuy,
    },
    {
      label: lang === "cn" ? "链上市值:" : "On-chain Market Cap:",
      value: detailAsset.marketCap,
    },
  ] as const;
  const mobileInformationRows = [
    {
      title: lang === "cn" ? "RWA 正在把传统金融带到链上" : "RWA is bringing traditional finance on-chain",
      time: "2025-12-19",
    },
    {
      title: lang === "cn" ? "RWA 正在重构“卷积式”证券化流程" : "RWA is reshaping the securitization pipeline",
      time: "2025-12-12",
    },
  ] as const;
  const [mobileTradeAmount, setMobileTradeAmount] = useState("0.00");
  const [mobileTradeValue, setMobileTradeValue] = useState("0.00");
  const [mobileStakeAmount, setMobileStakeAmount] = useState("0.00");
  const [mobileStakeReceiveAmount, setMobileStakeReceiveAmount] = useState("0.00");
  const [mobileClaimRealAmount, setMobileClaimRealAmount] = useState("0.00");
  const [mobileClaimCycle, setMobileClaimCycle] = useState<"daily" | "weekly" | "monthly">("daily");
  const isBuyMode = mobileTradeMode === "buy";
  const tradeFromToken = isBuyMode ? "USDC" : "AUSD";
  const tradeToToken = isBuyMode ? "AUSD" : "USDC";
  const tradeFromPrice = isBuyMode ? "1.00" : "1.0008";
  const tradeToPrice = isBuyMode ? "1.0008" : "1.00";
  const tradeAmountAvailable = isBuyMode ? "12,700,274.223 AUSD" : "10,274.223 USDC";
  const tradeValueAvailable = isBuyMode ? "10,274.223 USDC" : "12,700,274.223 AUSD";
  const onBuyAttempt = () => {
    if (!identityBound) {
      window.dispatchEvent(new Event(OPEN_IDENTITY_VERIFICATION_EVENT));
      return;
    }
    setBuyOpen(true);
  };

  return (
    <RealRwaShell activeNav={activeNav}>
      <section className="mx-auto max-w-[1380px] px-5 py-6 pb-28 sm:px-6 lg:px-7 xl:pb-6">
        <button
          className="detail-back-btn mb-8 flex items-center gap-2 text-[16px] font-semibold md:text-[17px]"
          onClick={() =>
            router.push(activeNav === 2 ? REALRWA_ROUTES.staked : REALRWA_ROUTES.home)
          }
          type="button"
        >
          <ArrowLeft className="size-5 md:size-6" />
          {lang === "cn" ? "债券详情" : "Bond Details"}
        </button>

        <div className="xl:hidden">
          <div className="relative overflow-hidden rounded-[14px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,16,18,0.96),rgba(11,11,12,0.95))] px-4 py-4">
            <div className="pointer-events-none absolute right-[-22px] top-[-16px] size-[150px] rounded-full border border-white/5 bg-[radial-gradient(circle_at_36%_30%,rgba(255,219,114,0.1),transparent_50%)]" />
            <div className="flex items-center gap-3">
              <div className="relative grid size-[56px] place-items-center rounded-full border border-[#323847] bg-[radial-gradient(circle_at_35%_30%,rgba(64,76,103,0.28),rgba(11,14,20,0.96))] shadow-[0_8px_22px_rgba(0,0,0,0.36)]">
                <span className="pointer-events-none absolute inset-[5px] rounded-full border border-white/10" />
                <span className="pointer-events-none absolute inset-[11px] rounded-full bg-[#0d1118]" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detailAsset.icon}
                  alt={detailAsset.symbol}
                  className="relative z-[1] size-[34px] object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
                />
              </div>
              <div>
                <p className="text-[24px] font-semibold leading-none text-white">{detailAsset.symbol}</p>
                <p className="mt-1 text-[12px] text-zinc-500">{detailAsset.issuer}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-[10px] border border-white/8 bg-white/[0.03] px-3 py-2.5">
                <p className="text-[12px] text-zinc-400">{lang === "cn" ? "最优价格" : "Best Price"}</p>
                <p className="mt-1.5 text-[20px] font-semibold leading-none text-white">
                  ${detailAsset.price}
                  <span className="ml-1 text-[11px] font-medium text-zinc-500">≈ {detailAsset.approx}</span>
                </p>
              </div>
              <div className="rounded-[10px] border border-white/8 bg-white/[0.03] px-3 py-2.5">
                <p className="text-[12px] text-zinc-400">{lang === "cn" ? "综合收益构成" : "Total Return"}</p>
                <p className="mt-1.5 text-[20px] font-semibold leading-none text-white">
                  {detailAsset.apr}
                  <span className="ml-1 text-[12px] text-zinc-500">%</span>
                </p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 rounded-[10px] border border-[#5f4e28] bg-[linear-gradient(90deg,rgba(52,42,24,0.88),rgba(45,38,27,0.82))] px-3 py-2.5">
              <div>
                <p className="text-[11px] text-zinc-400">{lang === "cn" ? "累计奖励" : "Reward"}</p>
                <p className="mt-1 text-[20px] font-semibold leading-none text-[#f1be58]">100,000.01</p>
                <p className="mt-1 text-[12px] text-zinc-400">AUSD</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400">{lang === "cn" ? "未领取收益" : "Unclaimed"}</p>
                <p className="mt-1 text-[20px] font-semibold leading-none text-[#f5cd7a]">120,000.01</p>
                <p className="mt-1 text-[12px] text-zinc-400">USDC</p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 overflow-hidden rounded-[10px] border border-white/10 bg-[#121214]">
            {[
              { key: "detail", label: lang === "cn" ? "详情" : "Detail" },
              { key: "trade", label: lang === "cn" ? "交易" : "Trade" },
              { key: "stake", label: lang === "cn" ? "质押" : "Stake" },
              { key: "holder", label: lang === "cn" ? "持有者" : "Holders" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                className={`h-9 border-b-2 text-[13px] font-medium ${
                  mobileDetailSection === item.key
                    ? "border-[#dfbb67] text-[#dfbb67]"
                    : "border-transparent text-zinc-500"
                }`}
                onClick={() => setMobileDetailSection(item.key as "detail" | "trade" | "stake" | "holder")}
              >
                {item.label}
              </button>
            ))}
          </div>

          {mobileDetailSection === "detail" ? (
            <div className="mt-4 space-y-3">
              <div className="flex gap-2 rounded-[999px] border border-white/10 bg-[#121316] p-1">
                {["近7天", "近30天", "近90天", "近1年"].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={`flex-1 rounded-full px-2 py-1.5 text-[12px] ${
                      index === 0 ? "bg-[#1b1d22] text-white" : "text-zinc-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="rounded-[12px] border border-white/10 bg-[#0d0e11] p-3">
                <div className="relative h-[180px]">
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {chartAxisValues.map((label, index) => (
                      <div
                        key={`mobile-chart-${label}`}
                        className={index === chartAxisValues.length - 1 ? "border-t border-white/20" : "border-t border-dashed border-white/15"}
                      />
                    ))}
                  </div>
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-x-0 bottom-[22px] top-0 z-[1] h-[calc(100%-22px)] w-full"
                  >
                    <polyline
                      points={chartLinePoints}
                      fill="none"
                      stroke="#4ed7db"
                      strokeWidth="0.56"
                      strokeDasharray="2.6 1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="absolute inset-x-0 bottom-[22px] top-0 z-[2] flex items-end gap-2">
                    {detailAsset.chartPoints.map((point, index) => {
                      const isVisibleBar = index >= detailAsset.chartPoints.length - 4;
                      const barHeight = isVisibleBar
                        ? Math.max((point.staked / chartUpperBound) * 100, 6)
                        : 0;
                      return (
                        <div key={`bar-${point.label}`} className="flex h-full flex-1 items-end justify-center">
                          <div
                            className={`w-[65%] rounded-t-[8px] ${
                              isVisibleBar
                                ? "bg-[linear-gradient(180deg,rgba(106,204,207,0.72),rgba(27,73,77,0.15)_100%)]"
                                : "bg-transparent"
                            }`}
                            style={{ height: `${barHeight}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] text-zinc-500">
                    <span>{firstChartPoint.label}</span>
                    <span>{latestChartPoint.label}</span>
                  </div>
                </div>
                <p className="mt-2 text-right text-[11px] text-zinc-500">
                  {lang === "cn" ? "更新时间" : "Updated"}: {detailAsset.scheduleDate}
                </p>
              </div>
              <div className="rounded-[12px] border border-white/10 bg-[#0d0e11] p-3">
                <p className="text-[13px] font-semibold text-white">{lang === "cn" ? "更多信息" : "More Detail"}</p>
                <p className="mt-2 text-[12px] leading-6 text-zinc-400">{detailAsset.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {detailAsset.tags.map((tag) => (
                    <span key={tag} className="rounded-[8px] border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  {detailInfoRows.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-3 rounded-[8px] border border-white/8 bg-black/20 px-3 py-2">
                      <span className="text-[11px] text-zinc-500">{row.label}</span>
                      <span className="text-right font-mono text-[11px] text-zinc-200">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {mobileInformationRows.map((row) => (
                <button
                  key={row.title}
                  type="button"
                  className="flex w-full items-center justify-between rounded-[12px] border border-white/10 bg-[#0d0e11] px-3 py-3 text-left"
                >
                  <div className="pr-3">
                    <p className="text-[12px] text-zinc-200">{row.title}</p>
                    <p className="mt-1 text-[11px] text-zinc-500">{row.time}</p>
                  </div>
                  <ArrowRight className="size-4 text-zinc-500" />
                </button>
              ))}
            </div>
          ) : null}

          {mobileDetailSection === "trade" ? (
            <div className="mt-4 space-y-3">
              <div className="mx-auto flex w-fit rounded-full border border-white/10 bg-[#111216] p-1">
                {[
                  { key: "buy", label: lang === "cn" ? "购买" : "Buy" },
                  { key: "sell", label: lang === "cn" ? "卖出" : "Sell" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`min-w-[86px] rounded-full px-4 py-1.5 text-[13px] ${
                      mobileTradeMode === item.key ? "bg-black text-white" : "text-zinc-500"
                    }`}
                    onClick={() => setMobileTradeMode(item.key as "buy" | "sell")}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="rounded-[12px] border border-white/10 bg-[#0d0e11] p-3">
                <p className="text-[13px] text-zinc-300">{lang === "cn" ? "价格" : "Price"}</p>
                <div className="mt-2 rounded-[10px] border border-white/8 bg-[#15171d] px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <ChartColumnBig className="size-4 text-zinc-500" />
                      <span className="text-[12px]">{lang === "cn" ? "做市商 (LP)" : "Maker (LP)"}</span>
                      <span className="rounded bg-[#e05f5f] px-1.5 py-0.5 text-[10px] text-white">
                        {lang === "cn" ? "推荐" : "Hot"}
                      </span>
                    </div>
                    <ChevronDown className="size-4 text-zinc-500" />
                  </div>
                  <p className="mt-1 text-[14px] text-zinc-300">{lang === "cn" ? "做市商A名称" : "Maker A Name"}</p>
                </div>

                <div className="mt-2 grid grid-cols-[1fr_42px_1fr] gap-2">
                  <div className="rounded-[10px] border border-white/8 bg-[#17191f] px-2.5 py-2">
                    <div className="flex items-center justify-between rounded-[8px] bg-[#20232a] px-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="grid size-5 place-items-center rounded-full border border-[#4ea6ff]/45 bg-[#11345a] text-[11px] text-[#65b2ff]">$</span>
                        <span className="text-[12px] text-zinc-200">{tradeFromToken}</span>
                      </div>
                      <ChevronDown className="size-3 text-zinc-500" />
                    </div>
                    <p className="mt-1.5 font-mono text-[22px] font-semibold leading-none text-white">{tradeFromPrice}</p>
                  </div>
                  <div className="grid place-items-center">
                    <button type="button" className="grid size-9 place-items-center rounded-[10px] border border-white/20 bg-[#1a1b20] text-zinc-300">
                      <ArrowRightLeft className="size-4" />
                    </button>
                  </div>
                  <div className="rounded-[10px] border border-white/8 bg-[#17191f] px-2.5 py-2">
                    <div className="flex items-center justify-between rounded-[8px] bg-[#20232a] px-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="grid size-5 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={detailAsset.icon} alt={tradeToToken} className="size-[12px] object-contain" />
                        </div>
                        <span className="text-[12px] text-zinc-200">{tradeToToken}</span>
                      </div>
                    </div>
                    <p className="mt-1.5 font-mono text-[22px] font-semibold leading-none text-white">{tradeToPrice}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-[13px] text-zinc-300">{lang === "cn" ? "数量" : "Amount"}</p>
                    <div className="mt-1.5 rounded-[10px] border border-white/10 bg-[#0a0a0d] px-2.5 py-2">
                      <div className="flex min-w-0 items-center justify-between gap-2">
                        <input
                          value={mobileTradeAmount}
                          onChange={(event) => setMobileTradeAmount(event.target.value)}
                          className="h-8 min-w-0 flex-1 bg-transparent font-mono text-[18px] text-zinc-100 outline-none"
                        />
                        <button type="button" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] text-zinc-200">
                          <div className="grid size-4 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={detailAsset.icon} alt={tradeToToken} className="size-[10px] object-contain" />
                          </div>
                          {tradeToToken}
                          <span className="whitespace-nowrap text-[#FACC15]">{lang === "cn" ? "最大" : "Max"}</span>
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 truncate text-[12px] text-zinc-500">{lang === "cn" ? "可用:" : "Avail:"} {tradeAmountAvailable}</p>
                  </div>

                  <div className="grid place-items-center">
                    <button type="button" className="grid size-9 place-items-center rounded-[10px] border border-white/20 bg-[#1e2026] text-zinc-300">
                      <ArrowRightLeft className="size-4 rotate-90" />
                    </button>
                  </div>

                  <div>
                    <p className="text-[13px] text-zinc-300">{lang === "cn" ? "价值" : "Value"}</p>
                    <div className="mt-1.5 rounded-[10px] border border-white/10 bg-[#0a0a0d] px-2.5 py-2">
                      <div className="flex min-w-0 items-center justify-between gap-2">
                        <input
                          value={mobileTradeValue}
                          onChange={(event) => setMobileTradeValue(event.target.value)}
                          className="h-8 min-w-0 flex-1 bg-transparent font-mono text-[18px] text-zinc-100 outline-none"
                        />
                        <button type="button" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] text-zinc-200">
                          <span className="grid size-4 place-items-center rounded-full border border-[#4ea6ff]/45 bg-[#11345a] text-[10px] text-[#65b2ff]">$</span>
                          {tradeFromToken}
                          <span className="whitespace-nowrap text-[#FACC15]">{lang === "cn" ? "最大" : "Max"}</span>
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 truncate text-[12px] text-zinc-500">
                      {lang === "cn" ? "可用:" : "Avail:"} {tradeValueAvailable}
                      <button type="button" className="ml-1.5 whitespace-nowrap text-[#FACC15]">{lang === "cn" ? "去充值" : "Deposit"}</button>
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-[10px] border border-white/8 bg-[#17191f] px-2.5 py-2">
                  <p className="inline-flex items-center gap-2 text-[13px] text-zinc-300">
                    <Flame className="size-4 text-[#f8a100]" />
                    GAS {lang === "cn" ? "费" : "Fee"}: <span className="font-mono">0.5 BNB ≈$10</span>
                  </p>
                  <p className="mt-1 text-[12px] text-zinc-500">{lang === "cn" ? "可用: 0.01 BNB" : "Avail: 0.01 BNB"}</p>
                </div>

                <Button
                  className="mt-4 real-gold-btn h-[44px] w-full rounded-[10px] text-[16px] font-semibold"
                  onClick={() => {
                    if (mobileTradeMode === "buy") {
                      onBuyAttempt();
                    } else {
                      setSellOpen(true);
                    }
                  }}
                >
                  {mobileTradeMode === "buy" ? (lang === "cn" ? "购买" : "Buy") : lang === "cn" ? "卖出" : "Sell"}
                </Button>
              </div>
            </div>
          ) : null}

          {mobileDetailSection === "stake" ? (
            <div className="mt-4 space-y-3">
              <div className="mx-auto flex w-fit rounded-full border border-white/10 bg-[#111216] p-1">
                {[
                  { key: "stake", label: lang === "cn" ? "质押" : "Stake" },
                  { key: "withdraw", label: lang === "cn" ? "赎回" : "Redeem" },
                  { key: "claim", label: lang === "cn" ? "奖励" : "Reward" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`min-w-[78px] rounded-full px-3 py-1.5 text-[13px] ${
                      mobileStakeMode === item.key ? "bg-black text-white" : "text-zinc-500"
                    }`}
                    onClick={() => setMobileStakeMode(item.key as "stake" | "withdraw" | "claim")}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="rounded-[12px] border border-white/10 bg-[#0d0e11] p-3">
                {mobileStakeMode === "claim" ? (
                  <>
                    <div>
                      <p className="text-[13px] text-zinc-300">{lang === "cn" ? "数量" : "Amount"}</p>
                      <div className="mt-1.5 rounded-[10px] border border-white/10 bg-[#0a0a0d] px-2.5 py-2">
                        <div className="flex min-w-0 items-center justify-between gap-2">
                          <input
                            value={mobileStakeAmount}
                            onChange={(event) => setMobileStakeAmount(event.target.value)}
                            className="h-8 min-w-0 flex-1 bg-transparent font-mono text-[18px] text-zinc-100 outline-none"
                          />
                          <button type="button" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] text-zinc-200">
                            <span className="grid size-4 place-items-center rounded-full border border-[#4ea6ff]/45 bg-[#11345a] text-[10px] text-[#65b2ff]">$</span>
                            USDC
                            <span className="whitespace-nowrap text-[#FACC15]">{lang === "cn" ? "最大" : "Max"}</span>
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 truncate text-[12px] text-zinc-500">{lang === "cn" ? "未领取: 12,700,274.223 USDC" : "Unclaimed: 12,700,274.223 USDC"}</p>
                    </div>

                    <div className="mt-3 rounded-[10px] border border-white/10 bg-[#121317] px-2.5 py-2">
                      <p className="text-[12px] text-zinc-400">{lang === "cn" ? "领取条件" : "Claim rule"}</p>
                      <select
                        className="mt-1.5 h-8 w-full rounded-[8px] border border-white/10 bg-[#0a0a0d] px-2 text-[12px] text-zinc-300 outline-none"
                        value={mobileClaimCycle}
                        onChange={(event) => setMobileClaimCycle(event.target.value as "daily" | "weekly" | "monthly")}
                      >
                        <option value="daily">{lang === "cn" ? "每天领取一次" : "Claim daily"}</option>
                        <option value="weekly">{lang === "cn" ? "每周领取一次" : "Claim weekly"}</option>
                        <option value="monthly">{lang === "cn" ? "每月领取一次" : "Claim monthly"}</option>
                      </select>
                    </div>

                    <div className="mt-3">
                      <p className="text-[13px] text-zinc-300">REAL {lang === "cn" ? "数量" : "Amount"}</p>
                      <div className="mt-1.5 rounded-[10px] border border-white/10 bg-[#0a0a0d] px-2.5 py-2">
                        <div className="flex min-w-0 items-center justify-between gap-2">
                          <input
                            value={mobileClaimRealAmount}
                            onChange={(event) => setMobileClaimRealAmount(event.target.value)}
                            className="h-8 min-w-0 flex-1 bg-transparent font-mono text-[18px] text-zinc-100 outline-none"
                          />
                          <button type="button" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] text-zinc-200">
                            <span className="grid size-4 place-items-center rounded-full border border-[#f5ce61]/35 bg-[#32270f] text-[9px] text-[#f5ce61]">R</span>
                            REAL
                            <span className="whitespace-nowrap text-[#FACC15]">{lang === "cn" ? "最大" : "Max"}</span>
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 truncate text-[12px] text-zinc-500">{lang === "cn" ? "未领取: 12,700,274.223 REAL" : "Unclaimed: 12,700,274.223 REAL"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-[13px] text-zinc-300">{lang === "cn" ? "数量" : "Amount"}</p>
                      <div className="mt-1.5 rounded-[10px] border border-white/10 bg-[#0a0a0d] px-2.5 py-2">
                        <div className="flex min-w-0 items-center justify-between gap-2">
                          <input
                            value={mobileStakeAmount}
                            onChange={(event) => setMobileStakeAmount(event.target.value)}
                            className="h-8 min-w-0 flex-1 bg-transparent font-mono text-[18px] text-zinc-100 outline-none"
                          />
                          <button type="button" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] text-zinc-200">
                            <div className="grid size-4 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={detailAsset.icon} alt="AUSD" className="size-[10px] object-contain" />
                            </div>
                            AUSD
                            <span className="whitespace-nowrap text-[#FACC15]">{lang === "cn" ? "最大" : "Max"}</span>
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 truncate text-[12px] text-zinc-500">{lang === "cn" ? "可用: 12,700,274.223 AUSD" : "Avail: 12,700,274.223 AUSD"}</p>
                    </div>
                    <div className="mt-2 grid place-items-center">
                      <button type="button" className="grid size-9 place-items-center rounded-[10px] border border-white/20 bg-[#1e2026] text-zinc-300">
                        <ArrowRight className="size-4 rotate-90" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <p className="text-[13px] text-zinc-300">{lang === "cn" ? "接收" : "Receive"}</p>
                      <div className="mt-1.5 rounded-[10px] border border-white/10 bg-[#0a0a0d] px-2.5 py-2">
                        <div className="flex min-w-0 items-center justify-between gap-2">
                          <input
                            value={mobileStakeReceiveAmount}
                            onChange={(event) => setMobileStakeReceiveAmount(event.target.value)}
                            className="h-8 min-w-0 flex-1 bg-transparent font-mono text-[18px] text-zinc-100 outline-none"
                          />
                          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] text-zinc-200">
                            <span className="grid size-4 place-items-center rounded-full border border-[#f5ce61]/35 bg-[#32270f] text-[9px] text-[#f5ce61]">R</span>
                            Rtoken
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-3 rounded-[10px] border border-white/8 bg-[#17191f] px-2.5 py-2">
                  <p className="inline-flex items-center gap-2 text-[13px] text-zinc-300">
                    <Flame className="size-4 text-[#f8a100]" />
                    Fee: <span className="font-mono">0.5 BNB ≈$10</span>
                  </p>
                  <p className="mt-1 text-[12px] text-zinc-500">{lang === "cn" ? "可用: 0.01 BNB" : "Avail: 0.01 BNB"}</p>
                </div>

                <Button
                  className="mt-4 real-gold-btn h-[44px] w-full rounded-[10px] text-[16px] font-semibold"
                  onClick={() => {
                    if (mobileStakeMode === "stake") {
                      setStakeOpen(true);
                    } else if (mobileStakeMode === "withdraw") {
                      setRedeemOpen(true);
                    } else {
                      setClaimOpen(true);
                    }
                  }}
                >
                  {mobileStakeMode === "stake"
                    ? (lang === "cn" ? "质押" : "Stake")
                    : mobileStakeMode === "withdraw"
                      ? (lang === "cn" ? "赎回" : "Redeem")
                      : (lang === "cn" ? "领取" : "Claim")}
                </Button>
              </div>
            </div>
          ) : null}

          {mobileDetailSection === "holder" ? (
            <div className="mt-4 rounded-[12px] border border-white/10 bg-[#0d0e11] p-3">
              <p className="mb-2 text-[13px] font-semibold text-white">{lang === "cn" ? "持有者" : "Holders"}</p>
              <div className="overflow-hidden rounded-[10px] border border-white/8">
                <div className="grid grid-cols-[1.45fr_0.7fr_0.45fr] border-b border-white/10 bg-white/[0.04] px-2.5 py-2 text-[11px] text-zinc-500">
                  <span>{lang === "cn" ? "用户地址" : "Address"}</span>
                  <span>{lang === "cn" ? "数量" : "Amount"}</span>
                  <span className="text-right">{lang === "cn" ? "时间" : "Time"}</span>
                </div>
                {MOBILE_HOLDER_ROWS.map((row) => (
                  <div key={`${row.address}-${row.age}`} className="grid grid-cols-[1.45fr_0.7fr_0.45fr] border-b border-white/8 px-2.5 py-2 text-[12px]">
                    <span className="truncate text-zinc-300">{row.address}</span>
                    <span className="font-mono text-zinc-300">{row.amount}</span>
                    <span className="text-right text-zinc-500">{row.age}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <button type="button" className="grid size-7 place-items-center rounded-[6px] border border-white/12 text-zinc-500">{"<"}</button>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={`holder-page-${num}`}
                    type="button"
                    className={`grid h-7 w-7 place-items-center rounded-[6px] text-[12px] ${
                      num === 1 ? "bg-[#d5b253] text-black" : "border border-white/12 bg-white/[0.03] text-zinc-500"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button type="button" className="grid size-7 place-items-center rounded-[6px] border border-white/12 text-zinc-500">{">"}</button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden gap-8 xl:grid xl:grid-cols-[minmax(0,1.66fr)_420px] 2xl:grid-cols-[minmax(0,1.58fr)_460px] xl:items-start">
          <div>
            <div className="mb-7 flex items-center gap-4">
              <div className="relative grid size-[72px] place-items-center rounded-full border border-[#323847] bg-[radial-gradient(circle_at_35%_30%,rgba(64,76,103,0.28),rgba(11,14,20,0.96))] shadow-[0_12px_26px_rgba(0,0,0,0.36)]">
                <span className="pointer-events-none absolute inset-[6px] rounded-full border border-white/10" />
                <span className="pointer-events-none absolute inset-[14px] rounded-full bg-[#0d1118]" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detailAsset.icon}
                  alt={detailAsset.symbol}
                  className="relative z-[1] size-[42px] object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.45)]"
                />
              </div>
              <div>
                <h2 className="text-[32px] font-semibold leading-none tracking-[-0.04em] text-white md:text-[36px]">
                  {detailAsset.symbol}
                </h2>
                <p className="mt-2 text-[16px] text-zinc-500">{detailAsset.issuer}</p>
              </div>
            </div>

            <div className="mb-5 grid gap-4 md:grid-cols-3">
              {detailMetrics.map((metric) => (
                <div
                  key={metric.key}
                  className="relative min-h-[156px] overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,24,24,0.96),rgba(18,18,18,0.96))] px-7 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] 2xl:min-h-[168px] 2xl:px-8 2xl:py-7"
                >
                  <ShieldCheck className="pointer-events-none absolute right-6 top-6 size-24 text-white/[0.05]" strokeWidth={1.1} />
                  <p className="relative text-[18px] font-semibold text-zinc-300">{metric.label}</p>
                  <div className="mt-8 inline-flex flex-wrap items-end rounded-[10px] bg-white/[0.08] px-3 py-1.5 2xl:mt-10">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[22px] border border-white/10 bg-[#070707] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] xl:px-5">
              <div className="grid gap-3 md:grid-cols-[72px_minmax(0,1fr)_60px]">
                <div className="hidden h-[460px] flex-col justify-between text-[13px] text-zinc-500 xl:flex 2xl:h-[560px]">
                  {chartAxisValues.map((label) => (
                    <span key={label}>${label.toFixed(2)}K</span>
                  ))}
                </div>
                <div className="relative h-[460px] 2xl:h-[560px]">
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {chartAxisValues.map((label, index) => (
                      <div
                        key={`grid-${label}`}
                        className={index === chartAxisValues.length - 1 ? "border-t border-white/18" : "border-t border-dashed border-white/18"}
                      />
                    ))}
                  </div>
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-x-0 bottom-[22px] top-0 z-[1] h-[calc(100%-22px)] w-full"
                  >
                    <polyline
                      points={chartLinePoints}
                      fill="none"
                      stroke="#23d7db"
                      strokeWidth="0.45"
                      strokeDasharray="2.6 1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="absolute inset-x-0 bottom-[22px] top-0 z-[2] flex items-end gap-2.5 md:gap-3">
                    {detailAsset.chartPoints.map((point, index) => {
                      const isVisibleBar = index >= detailAsset.chartPoints.length - 3;
                      const barHeight = isVisibleBar
                        ? Math.max((point.staked / chartUpperBound) * 100, 6)
                        : 0;
                      const isHighlight = index >= detailAsset.chartPoints.length - 2;

                      return (
                        <div
                          key={point.label}
                          className="relative flex h-full flex-1 items-end justify-center"
                        >
                          <div
                            className={`relative w-[58%] min-w-[14px] rounded-t-[10px] ${
                              !isVisibleBar
                                ? "bg-transparent"
                                : isHighlight
                                  ? "bg-[linear-gradient(180deg,rgba(140,237,239,0.78),rgba(65,135,140,0.72)_46%,rgba(14,41,44,0.16)_100%)]"
                                  : "bg-[linear-gradient(180deg,rgba(79,149,153,0.38),rgba(22,46,48,0.18)_100%)]"
                            }`}
                            style={{ height: `${barHeight}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] text-zinc-500 md:text-[12px]">
                    <span>{firstChartPoint.label}</span>
                    <span>{latestChartPoint.label}</span>
                  </div>
                </div>
                <div className="hidden h-[460px] flex-col justify-between text-right text-[13px] text-zinc-500 xl:flex 2xl:h-[560px]">
                  {chartPercentAxisValues.map((label) => (
                    <span key={label}>{label}%</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-[28px] font-semibold tracking-[-0.03em] text-white">
                {lang === "cn" ? "详情" : "Details"}
              </h3>
              <p className="mt-6 max-w-[920px] text-[16px] leading-[1.65] text-zinc-400">
                {detailAsset.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-[16px] text-zinc-400">
                <span>{lang === "cn" ? "Token功能:" : "Token Features:"}</span>
                {detailAsset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-10 grid gap-x-12 gap-y-6 md:grid-cols-2">
                {detailInfoRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-4 text-[16px]">
                    <span className="min-w-[120px] text-zinc-400">{row.label}</span>
                    <span className="font-mono text-zinc-200">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <aside className="relative flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-[#4b432a] bg-[linear-gradient(135deg,rgba(38,35,31,0.98)_0%,rgba(50,45,38,0.96)_52%,rgba(92,74,23,0.42)_100%)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] xl:sticky xl:top-24 2xl:p-8">
            <div className="pointer-events-none absolute right-[-16%] top-[-10%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.14),transparent_64%)]" />
            <div className="relative">
              <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-white md:text-[26px]">
                {lang === "cn" ? "我的信息" : "My Info"}
              </h3>
            </div>
            <div className="relative mt-7 flex-1 rounded-[18px] bg-[linear-gradient(135deg,rgba(59,56,50,0.72),rgba(75,68,50,0.5))] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] 2xl:mt-8">
              <div className="space-y-0 divide-y divide-white/8">
                <div className="py-5 first:pt-0">
                  <p className="text-[16px] text-zinc-300">{lang === "cn" ? "余额" : "Balance"}</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-mono text-[31px] font-semibold tracking-[-0.04em] text-[#ffcf59] md:text-[34px]">
                      {detailAsset.balance}
                    </span>
                    <span className="mb-[3px] text-[16px] text-zinc-300">{detailAsset.balanceUnit}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] text-zinc-500">{detailAsset.balanceUsd}</p>
                </div>
                <div className="py-5">
                  <p className="text-[16px] text-zinc-300">{lang === "cn" ? "已质押" : "Staked"}</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-mono text-[31px] font-semibold tracking-[-0.04em] text-[#ffcf59] md:text-[34px]">
                      {detailAsset.staked}
                    </span>
                    <span className="mb-[3px] text-[16px] text-zinc-300">{detailAsset.stakedUnit}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] text-zinc-500">{detailAsset.stakedUsd}</p>
                </div>
                <div className="py-5">
                  <p className="text-[16px] text-zinc-300">{lang === "cn" ? "总奖励" : "Total Reward"}</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-mono text-[31px] font-semibold tracking-[-0.04em] text-[#ffcf59] md:text-[34px]">
                      {detailAsset.rewards}
                    </span>
                    <span className="mb-[3px] text-[16px] text-zinc-300">{detailAsset.rewardsUnit}</span>
                  </div>
                </div>
                <div className="pb-0 pt-5">
                  <p className="text-[16px] text-zinc-300">{lang === "cn" ? "可领取奖励" : "Claimable Reward"}</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="font-mono text-[31px] font-semibold tracking-[-0.04em] text-[#ffcf59] md:text-[34px]">
                      {detailAsset.claimable}
                    </span>
                    <span className="mb-[3px] text-[16px] text-zinc-300">{detailAsset.claimableUnit}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-6 grid grid-cols-4 gap-3 2xl:mt-7">
              <Button
                className="real-outline-btn h-[56px] rounded-[14px] border-white/22 bg-transparent text-[16px] font-semibold 2xl:h-[58px] 2xl:text-[17px]"
                onClick={() => setClaimOpen(true)}
              >
                {lang === "cn" ? "奖励" : "Claim"}
              </Button>
              <Button
                className="real-outline-btn h-[56px] rounded-[14px] border-white/22 bg-transparent text-[16px] font-semibold 2xl:h-[58px] 2xl:text-[17px]"
                onClick={() => setRedeemOpen(true)}
              >
                {text.redeem}
              </Button>
              <Button
                className="real-outline-btn h-[56px] rounded-[14px] border-white/22 bg-transparent text-[16px] font-semibold 2xl:h-[58px] 2xl:text-[17px]"
                onClick={() => setStakeOpen(true)}
              >
                {lang === "cn" ? "质押" : "Stake"}
              </Button>
              <Button
                className="real-gold-btn h-[56px] rounded-[14px] text-[16px] font-semibold 2xl:h-[58px] 2xl:text-[17px]"
                onClick={onBuyAttempt}
              >
                {text.buy}
              </Button>
            </div>

            <div className="relative mt-6 rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,18,18,0.88),rgba(11,11,11,0.92))] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#d6a152]">
                    INSURANCE COVERAGE
                  </p>
                  <h4 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-white">
                    {lang === "cn" ? "保险保障概览" : "Insurance Overview"}
                  </h4>
                </div>
                {latestPolicyStatus ? (
                  <span className={`rounded-full border px-3 py-1 text-[12px] ${latestPolicyStatus.toneClass}`}>
                    {latestPolicyStatus.label}
                  </span>
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] text-zinc-400">
                    {lang === "cn" ? "未投保" : "Not Insured"}
                  </span>
                )}
              </div>

              {latestPolicy ? (
                <>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <InsuranceOverviewMetric
                      label={lang === "cn" ? "保单编号" : "Policy ID"}
                      value={latestPolicy.policyId}
                      mono
                    />
                    <InsuranceOverviewMetric
                      label={lang === "cn" ? "保险档位" : "Coverage Ratio"}
                      value={`${latestPolicy.coverageRatio}%`}
                    />
                    <InsuranceOverviewMetric
                      label={lang === "cn" ? "保障额度" : "Coverage Amount"}
                      value={`$ ${latestPolicy.coverageAmount.toFixed(2)}`}
                    />
                    <InsuranceOverviewMetric
                      label={lang === "cn" ? "已付保费" : "Premium Paid"}
                      value={`$ ${latestPolicy.premiumPaid.toFixed(2)}`}
                    />
                    <InsuranceOverviewMetric
                      label={lang === "cn" ? "生效时间" : "Effective At"}
                      value={latestPolicy.effectiveAt}
                    />
                    <InsuranceOverviewMetric
                      label={lang === "cn" ? "到期时间" : "Expire At"}
                      value={latestPolicy.expireAt}
                    />
                  </div>

                  <div className="mt-4 rounded-[14px] border border-amber-400/18 bg-amber-500/10 px-4 py-3 text-[13px] leading-6 text-amber-100">
                    <p>
                      {latestEvent
                        ? lang === "cn"
                          ? `${latestEvent.noteCn} (${latestEvent.triggeredAt})`
                          : `${latestEvent.noteEn} (${latestEvent.triggeredAt})`
                        : latestPolicyStatus?.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="mt-4 rounded-[14px] border border-white/8 bg-white/[0.03] px-4 py-4 text-[13px] leading-6 text-zinc-400">
                  <p className="text-zinc-200">
                    {lang === "cn" ? "当前资产还没有保单记录。" : "No policy has been created for this asset yet."}
                  </p>
                  <p className="mt-2">
                    {insuranceProject
                      ? lang === "cn"
                        ? insuranceProject.riskNoticeCn
                        : insuranceProject.riskNoticeEn
                      : lang === "cn"
                        ? "当前资产暂未接入保险配置。"
                        : "This asset is not connected to the insurance config yet."}
                  </p>
                </div>
              )}

              <div className="mt-5 rounded-[14px] border border-white/8 bg-black/20 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[15px] font-semibold text-white">
                    {lang === "cn" ? "最近质押记录" : "Recent Positions"}
                  </p>
                  <button
                    type="button"
                    className="text-[12px] font-medium text-[#e5bc54]"
                    onClick={() => router.push(REALRWA_ROUTES.staked)}
                  >
                    {lang === "cn" ? "查看全部" : "View All"}
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {assetPositions.length > 0 ? (
                    assetPositions.map((position) => (
                      <div
                        key={position.positionId}
                        className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[12px] text-zinc-500">{position.createdAt}</span>
                          <span className="text-[12px] text-zinc-400">
                            {position.hasInsurance
                              ? lang === "cn"
                                ? "已质押 / 已投保"
                                : "Staked / Insured"
                              : lang === "cn"
                                ? "已质押"
                                : "Staked"}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-4 text-[14px] text-zinc-200">
                          <span>{position.stakedUnits.toFixed(4)} {position.assetSymbol}</span>
                          <span>$ {position.stakedValue.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3 text-[13px] text-zinc-500">
                      {lang === "cn" ? "暂无质押记录" : "No recent staking positions."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <StakeModal
        key={stakeOpen ? `stake-${detailAsset.symbol}-open` : `stake-${detailAsset.symbol}-closed`}
        open={stakeOpen}
        onClose={() => setStakeOpen(false)}
        onViewDashboard={() => router.push(REALRWA_ROUTES.staked)}
        onBuyRequest={() => setBuyOpen(true)}
        assetSymbol={detailAsset.symbol}
        assetIcon={detailAsset.icon}
        availableAmount={Number(detailAsset.balance)}
        aprValue={detailAsset.apr}
        scheduleDate={detailAsset.scheduleDate}
      />
      <ClaimModal
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
      />
      <RedeemModal
        open={redeemOpen}
        onClose={() => setRedeemOpen(false)}
      />
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
      />
      <BuyModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        platformBalance={10.0001}
        assetSymbol={detailAsset.symbol}
        assetIcon={detailAsset.icon}
        onStakeNow={() => setStakeOpen(true)}
      />
      <SellModal
        open={sellOpen}
        onClose={() => setSellOpen(false)}
      />
    </RealRwaShell>
  );
}

function MobileTradeBottomNav({ active }: { active: "market" | "orders" }) {
  const router = useRouter();
  const { lang } = useRwaAppState();
  const items = [
    {
      key: "market",
      label: lang === "cn" ? "市场" : "Market",
      route: REALRWA_ROUTES.home,
    },
    {
      key: "orders",
      label: lang === "cn" ? "订单" : "Order",
      route: REALRWA_ROUTES.portfolioTrade,
    },
  ] as const;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#161613] pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 md:hidden">
      <div className="mx-auto grid max-w-[520px] grid-cols-2">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`flex flex-col items-center gap-1 py-2 text-xs font-medium transition ${
              active === item.key
                ? "text-[#f0c456]"
                : "text-zinc-500"
            }`}
            onClick={() => router.push(item.route)}
          >
            {item.key === "market" ? <ChartColumnBig className="size-4" /> : <ReceiptText className="size-4" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileOrderDetailSheet({
  open,
  title,
  rows,
  statusLabel,
  onClose,
}: {
  open: boolean;
  title: string;
  rows: { label: string; value: string; mono?: boolean }[];
  statusLabel?: string;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#060606] md:hidden">
      <div className="px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
        <button
          type="button"
          className="mb-4 flex items-center gap-2 text-[22px] font-semibold text-white"
          onClick={onClose}
        >
          <ArrowLeft className="size-5" />
          {title}
        </button>
        <div className="rounded-[12px] border border-white/10 bg-[#111216] px-3 py-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[18px] font-semibold text-zinc-100">
              {(rows.find((row) => row.label.includes("交易对") || row.label === "Pair")?.value ?? "").split("/")[0]?.trim()}
            </p>
            <p className="font-mono text-[22px] text-rose-400">
              {rows.find((row) => row.label.includes("成交额") || row.label === "Value")?.value}
            </p>
          </div>
          <div className="space-y-2 border-t border-white/10 pt-2">
            {rows.map((row) => (
              <div key={`${row.label}-${row.value}`} className="flex items-center justify-between gap-3 text-[12px]">
                <span className="text-zinc-500">{row.label}:</span>
                <span className={`${row.mono ? "font-mono text-[11px]" : ""} text-right text-zinc-300`}>
                  {row.value}
                </span>
              </div>
            ))}
            {statusLabel ? (
              <div className="flex items-center justify-between pt-1 text-[12px]">
                <span className="text-zinc-500">状态:</span>
                <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                  {statusLabel}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsuranceOverviewMetric({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
      <p className="text-[12px] text-zinc-500">{label}</p>
      <p className={`mt-1 text-[14px] text-white ${mono ? "font-mono text-[12px]" : "font-medium"}`}>
        {value}
      </p>
    </div>
  );
}

export function StakedListCompactPage() {
  const { lang } = useRwaAppState();
  return (
    <RealRwaShell activeNav={3}>
      <section className="real-page-wrap mx-auto max-w-[1560px] px-6 py-8">
        <h2 className="text-2xl font-semibold md:text-3xl">{lang === "cn" ? "我的质押列表" : "My Stake List"}</h2>
        <div className="mt-5 rounded-2xl border border-white/10 bg-[#141414] p-5 text-base text-zinc-500">
          {lang === "cn" ? "暂无记录" : "No records"}
        </div>
      </section>
    </RealRwaShell>
  );
}

export function SampleOrderPage() {
  const { lang } = useRwaAppState();
  return (
    <RealRwaShell activeNav={0}>
      <section className="real-page-wrap mx-auto max-w-[1560px] px-6 py-8">
        <button className="mb-6 flex items-center gap-2 text-2xl font-semibold md:text-3xl">
          <ArrowLeft className="size-8" />
          {lang === "cn" ? "我的投资组合" : "My Portfolio"}
        </button>
        <div className="rounded-2xl bg-[#171717] p-6">
          <p className="text-lg text-zinc-400">
            {lang === "cn" ? "交易订单示例" : "Order List Sample"}
          </p>
          <p className="mt-2 font-mono text-3xl">{formatMoney(150.03)} USD1</p>
        </div>
      </section>
    </RealRwaShell>
  );
}

export function LendingOrdersPage() {
  return (
    <PortfolioOrdersPage
      activeNav={4}
      sidebarActive="lending"
      headers={["时间", "资产", "类型", "数量", "利率", "状态"]}
      headersEn={["Time", "Asset", "Type", "Amount", "APR", "Status"]}
      rows={[
        ["2026-03-02 11:00:00", "USD1", "Supply", "100,000.00", "4.82%", "Active"],
        ["2026-03-01 08:18:51", "RWA1", "Borrow", "39,147.00", "6.24%", "Active"],
      ]}
    />
  );
}

type PortfolioOrdersPageProps = {
  activeNav: number;
  sidebarActive: "trade" | "stake" | "lending" | "balance";
  headers: string[];
  headersEn: string[];
  rows: string[][];
};

function PortfolioOrdersPage({
  activeNav,
  sidebarActive,
  headers,
  headersEn,
  rows,
}: PortfolioOrdersPageProps) {
  const { lang } = useRwaAppState();
  return (
    <RealRwaShell activeNav={activeNav}>
      <section className="real-page-wrap portfolio-page mx-auto max-w-[1560px] px-6 py-8">
        <button className="portfolio-page-title mb-6 flex items-center gap-2 text-2xl font-semibold md:text-3xl">
          <ArrowLeft className="size-8" />
          {lang === "cn" ? "我的投资组合" : "My Portfolio"}
        </button>
        <div className="flex flex-col gap-6 md:flex-row">
          <PortfolioSidebar active={sidebarActive} />
          <div className="portfolio-table-wrap flex-1 rounded-2xl bg-[#1a1a1a] p-4">
            <div
              className="portfolio-table-head grid rounded-xl bg-white/5 px-4 py-4 text-base text-zinc-400"
              style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
            >
              {(lang === "cn" ? headers : headersEn).map((h) => (
                <div key={h}>{h}</div>
              ))}
            </div>
            {rows.map((row, idx) => (
              <div
                key={`${row[0]}-${idx}`}
                className="portfolio-table-row grid border-b border-white/10 px-4 py-4 transition-colors hover:bg-white/[0.04]"
                style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
              >
                {row.map((cell, cellIdx) => (
                  <div
                    key={`${cell}-${cellIdx}`}
                    className={cellIdx === row.length - 1 ? "text-emerald-400" : cellIdx === 0 ? "font-mono" : ""}
                  >
                    {cellIdx === row.length - 1 && lang === "cn"
                      ? cell === "Confirmed"
                        ? "已确认"
                        : cell === "Active"
                          ? "进行中"
                          : cell
                      : cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </RealRwaShell>
  );
}

type FeatureOverviewPageProps = {
  activeNav: number;
  title: string;
  subtitle: string;
  primaryMetric: string;
  primaryValue: string;
  secondaryMetric: string;
  secondaryValue: string;
  tertiaryMetric: string;
  tertiaryValue: string;
  tableTitle: string;
  headers: string[];
  rows: string[][];
};

function FeatureOverviewPage({
  activeNav,
  title,
  subtitle,
  primaryMetric,
  primaryValue,
  secondaryMetric,
  secondaryValue,
  tertiaryMetric,
  tertiaryValue,
  tableTitle,
  headers,
  rows,
}: FeatureOverviewPageProps) {
  const { lang } = useRwaAppState();
  const [mobileFeatureSection, setMobileFeatureSection] = useState<"overview" | "table">("overview");
  return (
    <RealRwaShell activeNav={activeNav}>
      <section className="feature-hero relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(250,204,21,0.12),transparent_34%),radial-gradient(circle_at_82%_42%,rgba(77,40,8,0.36),transparent_44%),linear-gradient(180deg,#070707_0%,#040404_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.42)_100%)]" />
        <div className="real-page-wrap relative mx-auto max-w-[1560px] px-6 py-14">
          <h1 className="feature-hero-title max-w-3xl bg-gradient-to-br from-white to-white/55 bg-clip-text text-4xl font-semibold text-transparent md:text-5xl">
            {title}
          </h1>
          <p className="feature-hero-sub mt-4 max-w-3xl text-lg text-zinc-300 md:text-xl">{subtitle}</p>
        </div>
      </section>

      <section className="real-page-wrap feature-page mx-auto mt-6 max-w-[1560px] px-6">
        <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-5 flex gap-2 overflow-x-auto md:hidden">
          {[
            { key: "overview", label: lang === "cn" ? "总览" : "Overview" },
            { key: "table", label: tableTitle },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                mobileFeatureSection === item.key
                  ? "border-[#f0c456]/55 bg-[#241b09] text-[#f0c456]"
                  : "border-white/10 bg-white/[0.03] text-zinc-300"
              }`}
              onClick={() => setMobileFeatureSection(item.key as "overview" | "table")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-4 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible">
          {[
            [primaryMetric, primaryValue],
            [secondaryMetric, secondaryValue],
            [tertiaryMetric, tertiaryValue],
          ].map(([label, value]) => (
            <div key={label} className="real-panel feature-metric-card min-w-[220px] rounded-2xl p-5 md:min-w-0">
              <p className="feature-metric-label text-sm text-zinc-500">{label}</p>
              <p className="feature-metric-value mt-2 font-mono text-3xl font-semibold tracking-tight">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={mobileFeatureSection === "table" ? "real-page-wrap feature-page mx-auto max-w-[1560px] px-6 pb-10 pt-5" : "real-page-wrap feature-page mx-auto max-w-[1560px] px-6 pb-10 pt-7 hidden md:block"}>
        <div className="rounded-2xl border border-white/10 bg-[#111214] p-4">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
            <h2 className="feature-table-title text-xl font-semibold">{tableTitle}</h2>
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center">
              <div className="feature-search flex h-10 w-full items-center rounded-lg border border-white/10 bg-black/40 px-3 md:w-[240px]">
                <Search className="mr-2 size-4 text-zinc-500" />
                <input
                  className="w-full bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-600"
                  placeholder={lang === "cn" ? "输入关键字" : "Search"}
                />
              </div>
              <button
                className="feature-date h-10 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-zinc-400"
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <Calendar className="size-4" />
                  {lang === "cn" ? "时间筛选" : "Date Range"}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {rows.map((row, idx) => (
              <article
                key={`mobile-row-${idx}`}
                className="rounded-[16px] border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  {row.map((cell, cIdx) => (
                    <div key={`mobile-${cell}-${cIdx}`} className="rounded-[12px] border border-white/8 bg-black/20 px-3 py-3">
                      <p className="text-[12px] text-zinc-500">{headers[cIdx]}</p>
                      <p className={`mt-1 truncate text-[14px] text-zinc-100 ${cIdx > 0 ? "font-mono" : ""}`}>{cell}</p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="feature-action real-outline-btn mt-4 h-10 w-full rounded-[12px] px-3 text-sm"
                  type="button"
                >
                  {lang === "cn" ? "详情" : "Detail"}
                </Button>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-white/6 md:block">
            <div
              className="feature-grid grid min-w-[840px] bg-white/5 px-4 py-3 text-sm text-zinc-400"
              style={{ gridTemplateColumns: `repeat(${headers.length + 1}, minmax(0, 1fr))` }}
            >
              {(lang === "cn" ? headers : headers).map((h) => (
                <div key={`head-${h}`} className="truncate">{h}</div>
              ))}
              <div className="text-right">{lang === "cn" ? "操作" : "Action"}</div>
            </div>
            {rows.map((row, idx) => (
              <div
                key={`row-${idx}`}
                className="feature-grid grid min-w-[840px] items-center border-t border-white/8 px-4 py-4 text-sm text-zinc-200"
                style={{ gridTemplateColumns: `repeat(${headers.length + 1}, minmax(0, 1fr))` }}
              >
                {row.map((cell, cIdx) => (
                  <div key={`${cell}-${cIdx}`} className={`truncate ${cIdx > 0 ? "font-mono" : ""}`}>
                    {cell}
                  </div>
                ))}
                <div className="text-right">
                  <Button
                    variant="outline"
                    className="feature-action real-outline-btn h-8 rounded-md px-3 text-xs"
                    type="button"
                  >
                    {lang === "cn" ? "详情" : "Detail"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={`page-${p}`}
                className={`feature-page-btn h-8 min-w-8 rounded-md border px-2 text-xs ${p === 1 ? "border-[#f0c456] bg-[#f0c456] text-black" : "border-white/10 bg-black/30 text-zinc-400"}`}
                type="button"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>
    </RealRwaShell>
  );
}
