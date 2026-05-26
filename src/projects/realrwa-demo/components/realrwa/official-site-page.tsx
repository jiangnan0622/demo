"use client";

import { useState } from "react";
import {
  ArrowRight,
  Globe,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { publicAsset } from "@/lib/public-asset";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import { REALRWA_ROUTES } from "@/projects/realrwa-demo/lib/realrwa-routes";

const NAV_CN = ["交易", "市场", "质押", "借贷", "储备金", "保险", "邀请", "OTC"];
const NAV_EN = ["Trade", "Market", "Staking", "Lend", "Reserve", "Insurance", "Invitation", "OTC"];

const ROUTES = [
  REALRWA_ROUTES.home,
  REALRWA_ROUTES.market,
  REALRWA_ROUTES.staked,
  REALRWA_ROUTES.lending,
  REALRWA_ROUTES.reserveFund,
  REALRWA_ROUTES.insurance,
  REALRWA_ROUTES.invitation,
  REALRWA_ROUTES.otc,
] as const;

const ECOSYSTEM_HIGHLIGHTS = [
  {
    titleCn: "基于债券",
    titleEn: "Bond-based Core",
    descCn: "债券代币化后，可用于生态资产配置并提升资金流转效率。",
    descEn: "Tokenized bonds serve as the core asset layer for more efficient capital movement.",
    tone: "violet" as const,
  },
  {
    titleCn: "$REAL",
    titleEn: "$REAL",
    descCn: "作为生态治理核心，赋能社区决策，保障操作透明。",
    descEn: "Governance core that empowers transparent community decision-making.",
    tone: "gold" as const,
  },
] as const;

const FINANCE_GROUPS = [
  {
    subtitleCn: "创新技术桥接传统与DeFi",
    subtitleEn: "Innovation bridging traditional finance and DeFi",
    items: [
      {
        titleCn: "高门槛与排他性",
        titleEn: "High barriers and exclusivity",
        descCn: "数十亿人被排除在核心金融服务之外",
        descEn: "Billions excluded from core financial services",
        badgeCn: "1,000,000,000+",
        badgeEn: "1,000,000,000+",
        tone: "violet" as const,
      },
      {
        titleCn: "效率低下与高成本",
        titleEn: "Low efficiency and high cost",
        descCn: "跨境支付与清算耗时数日，中间环节繁多",
        descEn: "Cross-border settlement takes days with too many intermediaries",
        badgeCn: "3-5 Days",
        badgeEn: "3-5 Days",
        tone: "violet" as const,
      },
      {
        titleCn: "流动性割裂",
        titleEn: "Fragmented liquidity",
        descCn: "全球资本无法在统一的市场上自由流动",
        descEn: "Global capital cannot move freely in one unified market",
        badgeCn: "24/7",
        badgeEn: "24/7",
        tone: "violet" as const,
      },
    ],
  },
  {
    subtitleCn: "一体化生态交易质押借贷",
    subtitleEn: "Integrated trade, staking and lending",
    items: [
      {
        titleCn: "极致的交易体验",
        titleEn: "Best trading experience",
        descCn: "自有流动性，为您找到RWA最优价格。",
        descEn: "Native liquidity helps discover the best price for RWA.",
        badgeCn: "+50%",
        badgeEn: "+50%",
        tone: "gold" as const,
      },
      {
        titleCn: "RWA资产质押",
        titleEn: "RWA asset staking",
        descCn: "RWA代币进行质押，赚取高额收益。",
        descEn: "Stake RWA assets and earn attractive yields.",
        badgeCn: "RWA",
        badgeEn: "RWA",
        tone: "gold" as const,
      },
      {
        titleCn: "$REAL挖矿",
        titleEn: "$REAL mining",
        descCn: "构建一个强大的复合收益引擎",
        descEn: "Build a powerful compounding yield engine.",
        badgeCn: "Mining",
        badgeEn: "Mining",
        tone: "gold" as const,
      },
    ],
  },
  {
    subtitleCn: "可靠保险保障投资安全",
    subtitleEn: "Reliable insurance for investment safety",
    items: [
      {
        titleCn: "全方位的保险架构",
        titleEn: "Comprehensive insurance architecture",
        descCn: "为您的RWA提供无缝的安全守护",
        descEn: "Seamless protection for your RWA positions.",
        badgeCn: "100%",
        badgeEn: "100%",
        tone: "emerald" as const,
      },
      {
        titleCn: "深化信任",
        titleEn: "Deepen trust",
        descCn: "为您的RWA提供无缝的安全守护。",
        descEn: "Enhance trust with visible protection rails.",
        badgeCn: "Audit",
        badgeEn: "Audit",
        tone: "emerald" as const,
      },
      {
        titleCn: "升华价值",
        titleEn: "Elevate value",
        descCn: "无忧投资，安心见证财富增长",
        descEn: "Invest with confidence and witness long-term growth.",
        badgeCn: "Shield",
        badgeEn: "Shield",
        tone: "emerald" as const,
      },
    ],
  },
] as const;

const WHY_LIFE = [
  {
    prefixCn: "破局",
    suffixCn: "· 新纪元",
    prefixEn: "Breakthrough",
    suffixEn: "· New Era",
    descCn: "以RWA驱动增长新纪元，引领资产进化之路。",
    descEn: "Use RWA to drive a new era of growth and asset evolution.",
  },
  {
    prefixCn: "立势",
    suffixCn: "· 新流动",
    prefixEn: "Momentum",
    suffixEn: "· New Liquidity",
    descCn: "彻底破解传统债券高门槛，实现资本无缝流动。",
    descEn: "Break traditional bond barriers and unlock seamless capital mobility.",
  },
  {
    prefixCn: "立范",
    suffixCn: "· 新基建",
    prefixEn: "Paradigm",
    suffixEn: "· New Infra",
    descCn: "立融合之范，定义下一代金融基础设施。",
    descEn: "Define the next generation of financial infrastructure.",
  },
];

const COMING_SOON = [
  {
    titleCn: "资金管理",
    titleEn: "Treasury Management",
    descCn: "构建加密资产组合（BTC、ETH、DeFi代币等），提供跟踪特定策略或指数的产品。",
    descEn: "Build crypto portfolios tracking specific strategies or indices.",
  },
  {
    titleCn: "Yield Leverage",
    titleEn: "Yield Leverage",
    descCn: "利率杠杆将资产的本金和未来收益分离，用户通过杠杆购买未来收益代币（YT）放大收益，同时承担价格和流动性风险。",
    descEn: "Separate principal and future yield so users can leverage future cash flow exposure.",
  },
  {
    titleCn: "债券发行器",
    titleEn: "Bond Issuer",
    descCn: "债券代币化铸造发行到平台交易的完整闭环，投资者可以在链上便捷参与债权投资，获得可流动的收益。",
    descEn: "A full issuance loop from tokenization to secondary trading on-chain.",
  },
];

const FAQ_ITEMS = [
  {
    qCn: "什么是 $BNC？",
    qEn: "What is $BNC?",
    aCn: "$BNC 是一种实用企业债券治理代币，专为非加密用户设计，作为金融工具在完全透明和安全的环境中实现金融包容。$BNC 将由企业债券储备支持。",
    aEn: "$BNC is a utility enterprise-bond governance token backed by enterprise bond reserves.",
  },
  {
    qCn: "什么是企业债券代币？",
    qEn: "What are enterprise bond tokens?",
    aCn: "企业债券代币是将传统企业债券代币化的数字资产，代表对底层债券的所有权。",
    aEn: "Enterprise bond tokens are digital assets representing tokenized corporate bond ownership.",
  },
  {
    qCn: "我要如何获取$BNC?",
    qEn: "How do I get $BNC?",
    aCn: "您可以通过参与平台活动、质押资产或购买等方式获得 $BNC。",
    aEn: "You can get $BNC through participation, staking or purchases.",
  },
  {
    qCn: "谁可以参与 HOPE 生态系统？",
    qEn: "Who can join the HOPE ecosystem?",
    aCn: "任何人都可以参与 HOPE 生态系统，无需特殊资质要求。",
    aEn: "Anyone can participate in the HOPE ecosystem.",
  },
  {
    qCn: "我可以质押 $BNC 和/或企业债券代币吗？",
    qEn: "Can I stake $BNC and bond tokens?",
    aCn: "是的，您可以质押 $BNC 和企业债券代币来获得收益。",
    aEn: "Yes, both $BNC and enterprise bond tokens can be staked for rewards.",
  },
  {
    qCn: "我的资金安全吗？",
    qEn: "Are my funds safe?",
    aCn: "我们采用多重安全措施保护用户资金，包括智能合约审计、多重签名等技术手段。",
    aEn: "We protect funds with smart contract audits, multisig and layered controls.",
  },
];

const COMMUNITY_LINKS = ["X", "Telegram", "GitHub", "YouTube"] as const;

const RESERVE_BARS = [
  38, 74, 49, 81, 52, 43, 68, 58, 77, 46, 61, 73, 57, 65, 84, 55,
] as const;

const GOVERNANCE_ITEMS = [
  {
    titleCn: "构建收益矩阵",
    titleEn: "Yield Matrix",
    descCn: "构建 RWA 多元化收益组合，实现复利增长。",
    descEn: "Build diversified RWA yield combinations for compounding growth.",
  },
  {
    titleCn: "Yield Leverage",
    titleEn: "Yield Leverage",
    descCn: "将固定收益与未来收益拆分，形成更灵活的收益结构。",
    descEn: "Split principal and future yield for more flexible structured returns.",
  },
  {
    titleCn: "债券发行器",
    titleEn: "Bond Issuer",
    descCn: "支持债券发行、链上申购与后续流转的完整闭环。",
    descEn: "Support issuance, on-chain subscription, and circulation in one loop.",
  },
] as const;

const TONE_STYLES = {
  violet: {
    panel: "border-[#24203b] bg-[linear-gradient(180deg,#131118_0%,#0d0d12_100%)]",
    glow: "bg-[radial-gradient(circle_at_center,rgba(93,80,218,0.14),transparent_72%)]",
    badge: "border border-[#3b3372] bg-[#171428] text-[#9b93ff]",
    marker: "border-l-[#7868ff]",
    line: "from-transparent via-[#403598] to-transparent",
  },
  gold: {
    panel: "border-[#3a3120] bg-[linear-gradient(180deg,#15120d_0%,#0d0d10_100%)]",
    glow: "bg-[radial-gradient(circle_at_center,rgba(240,196,86,0.12),transparent_72%)]",
    badge: "border border-[#5a4820] bg-[#18140d] text-[#f0c456]",
    marker: "border-l-[#f0c456]",
    line: "from-transparent via-[#8e6a22] to-transparent",
  },
  emerald: {
    panel: "border-[#243826] bg-[linear-gradient(180deg,#101510_0%,#0d0d10_100%)]",
    glow: "bg-[radial-gradient(circle_at_center,rgba(86,158,88,0.13),transparent_72%)]",
    badge: "border border-[#2d5a30] bg-[#101810] text-[#8fd18f]",
    marker: "border-l-[#6fcb74]",
    line: "from-transparent via-[#3f7c43] to-transparent",
  },
} as const;

export function OfficialSitePage() {
  const router = useRouter();
  const { lang, walletConnected, displayIdentity } = useRwaAppState();
  const isCn = lang === "cn";
  const navItems = isCn ? NAV_CN : NAV_EN;
  const [activeFinanceGroupIndex, setActiveFinanceGroupIndex] = useState(0);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0);
  const activeFinanceGroup = FINANCE_GROUPS[activeFinanceGroupIndex] ?? FINANCE_GROUPS[0];
  const activeFinanceTone = TONE_STYLES[activeFinanceGroup.items[0].tone];

  return (
    <main className="official-home min-h-screen bg-[#030405] text-white">
      <header className="official-home-header sticky top-0 z-40 border-b border-[#151619] bg-[#050505]/96">
        <div className="official-home-wrap mx-auto flex h-[72px] items-center justify-between px-6">
          <button
            type="button"
            className="flex items-center gap-3"
            onClick={() => router.push("/")}
          >
            <Image src={publicAsset("/logo-mark.svg")} alt="REAL" width={34} height={34} className="h-[34px] w-[34px]" />
            <span className="text-[22px] font-semibold tracking-[-0.02em] text-white">REAL</span>
          </button>

          <nav className="official-home-nav hidden items-center gap-7 xl:flex">
            {navItems.map((item, idx) => (
              <button
                key={item}
                type="button"
                onClick={() => router.push(ROUTES[idx] ?? REALRWA_ROUTES.home)}
                className="official-home-nav-item text-[15px] text-zinc-300 transition hover:text-white"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden items-center gap-1.5 text-[14px] text-zinc-300 lg:flex"
            >
              <Globe className="h-4 w-4" />
              {isCn ? "简体中文" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => router.push(REALRWA_ROUTES.home)}
              className="rounded-[10px] bg-[#f0c456] px-5 py-2.5 text-[14px] font-semibold text-black"
            >
              {walletConnected ? (isCn ? "已连接" : "Connected") : isCn ? "连接钱包" : "Connect"}
            </button>
            {walletConnected ? (
              <button
                type="button"
                onClick={() => router.push(REALRWA_ROUTES.home)}
                className="hidden h-[44px] min-w-[220px] items-center rounded-[10px] border border-white/18 bg-[#0c0d0f] px-4 text-left text-[14px] text-zinc-200 lg:flex"
              >
                <span className="truncate">{displayIdentity}</span>
              </button>
            ) : null}
          </div>
        </div>
        <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-2 overflow-x-auto border-t border-white/6 px-4 py-3 xl:hidden">
          {navItems.map((item, idx) => (
            <button
              key={item}
              type="button"
              onClick={() => router.push(ROUTES[idx] ?? REALRWA_ROUTES.home)}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] text-zinc-300 transition hover:border-white/20 hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <section className="official-home-hero overflow-hidden border-b border-white/6">
        <div className="official-home-wrap official-hero-grid mx-auto grid min-h-[540px] items-center gap-10 px-5 py-10 sm:px-6 lg:min-h-[620px] lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <div className="official-hero-visual relative order-2 flex min-h-[240px] items-center justify-center lg:order-1 lg:min-h-[430px]">
            <div className="official-hero-gridlines absolute inset-0" />
            <svg
              viewBox="0 0 640 420"
              className="official-hero-gem relative z-10 w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[620px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="120,230 285,120 430,120 515,260 392,372 165,330" fill="rgba(8,9,46,0.55)" />
              <polygon points="285,120 430,120 392,372" fill="rgba(57,62,91,0.4)" />
              <polygon points="120,230 285,120 392,372 165,330" fill="rgba(33,34,48,0.72)" />
              <polygon points="392,372 515,260 430,120" fill="rgba(108,76,40,0.5)" />
              <polygon points="330,270 515,260 392,372" fill="rgba(180,126,65,0.45)" />
              <polyline points="120,230 285,120 430,120 515,260 392,372 165,330 120,230" stroke="#4048b9" strokeWidth="3" />
              <line x1="285" y1="120" x2="165" y2="330" stroke="#4048b9" strokeWidth="2.5" />
              <line x1="285" y1="120" x2="392" y2="372" stroke="#4048b9" strokeWidth="2.5" />
              <line x1="430" y1="120" x2="392" y2="372" stroke="#4048b9" strokeWidth="2.5" />
              <line x1="120" y1="230" x2="392" y2="372" stroke="#4048b9" strokeWidth="2.5" />
              <line x1="515" y1="260" x2="330" y2="270" stroke="#4048b9" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="official-hero-copy order-1 flex flex-col justify-center lg:order-2">
            <p className="official-hero-eyebrow text-[34px] leading-none tracking-[-0.04em] text-white sm:text-[42px] lg:text-[64px]">
              {isCn ? "新一代治理" : "NEXT GEN Governance"}
            </p>
            <h1 className="official-hero-title mt-6 text-[68px] font-semibold leading-[0.92] tracking-[-0.05em] text-white sm:text-[84px] lg:mt-10 lg:text-[112px]">
              $REAL
            </h1>
            <p className="mt-8 max-w-[580px] text-[18px] leading-[1.6] text-zinc-300 sm:text-[20px] lg:mt-14 lg:text-[24px]">
              {isCn
                ? "以代币化债券提升流动性和资本效率"
                : "Enhance liquidity and capital efficiency through tokenized bonds."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-12">
              <button
                type="button"
                onClick={() => router.push(REALRWA_ROUTES.home)}
                className="h-[52px] rounded-[12px] bg-[#f0c456] px-8 text-[18px] font-semibold text-black lg:h-[56px] lg:text-[20px]"
              >
                {isCn ? "启动" : "Launch"}
              </button>
              <button
                type="button"
                className="h-[52px] rounded-[12px] border border-white/22 px-8 text-[18px] font-medium text-white lg:h-[56px] lg:text-[20px]"
              >
                {isCn ? "了解更多" : "Learn More"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="official-home-wrap mx-auto px-6 pb-18 pt-14">
        <section className="official-section mx-auto max-w-[1160px]">
          <h2 className="text-center text-[24px] font-semibold tracking-[-0.02em] text-white">
            {isCn ? "$REAL价格发现" : "$REAL Price Discovery"}
          </h2>
          <p className="mx-auto mt-3 max-w-[940px] text-center text-[14px] leading-7 text-zinc-500">
            {isCn
              ? "通过这一创新模式，我们将代币发行与业务赋能实现同步，确保$REAL自诞生之初就具备坚实的价值基础。其价格将完全由公开透明的市场行为决定。"
              : "This model synchronizes token issuance with business utility, allowing $REAL to discover value from open market behavior."}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 text-[13px] text-zinc-400">
            <span className="rounded-full border border-[#1e1f24] bg-[#0d0d10] px-3 py-1.5">
              Step 01 {isCn ? "$REAL 价格卷积" : "$REAL Price Convolution"}
            </span>
            <span className="rounded-full border border-[#1a1b20] bg-[#08090b] px-3 py-1.5">
              Step 02 {isCn ? "$REAL 创始价格" : "$REAL Genesis Price"}
            </span>
          </div>
          <div className="mt-7 overflow-hidden rounded-[16px] border border-[#191a1f] bg-[#090a0d] p-4">
            <div className="relative h-[300px] overflow-hidden rounded-[12px] border border-[#15161b] bg-[#07080b]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:100%_56px,72px_100%]" />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                <path d="M0 178 C 120 124, 220 212, 360 154 C 510 92, 620 226, 760 142 C 845 94, 930 162, 1000 128" fill="none" stroke="#10d4d2" strokeWidth="2.4" />
                <path d="M0 192 C 120 244, 230 134, 360 188 C 520 252, 660 88, 810 162 C 902 208, 960 138, 1000 148" fill="none" stroke="#d55559" strokeWidth="2.1" />
              </svg>
            </div>
          </div>
        </section>

        <section className="official-section mt-18">
          <h2 className="text-center text-[24px] font-semibold tracking-[-0.02em] text-white">
            {isCn ? "REAL Finance 生态系统" : "REAL Finance Ecosystem"}
          </h2>
          <p className="mt-3 text-center text-[14px] leading-7 text-zinc-500">
            {isCn ? "基于债券的RWA平台，专注于优化资产流动性与资本效率。" : "Bond-based RWA platform focused on optimizing liquidity and capital efficiency."}
          </p>
          <p className="mt-1 text-center text-[14px] leading-7 text-zinc-500">
            {isCn ? "作为生态治理核心，赋能社区决策，保障操作透明。" : "As the governance core, empower community decisions with transparent operations."}
          </p>
          <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-8 flex gap-4 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:overflow-visible">
            {ECOSYSTEM_HIGHLIGHTS.map((item) => {
              const tone = TONE_STYLES[item.tone];

              return (
                <article
                  key={item.titleCn}
                  className={`relative min-w-[280px] overflow-hidden rounded-[14px] border px-5 py-4 md:min-w-0 ${tone.panel}`}
                >
                  <div className={`pointer-events-none absolute inset-0 opacity-90 ${tone.glow}`} />
                  <p className="relative text-[18px] font-semibold text-white">{isCn ? item.titleCn : item.titleEn}</p>
                  <p className="relative mt-3 max-w-[520px] text-[13px] leading-7 text-zinc-400">
                    {isCn ? item.descCn : item.descEn}
                  </p>
                </article>
              );
            })}
          </div>
          <div className="mt-10 space-y-12">
            <div className="lg:hidden">
              <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-2 overflow-x-auto pb-1">
                {FINANCE_GROUPS.map((group, index) => (
                  <button
                    key={group.subtitleCn}
                    type="button"
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                      activeFinanceGroupIndex === index
                        ? "border-[#f0c456]/55 bg-[#241b09] text-[#f0c456]"
                        : "border-white/10 bg-white/[0.03] text-zinc-300"
                    }`}
                    onClick={() => setActiveFinanceGroupIndex(index)}
                  >
                    {isCn ? group.subtitleCn : group.subtitleEn}
                  </button>
                ))}
              </div>
              <section className="mt-6 rounded-[18px] border border-[#17181c] bg-[#0a0a0d] p-5">
                <div className="relative">
                  <div className={`pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full opacity-60 blur-3xl ${activeFinanceTone.glow}`} />
                  <h3 className="text-[36px] font-semibold leading-[0.94] tracking-[-0.04em] text-white">
                    REAL
                    <br />
                    Finance
                  </h3>
                  <p className="mt-3 text-[14px] text-zinc-300">
                    {isCn ? activeFinanceGroup.subtitleCn : activeFinanceGroup.subtitleEn}
                  </p>
                </div>
                <div className="mt-6 space-y-5">
                  {activeFinanceGroup.items.map((item, itemIndex) => (
                    <article key={item.titleCn} className="rounded-[14px] border border-white/8 bg-white/[0.02] p-4">
                      <div className="flex items-center gap-3">
                        {itemIndex === 0 ? (
                          <span className={`h-0 w-0 border-y-[6px] border-y-transparent border-l-[10px] ${activeFinanceTone.marker}`} />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-white/10" />
                        )}
                        <p className="text-[20px] font-medium tracking-[-0.03em] text-white">
                          {isCn ? item.titleCn : item.titleEn}
                        </p>
                      </div>
                      <p className="mt-3 text-[13px] leading-6 text-zinc-400">
                        {isCn ? item.descCn : item.descEn}
                      </p>
                      <span className={`mt-4 inline-flex rounded-full px-4 py-2 text-[12px] font-medium ${activeFinanceTone.badge}`}>
                        {isCn ? item.badgeCn : item.badgeEn}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            </div>
            <div className="hidden space-y-12 lg:block">
            {FINANCE_GROUPS.map((group) => {
              const tone = TONE_STYLES[group.items[0].tone];

              return (
              <section
                key={group.subtitleCn}
                className="grid gap-10 border-b border-[#131418] pb-12 last:border-b-0 last:pb-0 lg:grid-cols-[320px_minmax(0,1fr)]"
              >
                <div className="relative">
                  <div className={`absolute left-0 top-4 hidden h-[82%] w-px bg-gradient-to-b ${tone.line} lg:block`} />
                  <div className={`absolute left-0 top-12 hidden h-[240px] w-[240px] rounded-full opacity-40 blur-3xl lg:block ${tone.glow}`} />
                  <div className="pl-0 lg:pl-10">
                    <h3 className="text-[54px] font-semibold leading-[0.94] tracking-[-0.04em] text-white">
                      REAL
                      <br />
                      Finance
                    </h3>
                    <p className="mt-4 max-w-[220px] text-[15px] font-medium text-zinc-300">
                      {isCn ? group.subtitleCn : group.subtitleEn}
                    </p>
                  </div>
                </div>
                <div className="relative space-y-14 pl-0 lg:pl-8">
                  <div className={`pointer-events-none absolute right-0 top-4 hidden h-[360px] w-[320px] opacity-75 blur-3xl lg:block ${tone.glow}`} />
                  {group.items.map((item, itemIndex) => (
                    <article
                      key={item.titleCn}
                      className="relative max-w-[620px]"
                    >
                      <div className="flex items-center gap-3">
                        {itemIndex === 0 ? (
                          <span className={`h-0 w-0 border-y-[6px] border-y-transparent border-l-[10px] ${tone.marker}`} />
                        ) : (
                          <span className="hidden h-2 w-2 rounded-full bg-white/0 lg:block" />
                        )}
                        <p className="text-[28px] font-medium tracking-[-0.03em] text-white">
                          {isCn ? item.titleCn : item.titleEn}
                        </p>
                      </div>
                      <p className="mt-3 pl-[22px] text-[14px] leading-7 text-zinc-500">
                        {isCn ? item.descCn : item.descEn}
                      </p>
                      <div className="pl-[22px]">
                        <span className={`mt-4 inline-flex rounded-full px-4 py-2 text-[13px] font-medium ${tone.badge}`}>
                          {isCn ? item.badgeCn : item.badgeEn}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
            })}
            </div>
          </div>
        </section>

        <section className="official-section mt-18">
          <h2 className="text-center text-[24px] font-semibold tracking-[-0.02em] text-white">
            {isCn ? "我们为何而生" : "Why We Exist"}
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="grid gap-5">
              {WHY_LIFE.slice(0, 2).map((item, idx) => (
                <article
                  key={item.prefixCn}
                  className={`rounded-[16px] border p-6 ${
                    idx === 0
                      ? "border-[#2b2950] bg-[linear-gradient(180deg,#16131e_0%,#0f1014_100%)]"
                      : "border-[#4a391e] bg-[linear-gradient(180deg,#17120c_0%,#100f12_100%)]"
                  }`}
                >
                  <p className="text-[28px] font-semibold tracking-[-0.03em] text-white">
                    {isCn ? item.prefixCn : item.prefixEn}
                    <span className={idx === 0 ? "text-[#d7d3ff]" : "text-[#f0c456]"}> {isCn ? item.suffixCn : item.suffixEn}</span>
                  </p>
                  <p className="mt-4 max-w-[520px] whitespace-pre-line text-[14px] leading-7 text-zinc-300/88">
                    {isCn ? item.descCn : item.descEn}
                  </p>
                </article>
              ))}
            </div>
            <article className="rounded-[16px] border border-[#b8b8d5]/20 bg-[linear-gradient(180deg,#e5e4ef_0%,#c9c8dd_100%)] p-6 text-zinc-900">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-[28px] font-semibold tracking-[-0.03em]">
                    {isCn ? WHY_LIFE[2].prefixCn : WHY_LIFE[2].prefixEn}
                    <span className="text-[#5a66d7]"> {isCn ? WHY_LIFE[2].suffixCn : WHY_LIFE[2].suffixEn}</span>
                  </p>
                  <p className="mt-4 max-w-[520px] text-[14px] leading-7 text-zinc-600">
                    {isCn ? WHY_LIFE[2].descCn : WHY_LIFE[2].descEn}
                  </p>
                </div>
                <div className="mt-10 flex justify-end">
                  <div className="grid h-[180px] w-[180px] place-items-center rounded-[30px] border border-[#cfd1eb] bg-[radial-gradient(circle_at_center,rgba(106,123,255,0.18),transparent_62%)]">
                    <div className="grid h-[112px] w-[112px] place-items-center rounded-[24px] border border-[#c6ccff] bg-white/25">
                      <div className="h-10 w-10 rounded-xl bg-[linear-gradient(145deg,#8a97ff,#cad2ff)]" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="official-section mt-18 rounded-[16px] border border-[#1a1a1e] bg-[linear-gradient(180deg,#0b0b0d_0%,#0a0a0c_100%)] px-6 py-8 lg:px-8">
          <h2 className="text-center text-[24px] font-semibold tracking-[-0.02em] text-white">
            {isCn ? "Real Finance是怎么运行的" : "How Real Finance Works"}
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-[#59461d] bg-[#16120b] px-4 py-1.5 text-[13px] text-[#f0c456]">
              RWA Token
            </span>
            <span className="rounded-full border border-[#352e67] bg-[#12101d] px-4 py-1.5 text-[13px] text-[#bcb7ff]">
              $REAL
            </span>
          </div>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex items-center justify-center">
              <div className="relative grid h-[300px] w-[300px] place-items-center rounded-full bg-[conic-gradient(from_0deg,#0f1221_0deg,#0f1221_76deg,#d6a63a_76deg,#d6a63a_176deg,#0f1221_176deg,#0f1221_214deg,#5548c8_214deg,#5548c8_304deg,#0f1221_304deg,#0f1221_360deg)]">
                <div className="grid h-[164px] w-[164px] place-items-center rounded-full border border-[#24252b] bg-[#09090b]">
                  <p className="text-[15px] text-zinc-500">REAL</p>
                  <p className="mt-1 text-center text-[22px] font-semibold text-white">
                    {isCn ? "生态价值流转" : "Value circulation"}
                  </p>
                </div>
              </div>
              <div className="absolute right-0 top-10 max-w-[220px] rounded-[14px] border border-[#433417] bg-[#17120d] px-4 py-3">
                <p className="text-[13px] font-medium text-[#f0c456]">{isCn ? "核心说明" : "Core note"}</p>
                <p className="mt-2 text-[13px] leading-6 text-zinc-300">
                  {isCn
                    ? "RWA Token 提供底层债券收益，$REAL 承接治理、激励与增长飞轮。"
                    : "RWA Token powers the bond yield layer, while $REAL captures governance and incentive flywheel value."}
                </p>
              </div>
            </div>
            <div className="grid gap-5">
              <article className="rounded-[14px] border border-[#1c1d21] bg-[#0e0e11] p-6">
                <h3 className="text-[20px] font-semibold text-white">RWA Token</h3>
                <p className="mt-3 text-[14px] leading-7 text-zinc-400">
                  {isCn
                    ? "Real生态系统以企业债券代币为核心，由真实债券资产支持。RWA Token 对应真实收益资产，并通过交易、申购与质押形成流动性基础。"
                    : "The Real ecosystem is centered on enterprise bond tokens backed by real-world debt assets, creating the liquidity base for trading, subscription, and staking."}
                </p>
              </article>
              <article className="rounded-[14px] border border-[#1c1d21] bg-[#0e0e11] p-6">
                <h3 className="text-[20px] font-semibold text-white">$REAL</h3>
                <p className="mt-3 text-[14px] leading-7 text-zinc-400">
                  {isCn
                    ? "$REAL 是生态的治理与激励核心，承接平台分配、治理参与和增长激励，形成资产收益与治理价值的双轮驱动。"
                    : "$REAL acts as the governance and incentive core, linking platform distribution, governance participation, and growth incentives into one loop."}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="official-section mt-18 rounded-[16px] border border-[#1b1c20] bg-[#0a0a0c] px-6 py-8 lg:px-8">
          <h2 className="text-center text-[24px] font-semibold tracking-[-0.02em] text-white">
            {isCn ? "Real 储备池" : "Real Reserve Pool"}
          </h2>
          <p className="mx-auto mt-3 max-w-[980px] text-center text-[14px] leading-7 text-zinc-500">
            {isCn
              ? "Real生态系统将债券代币的发行、交易与结算数据全链存证，实现资产流转的透明化与可追溯。储备金机制完整映射债券凭证与底层资产，确保所有代币化资产真实可信。"
              : "The reserve pool records issuance, trading and settlement on-chain for transparent and traceable asset circulation."}
          </p>
          <div className="mt-8 rounded-[16px] border border-[#18191d] bg-[linear-gradient(180deg,#08090c_0%,#0c0d11_100%)] p-5">
            <div className="flex items-end justify-between gap-3 text-[12px] text-zinc-500">
              <span>Yield</span>
              <span>{isCn ? "债券收益曲线" : "Bond yield curve"}</span>
            </div>
            <div className="mt-4 flex h-[260px] items-end gap-2 rounded-[12px] border border-[#141519] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] px-3 pb-3 pt-10">
              {RESERVE_BARS.map((value, index) => (
                <div key={`${value}-${index}`} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <div
                    className={`rounded-t-[8px] ${
                      index % 5 === 0
                        ? "bg-[#f0c456]"
                        : index % 5 === 1
                          ? "bg-[#d8a621]"
                          : "bg-[#f5d36f]"
                    }`}
                    style={{ height: `${value}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: isCn ? "储备资产占比" : "Reserve Composition",
                  value: "68.4%",
                },
                {
                  label: isCn ? "链上存证完整度" : "On-chain Proof",
                  value: "100%",
                },
                {
                  label: isCn ? "实时结算效率" : "Settlement Efficiency",
                  value: "T+0",
                },
                {
                  label: isCn ? "可验证性" : "Verifiability",
                  value: "24/7",
                },
              ].map((item) => (
                <article key={item.label} className="rounded-[12px] border border-[#18191d] bg-[#0d0e11] p-5">
                  <p className="text-[13px] text-zinc-500">{item.label}</p>
                  <p className="mt-2 font-mono text-[30px] font-semibold text-white">{item.value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="official-section mt-18 rounded-[16px] border border-[#1b1b1f] bg-[linear-gradient(180deg,#0a0a0c_0%,#0b0b0d_100%)] px-6 py-8 lg:px-8">
          <h2 className="text-center text-[24px] font-semibold tracking-[-0.02em] text-white">
            {isCn ? "Real Finance治理" : "Real Finance Governance"}
          </h2>
          <p className="mx-auto mt-3 max-w-[760px] text-center text-[14px] leading-7 text-zinc-500">
            {isCn
              ? "通过治理、激励和发行能力，形成贯穿交易、收益、配置与社区协同的完整金融飞轮。"
              : "Governance, incentives, and issuance capabilities create a financial flywheel across trading, yield, allocation, and community coordination."}
          </p>
          <div className="mt-8 flex justify-center">
            <div className="relative flex h-[150px] w-[240px] items-center justify-center">
              <div className="absolute left-3 top-7 h-[76px] w-[76px] rotate-[-12deg] rounded-[16px] border border-[#4f3c18] bg-[#17130d]" />
              <div className="absolute right-3 top-2 h-[92px] w-[92px] rotate-[10deg] rounded-[18px] border border-[#2f2b54] bg-[#12101d]" />
              <div className="absolute bottom-2 left-1/2 h-[88px] w-[88px] -translate-x-1/2 rounded-[18px] border border-[#202228] bg-[#111216]" />
              <div className="relative z-10 rounded-full border border-[#51411d] bg-[#16120c] px-4 py-2 text-[12px] tracking-[0.2em] text-[#f0c456]">
                REAL
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {GOVERNANCE_ITEMS.map((item) => (
              <article key={item.titleCn} className="rounded-[14px] border border-[#1b1c20] bg-[#0d0e11] p-6">
                <p className="text-[18px] font-semibold text-white">{isCn ? item.titleCn : item.titleEn}</p>
                <p className="mt-3 text-[14px] leading-7 text-zinc-400">{isCn ? item.descCn : item.descEn}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="official-section mt-18">
          <h2 className="text-center text-[24px] font-semibold tracking-[-0.02em] text-white">
            {isCn ? "敬请期待" : "Coming Soon"}
          </h2>
          <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-8 flex gap-5 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible">
            {COMING_SOON.map((item) => (
              <article key={item.titleCn} className="min-w-[260px] rounded-[18px] border border-white/10 bg-[#0f1114] p-6 md:min-w-0">
                <p className="text-[18px] font-semibold text-white">{isCn ? item.titleCn : item.titleEn}</p>
                <p className="mt-3 text-[14px] leading-7 text-zinc-500">{isCn ? item.descCn : item.descEn}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="official-section mt-18 rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#090b0e_0%,#0d1013_100%)] px-8 py-8 text-center">
          <p className="text-[12px] uppercase tracking-[0.3em] text-zinc-500">REAL</p>
          <h2 className="mt-4 text-[30px] font-semibold text-white">
            {isCn ? "购买生态治理代币$REAL" : "Buy Governance Token $REAL"}
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[14px] leading-7 text-zinc-500">
            {isCn
              ? "随时参与并购买 $Real 生态 治理代币。 立即开启您的投资之旅。"
              : "Participate and buy $REAL ecosystem governance tokens anytime. Start now."}
          </p>
          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={() => router.push(REALRWA_ROUTES.home)}
              className="inline-flex items-center gap-1 rounded-[12px] bg-[#f0c456] px-6 py-3 text-[15px] font-semibold text-black"
            >
              {isCn ? "我想要 $REAL >" : "I want $REAL >"}
            </button>
          </div>
          <p className="mt-8 text-[20px] font-semibold text-white">
            {isCn ? "加入贝肯社区" : "Join the Beacon community"}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3 text-zinc-400">
            {COMMUNITY_LINKS.map((label) => (
              <button
                key={label}
                type="button"
                className="rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[13px] tracking-[0.02em] transition hover:border-white/30 hover:text-zinc-200"
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="official-section mt-18 rounded-[22px] border border-white/10 bg-[#0b0d0f] px-8 py-8">
          <h2 className="text-center text-[24px] font-semibold tracking-[-0.02em] text-white">FAQ</h2>
          <div className="mt-7 space-y-3 md:hidden">
            {FAQ_ITEMS.map((item, index) => (
              <details
                key={item.qCn}
                open={expandedFaqIndex === index}
                className="overflow-hidden rounded-[18px] border border-white/10 bg-black/18"
                onToggle={(event) => {
                  const isOpen = (event.currentTarget as HTMLDetailsElement).open;
                  if (isOpen) setExpandedFaqIndex(index);
                }}
              >
                <summary className="cursor-pointer list-none px-5 py-4 text-[16px] font-medium text-white">
                  {isCn ? item.qCn : item.qEn}
                </summary>
                <div className="border-t border-white/10 px-5 py-4 text-[14px] leading-7 text-zinc-500">
                  {isCn ? item.aCn : item.aEn}
                </div>
              </details>
            ))}
          </div>
          <div className="mt-7 hidden divide-y divide-white/10 overflow-hidden rounded-[18px] border border-white/10 bg-black/18 md:block">
            {FAQ_ITEMS.map((item) => (
              <article key={item.qCn} className="px-6 py-5">
                <div className="flex items-start gap-3">
                  <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#f0c456]" />
                  <div>
                    <h3 className="text-[17px] font-medium text-white">{isCn ? item.qCn : item.qEn}</h3>
                    <p className="mt-2 text-[14px] leading-7 text-zinc-500">{isCn ? item.aCn : item.aEn}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-18 border-t border-white/10 bg-[#07080a]">
        <div className="official-home-wrap mx-auto grid gap-10 px-6 py-12 md:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-3">
              <Image src={publicAsset("/logo-mark.svg")} alt="REAL" width={34} height={34} className="h-[34px] w-[34px]" />
              <span className="text-[28px] font-semibold tracking-[-0.03em] text-white">REAL</span>
            </div>
            <p className="mt-4 text-[16px] font-medium text-zinc-200">
              {isCn ? "资产无界，债券新生" : "Assets Without Borders"}
            </p>
          </div>

          <div>
            <p className="text-[16px] font-semibold text-white">{isCn ? "关于" : "About"}</p>
            <ul className="mt-4 space-y-3 text-[14px] text-zinc-500">
              {(isCn ? ["白皮书", "RWA 资讯", "用户协议"] : ["Whitepaper", "RWA News", "Terms"]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[16px] font-semibold text-white">{isCn ? "产品" : "Product"}</p>
            <ul className="mt-4 space-y-3 text-[14px] text-zinc-500">
              {(isCn ? ["交易", "质押", "借贷", "治理"] : ["Trade", "Stake", "Lend", "Governance"]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[16px] font-semibold text-white">{isCn ? "服务" : "Service"}</p>
            <div className="mt-4 space-y-3">
              {(isCn ? ["储备金", "保险", "推荐人", "被邀请者"] : ["Reserve", "Insurance", "Referrer", "Invitee"]).map((item) => (
                <p key={item} className="text-[14px] text-zinc-500">
                  {item}
                </p>
              ))}
              <button
                type="button"
                onClick={() => router.push(REALRWA_ROUTES.home)}
                className="mt-2 inline-flex items-center gap-1.5 text-[14px] text-zinc-400 transition hover:text-zinc-200"
              >
                {isCn ? "进入交易" : "Open Trade"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
