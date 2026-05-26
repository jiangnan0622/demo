"use client";

import { Suspense, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Copy,
  Download,
  Link2,
  QrCode,
  Search,
  Send,
  Share2,
  TrendingUp,
  X,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RealRwaShell, useShellActions } from "@/projects/realrwa-demo/components/realrwa/shell";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import { useGlobalFeedback } from "@/components/feedback/global-feedback-provider";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type InviteRecord = {
  address: string;
  createdAt: string;
  createdOn: string;
  totalTradeVolume: number;
};

type CommissionRecord = {
  issuedAt: string;
  issuedOn: string;
  level: string;
  qualifiedInvites: number;
  commissionUsd1: number;
  aprBoost: number;
  durationDays: number;
};

type InviteDetailRecord = {
  time: string;
  coin: string;
  type: string;
  price: string;
  size: string;
  amount: string;
};

const INVITE_STEPS = {
  cn: [
    {
      step: "01",
      title: "获取专属链接",
      description: "连接钱包后，一键生成您的专属邀请码与专属邀请链接，支持多场景传播。",
    },
    {
      step: "02",
      title: "好友申购资产",
      description: "分享渠道，受邀好友通过您的链接完成注册，并成功申购 RWA 资产。",
    },
    {
      step: "03",
      title: "达成合格门槛",
      description: "当受邀好友的单人申购额达到合格标准，系统将自动锁定您的专属奖励。",
    },
    {
      step: "04",
      title: "结算双重奖励",
      description: "审核完成后，USD1 现金直达钱包，您的质押 APY 加成将按同步激活生效。",
    },
  ],
  en: [
    {
      step: "01",
      title: "Get your referral link",
      description: "Connect your wallet and instantly generate a permanent invite code and link.",
    },
    {
      step: "02",
      title: "Friends subscribe",
      description: "Invited users register through your link and complete their RWA purchase.",
    },
    {
      step: "03",
      title: "Reach the threshold",
      description: "Once a referred user hits the qualified purchase amount, rewards are locked in.",
    },
    {
      step: "04",
      title: "Settle double rewards",
      description: "After review, USD1 commission and staking APY boost are granted to your account.",
    },
  ],
} as const;

const INVITE_ROWS: InviteRecord[] = [
  {
    address: "HkAo3sqe...93ujhMq1",
    createdAt: "2026-02-06 17:11:33",
    createdOn: "2026-02-06",
    totalTradeVolume: 23785.19,
  },
  {
    address: "HkAo3sqe...93ujhMq2",
    createdAt: "2026-02-08 12:32:18",
    createdOn: "2026-02-08",
    totalTradeVolume: 19410.33,
  },
  {
    address: "HkAo3sqe...93ujhMq3",
    createdAt: "2026-02-09 09:22:45",
    createdOn: "2026-02-09",
    totalTradeVolume: 26500.0,
  },
  {
    address: "HkAo3sqe...93ujhMq4",
    createdAt: "2026-02-10 15:02:51",
    createdOn: "2026-02-10",
    totalTradeVolume: 11025.98,
  },
  {
    address: "HkAo3sqe...93ujhMq5",
    createdAt: "2026-02-11 11:41:06",
    createdOn: "2026-02-11",
    totalTradeVolume: 34785.19,
  },
  {
    address: "HkAo3sqe...93ujhMq6",
    createdAt: "2026-02-12 13:26:03",
    createdOn: "2026-02-12",
    totalTradeVolume: 8721.56,
  },
];

const COMMISSION_ROWS: CommissionRecord[] = [
  {
    issuedAt: "2026-02-06 08:00:00",
    issuedOn: "2026-02-06",
    level: "L1",
    qualifiedInvites: 50,
    commissionUsd1: 100,
    aprBoost: 0.01,
    durationDays: 7,
  },
  {
    issuedAt: "2026-02-13 08:00:00",
    issuedOn: "2026-02-13",
    level: "L2",
    qualifiedInvites: 80,
    commissionUsd1: 300,
    aprBoost: 0.03,
    durationDays: 30,
  },
  {
    issuedAt: "2026-02-20 08:00:00",
    issuedOn: "2026-02-20",
    level: "L3",
    qualifiedInvites: 120,
    commissionUsd1: 500,
    aprBoost: 0.05,
    durationDays: 90,
  },
];

const PAGE_SIZE = 5;

const INVITE_DETAIL_ROWS: InviteDetailRecord[] = [
  {
    time: "2025-11-10 16:02:03",
    coin: "RWA/USDC",
    type: "Buy",
    price: "39.147",
    size: "39.147",
    amount: "39.147",
  },
  {
    time: "2025-11-10 16:02:03",
    coin: "RWA/USDC",
    type: "Buy",
    price: "39.147",
    size: "39.147",
    amount: "39.147",
  },
  {
    time: "2025-11-10 16:02:03",
    coin: "RWA/USDC",
    type: "Buy",
    price: "39.147",
    size: "39.147",
    amount: "39.147",
  },
  {
    time: "2025-11-10 16:02:03",
    coin: "RWA/USDC",
    type: "Buy",
    price: "39.147",
    size: "39.147",
    amount: "39.147",
  },
  {
    time: "2025-11-10 16:02:03",
    coin: "RWA/USDC",
    type: "Buy",
    price: "39.147",
    size: "39.147",
    amount: "39.147",
  },
];

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function matchesDateRange(date: string, start: string, end: string) {
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

function buildQrSvg(x: number, y: number, size: number) {
  const modules = [
    "111110001011111",
    "100010111010001",
    "101010100010101",
    "101010111010101",
    "100010001010001",
    "111110101011111",
    "000000001000000",
    "111011101011101",
    "001100011100010",
    "111011001011101",
    "100101111010101",
    "000000101000000",
    "111110001011111",
    "100010101010001",
    "111110001011111",
  ];
  const unit = size / modules.length;
  const blocks: string[] = [];
  modules.forEach((row, rowIndex) => {
    [...row].forEach((cell, cellIndex) => {
      if (cell === "1") {
        blocks.push(
          `<rect x="${x + cellIndex * unit}" y="${y + rowIndex * unit}" width="${unit - 1}" height="${unit - 1}" rx="${Math.max(1, unit * 0.18)}" fill="#F5F5F5" />`
        );
      }
    });
  });
  return blocks.join("");
}

function buildPosterSvg(
  variant: "elite" | "proof",
  inviteCode: string,
  proofAddress: string
) {
  const logoHeader = `
  <g transform="translate(140 118)">
    <path d="M32 6L53.5 16.8V39.2L32 50L10.5 39.2V16.8L32 6Z" stroke="#E9C15B" stroke-width="3.2" stroke-linejoin="round"/>
    <path d="M32 15L43.8 20.9V32.8L32 38.7L20.2 32.8V20.9L32 15Z" stroke="#E9C15B" stroke-width="2.6" stroke-linejoin="round" opacity="0.9"/>
  </g>
  <text x="220" y="170" fill="#E9C15B" font-size="54" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-weight="700">REAL</text>
  `;

  if (variant === "elite") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1520" viewBox="0 0 1080 1520" fill="none">
  <rect width="1080" height="1520" rx="44" fill="#101010"/>
  <rect x="72" y="72" width="936" height="1376" rx="36" fill="#111111" stroke="rgba(255,255,255,0.12)"/>
  <circle cx="534" cy="982" r="220" fill="url(#goldGlow)" fill-opacity="0.22"/>
  ${logoHeader}
  <text x="540" y="356" text-anchor="middle" fill="url(#goldText)" font-size="118" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-style="italic" font-weight="800">财富倍增</text>
  <text x="540" y="492" text-anchor="middle" fill="url(#goldText)" font-size="118" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-style="italic" font-weight="800">领袖奖励</text>
  <text x="540" y="610" text-anchor="middle" fill="#D6B16A" font-size="42" font-family="Inter, ui-sans-serif, system-ui, sans-serif">三步开启债券日日收益</text>
  <text x="540" y="668" text-anchor="middle" fill="#D6B16A" font-size="42" font-family="Inter, ui-sans-serif, system-ui, sans-serif">像存银行一样简单</text>
  <rect x="370" y="760" width="312" height="338" rx="24" fill="url(#paper)" transform="rotate(-8 370 760)"/>
  <path d="M366 1065C458 975 514 946 598 884C662 834 704 770 738 726" stroke="#C89E41" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M715 688L765 719L735 767" stroke="#C89E41" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="275" cy="873" r="18" fill="#E7C46C"/>
  <circle cx="793" cy="866" r="18" fill="#E7C46C"/>
  <circle cx="848" cy="968" r="18" fill="#E7C46C"/>
  <circle cx="408" cy="1150" r="18" fill="#E7C46C"/>
  <ellipse cx="540" cy="1114" rx="202" ry="50" fill="url(#baseGlow)"/>
  <text x="140" y="1280" fill="#888888" font-size="30" font-family="Inter, ui-sans-serif, system-ui, sans-serif">邀请码</text>
  <text x="140" y="1344" fill="#FFFFFF" font-size="56" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-weight="700">${inviteCode}</text>
  ${buildQrSvg(834, 1210, 126)}
  <defs>
    <radialGradient id="goldGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(534 982) rotate(90) scale(220)">
      <stop stop-color="#E6B753"/>
      <stop offset="1" stop-color="#E6B753" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="baseGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(540 1114) rotate(90) scale(50 202)">
      <stop stop-color="#D49A2B" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#D49A2B" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldText" x1="340" y1="280" x2="740" y2="520" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F4D47B"/>
      <stop offset="1" stop-color="#C0942E"/>
    </linearGradient>
    <linearGradient id="paper" x1="526" y1="760" x2="526" y2="1098" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F1E1C8"/>
      <stop offset="1" stop-color="#D6BA8B"/>
    </linearGradient>
  </defs>
</svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1520" viewBox="0 0 1080 1520" fill="none">
  <rect width="1080" height="1520" rx="44" fill="#101010"/>
  <rect x="72" y="72" width="936" height="1376" rx="36" fill="#111111" stroke="rgba(255,255,255,0.12)"/>
  <circle cx="554" cy="494" r="178" fill="url(#roadGlow)" fill-opacity="0.25"/>
  ${logoHeader}
  <text x="540" y="356" text-anchor="middle" fill="url(#goldText)" font-size="118" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-style="italic" font-weight="800">未来先知</text>
  <text x="540" y="492" text-anchor="middle" fill="url(#goldText)" font-size="118" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-style="italic" font-weight="800">远见之选</text>
  <text x="540" y="610" text-anchor="middle" fill="#D6B16A" font-size="42" font-family="Inter, ui-sans-serif, system-ui, sans-serif">在债券世界的风浪中</text>
  <text x="540" y="668" text-anchor="middle" fill="#D6B16A" font-size="42" font-family="Inter, ui-sans-serif, system-ui, sans-serif">这里是你的稳定泊位</text>
  <path d="M520 812C480 872 452 918 448 970C442 1040 494 1090 618 1140" stroke="#D9A53B" stroke-width="34" stroke-linecap="round"/>
  <rect x="200" y="888" width="680" height="306" rx="24" fill="rgba(48,48,48,0.68)" stroke="rgba(255,255,255,0.10)"/>
  <line x1="540" y1="922" x2="540" y2="1070" stroke="rgba(255,255,255,0.10)"/>
  <text x="244" y="962" fill="#9B9B9B" font-size="28" font-family="Inter, ui-sans-serif, system-ui, sans-serif">持仓债券代币数量</text>
  <text x="590" y="962" fill="#9B9B9B" font-size="28" font-family="Inter, ui-sans-serif, system-ui, sans-serif">收益总数量</text>
  <text x="244" y="1034" fill="#F1D086" font-size="56" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-weight="700">1,000.00 USDC</text>
  <text x="590" y="1034" fill="#F1D086" font-size="56" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-weight="700">$ 23,785.19</text>
  <text x="244" y="1114" fill="#9B9B9B" font-size="28" font-family="Inter, ui-sans-serif, system-ui, sans-serif">邀请人地址</text>
  <text x="244" y="1168" fill="#EDEDED" font-size="30" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">${proofAddress}</text>
  <text x="244" y="1212" fill="#EDEDED" font-size="30" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">0x9d352d7dcc0e4676ad7478d</text>
  <text x="140" y="1280" fill="#888888" font-size="30" font-family="Inter, ui-sans-serif, system-ui, sans-serif">邀请码</text>
  <text x="140" y="1344" fill="#FFFFFF" font-size="56" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-weight="700">${inviteCode}</text>
  ${buildQrSvg(834, 1210, 126)}
  <defs>
    <radialGradient id="roadGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(554 494) rotate(90) scale(178)">
      <stop stop-color="#D79A2F"/>
      <stop offset="1" stop-color="#D79A2F" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldText" x1="340" y1="280" x2="740" y2="520" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F4D47B"/>
      <stop offset="1" stop-color="#C0942E"/>
    </linearGradient>
  </defs>
</svg>`;
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function InvitationPage() {
  return (
    <RealRwaShell activeNav={6}>
      <div className="invitation-shell">
        <Suspense fallback={<InvitationFallback />}>
          <InvitationContent />
        </Suspense>
      </div>
    </RealRwaShell>
  );
}

function InvitationFallback() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[1240px] items-center justify-center px-6 py-16">
      <div className="rounded-[28px] border border-white/10 bg-[#161618] px-6 py-5 text-sm text-white/70">
        Loading invitation surface...
      </div>
    </div>
  );
}

function InvitationContent() {
  const { lang, walletConnected, displayIdentity } = useRwaAppState();
  const { openConnect } = useShellActions();
  const { showSuccessToast, showWarningToast } = useGlobalFeedback();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"invites" | "commission">("invites");
  const [searchValue, setSearchValue] = useState("");
  const [inviteStartDate, setInviteStartDate] = useState("");
  const [inviteEndDate, setInviteEndDate] = useState("");
  const [rewardStartDate, setRewardStartDate] = useState("");
  const [rewardEndDate, setRewardEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [posterOpen, setPosterOpen] = useState(false);
  const [posterVariant, setPosterVariant] = useState<"elite" | "proof">("elite");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<InviteRecord | null>(null);
  const [detailPage, setDetailPage] = useState(1);

  const inviteCode = "WEB123";
  const inviteLink = `https://www.real.com/invite/${inviteCode}`;
  const inviteSteps = INVITE_STEPS[lang];
  const previewMode = searchParams.get("mode");
  const connectedView =
    previewMode === "guest" ? false : previewMode === "member" ? true : walletConnected;
  const posterProofAddress = "0x9d352d7dcc0e4676ad747a2b5df71050f36a678d";

  const filteredInvites = INVITE_ROWS.filter((item) => {
    const matchSearch = !searchValue || item.address.toLowerCase().includes(searchValue.toLowerCase());
    return matchSearch && matchesDateRange(item.createdOn, inviteStartDate, inviteEndDate);
  });

  const filteredCommissions = COMMISSION_ROWS.filter((item) =>
    matchesDateRange(item.issuedOn, rewardStartDate, rewardEndDate)
  );

  const activeRows = activeTab === "invites" ? filteredInvites : filteredCommissions;
  const totalPages = Math.max(1, Math.ceil(activeRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = activeRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const copyInviteCode = async () => {
    try {
      await copyText(inviteCode);
      showSuccessToast(lang === "cn" ? "邀请码已复制" : "Invite code copied");
    } catch {
      showWarningToast(lang === "cn" ? "复制失败，请手动复制" : "Copy failed");
    }
  };

  const copyInviteLink = async () => {
    try {
      await copyText(inviteLink);
      showSuccessToast(lang === "cn" ? "邀请链接已复制" : "Invite link copied");
    } catch {
      showWarningToast(lang === "cn" ? "复制失败，请手动复制" : "Copy failed");
    }
  };

  const openPosterModal = () => {
    setPosterOpen(true);
  };

  const downloadPoster = () => {
    const blob = new Blob([buildPosterSvg(posterVariant, inviteCode, posterProofAddress)], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `REAL-invite-${posterVariant}-${inviteCode}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    showSuccessToast(lang === "cn" ? "邀请海报已下载" : "Poster downloaded");
  };

  const shareToTwitter = () => {
    const text =
      lang === "cn"
        ? `加入 REAL Referral Program，使用我的邀请码 ${inviteCode} 完成注册并申购 RWA 资产：${inviteLink}`
        : `Join the REAL Referral Program with my invite code ${inviteCode}: ${inviteLink}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToTelegram = () => {
    const text =
      lang === "cn"
        ? `使用我的邀请码 ${inviteCode} 加入 REAL Referral Program：${inviteLink}`
        : `Join REAL Referral Program with my invite code ${inviteCode}: ${inviteLink}`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openInviteDetail = (row: InviteRecord) => {
    setSelectedInvite(row);
    setDetailPage(1);
    setDetailOpen(true);
  };

  const heroTargetId = connectedView ? "invite-panel" : "invite-how";
  const summaryMetrics = [
    {
      label: lang === "cn" ? "当前等级" : "Current Rank",
      value: "L1",
    },
    {
      label: lang === "cn" ? "返佣总金额" : "Returned Commission",
      value: `${formatMoney(33221.98)} USD1`,
      help: true,
    },
    {
      label: lang === "cn" ? "邀请总人数" : "Invitees",
      value: lang === "cn" ? "68 人" : "68 Users",
      help: true,
    },
    {
      label: lang === "cn" ? "利率加成" : "APR Boost",
      value: "5.00 %",
      help: true,
    },
    {
      label: lang === "cn" ? "加成时长" : "Boost Duration",
      value: lang === "cn" ? "342 天" : "342 Days",
      help: true,
    },
  ];
  const shareActions = [
    {
      label: "X",
      subtitle: lang === "cn" ? "发布推文" : "Post",
      icon: <span className="text-[20px] font-semibold">X</span>,
      onClick: shareToTwitter,
    },
    {
      label: "Telegram",
      subtitle: lang === "cn" ? "频道分发" : "Channel",
      icon: <Send className="size-5" />,
      onClick: shareToTelegram,
    },
    {
      label: "QR Code",
      subtitle: lang === "cn" ? "生成海报" : "Poster",
      icon: <QrCode className="size-5" />,
      onClick: openPosterModal,
    },
    {
      label: lang === "cn" ? "更多" : "More",
      subtitle: lang === "cn" ? "更多素材" : "Assets",
      icon: <Share2 className="size-5" />,
      onClick: openPosterModal,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/5 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(250,204,21,0.08),transparent_32%),radial-gradient(circle_at_75%_18%,rgba(250,204,21,0.14),transparent_25%),radial-gradient(circle_at_50%_52%,rgba(250,204,21,0.09),transparent_22%),linear-gradient(180deg,#090909_0%,#040404_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0.76),rgba(0,0,0,0.88))]" />
        <div className="relative real-page-wrap mx-auto max-w-[1560px] px-6 pb-18 pt-8">
          <div className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(105deg,rgba(8,8,9,0.98)_0%,rgba(10,11,13,0.95)_46%,rgba(19,14,7,0.92)_100%)] shadow-[0_32px_120px_rgba(0,0,0,0.42)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(244,201,74,0.10),transparent_24%),radial-gradient(circle_at_78%_26%,rgba(244,201,74,0.16),transparent_28%),radial-gradient(circle_at_76%_72%,rgba(70,122,215,0.12),transparent_26%)]" />
            <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[linear-gradient(180deg,rgba(227,185,64,0.06),rgba(227,185,64,0))] lg:block" />
            <div className="relative grid min-h-[360px] gap-10 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:px-12 lg:py-10">
              <div className="max-w-[620px]">
                <span className="inline-flex rounded-full border border-[#F4C94A]/18 bg-[#F4C94A]/8 px-4 py-1.5 text-[12px] uppercase tracking-[0.28em] text-[#E9C15B]">
                  {lang === "cn" ? "邀请计划" : "Referral Program"}
                </span>
                <h1 className="invitation-display invitation-hero-title mt-6 text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] text-white lg:text-[58px]">
                  {lang === "cn" ? "邀请好友" : "Invite friends"}
                  <br />
                  {lang === "cn" ? "赚取双重收益" : "earn dual rewards"}
                </h1>
                <p className="invitation-copy mt-6 max-w-[560px] text-[16px] leading-8 text-zinc-300 lg:text-[18px]">
                  {lang === "cn"
                    ? "连接钱包后即可生成专属邀请码、邀请链接与多场景推广海报。好友完成注册并申购 RWA 资产后，你将解锁 USD1 返佣与质押 APY 加成。"
                    : "Generate a permanent invite code, referral link, and shareable posters. Once your invitees register and subscribe to RWA assets, you unlock USD1 cash commission and staking APY boosts."}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="real-outline-btn h-12 min-w-[156px] rounded-xl px-6 text-[15px]"
                    onClick={() =>
                      document.getElementById(heroTargetId)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  >
                    <span>{connectedView ? (lang === "cn" ? "查看我的邀请" : "View dashboard") : lang === "cn" ? "查看邀请规则" : "Learn more"}</span>
                    <ChevronRight className="ml-2 size-4" />
                  </Button>
                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] text-zinc-300">
                    {connectedView ? displayIdentity : "USD1 Cash + APY Boost"}
                  </div>
                </div>
              </div>

              <InviteHeroVisual />
            </div>
          </div>

          {connectedView ? (
            <>
            <section className="mx-auto mt-8 max-w-[1200px] md:hidden">
              <InviteCenterHeadline lang={lang} connected />

              <div className="mt-6 space-y-4">
                <section className="real-panel overflow-hidden rounded-[24px] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.28em] text-[#E9C15B]/78">
                        {lang === "cn" ? "邀请方式" : "Invitation"}
                      </p>
                      <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-white">
                        {lang === "cn" ? "Launch" : "Launch"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl bg-[#E3B940] px-4 py-2 text-[13px] font-medium text-black"
                      onClick={openPosterModal}
                    >
                      Launch
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    <InviteField
                      label={lang === "cn" ? "邀请码" : "Invite code"}
                      value={inviteCode}
                      onCopy={copyInviteCode}
                    />
                    <InviteField
                      label={lang === "cn" ? "邀请链接" : "Invite link"}
                      value={inviteLink}
                      onCopy={copyInviteLink}
                    />
                  </div>

                  <div className="mt-5">
                    <p className="text-[12px] uppercase tracking-[0.2em] text-zinc-500">
                      {lang === "cn" ? "分享列表" : "Share list"}
                    </p>
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {shareActions.map((action) => (
                        <ShareCircle
                          key={`mobile-${action.label}`}
                          label={action.label}
                          subtitle=""
                          icon={action.icon}
                          onClick={action.onClick}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                </section>

                <section className="real-panel invitation-summary-panel relative overflow-hidden p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.28em] text-[#E9C15B]/78">My Commission</p>
                      <h2 className="mt-3 text-[26px] font-semibold text-white">
                        {lang === "cn" ? "我的邀请数据" : "My Commission"}
                      </h2>
                    </div>
                    <div className="grid size-12 place-items-center rounded-full border border-[#F4C94A]/20 bg-[#0f0f0f] text-[#F4C94A]/70">
                      <TrendingUp className="size-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {summaryMetrics.slice(0, 4).map((metric) => (
                      <SummaryMetric
                        key={`mobile-${metric.label}`}
                        label={metric.label}
                        value={metric.value}
                        help={metric.help}
                        compact
                      />
                    ))}
                  </div>

                  <section className="mt-5">
                    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
                      <button
                        type="button"
                        className={`rounded-full px-4 py-2 text-sm transition ${
                          activeTab === "invites"
                            ? "bg-[#111111] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                            : "text-zinc-400"
                        }`}
                        onClick={() => {
                          setActiveTab("invites");
                          setPage(1);
                        }}
                      >
                        {lang === "cn" ? "Invites" : "Invites"}
                      </button>
                      <button
                        type="button"
                        className={`rounded-full px-4 py-2 text-sm transition ${
                          activeTab === "commission"
                            ? "bg-[#111111] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                            : "text-zinc-400"
                        }`}
                        onClick={() => {
                          setActiveTab("commission");
                          setPage(1);
                        }}
                      >
                        {lang === "cn" ? "Commission" : "Commission"}
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {activeTab === "invites" ? (
                        pageRows.length ? (
                          (pageRows as InviteRecord[]).map((row) => (
                            <article
                              key={`mobile-invite-${row.address}`}
                              className="rounded-[18px] border border-white/10 bg-[#090909]/72 p-4"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="truncate text-[15px] text-zinc-200">{row.address}</p>
                                <button
                                  type="button"
                                  className="rounded-xl border border-white/20 px-4 py-2 text-[12px] text-white"
                                  onClick={() => openInviteDetail(row)}
                                >
                                  Detail
                                </button>
                              </div>
                            </article>
                          ))
                        ) : (
                          <div className="rounded-[18px] border border-white/10 bg-[#090909]/72 px-4 py-5 text-sm text-zinc-500">
                            {lang === "cn" ? "暂无受邀人记录" : "No invitee records"}
                          </div>
                        )
                      ) : pageRows.length ? (
                        (pageRows as CommissionRecord[]).map((row) => (
                          <article
                            key={`mobile-commission-${row.issuedAt}`}
                            className="rounded-[18px] border border-white/10 bg-[#090909]/72 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[15px] text-zinc-200">{row.level}</p>
                              <span className="rounded-full bg-[#E3B940] px-3 py-1 text-[12px] text-black">
                                {formatMoney(row.commissionUsd1)} USD1
                              </span>
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="rounded-[18px] border border-white/10 bg-[#090909]/72 px-4 py-5 text-sm text-zinc-500">
                          {lang === "cn" ? "暂无奖励记录" : "No reward records"}
                        </div>
                      )}
                    </div>
                  </section>
                </section>
              </div>
            </section>

            <section id="invite-panel" className="mx-auto mt-10 hidden max-w-[1200px] md:block">
              <div className="mx-auto max-w-[1200px]">
                <InviteCenterHeadline lang={lang} connected />

                <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
                  <div className="real-panel overflow-hidden rounded-[28px] p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.28em] text-[#E9C15B]/78">
                          {lang === "cn" ? "邀请方式" : "Invitation Method"}
                        </p>
                        <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-white">
                          {lang === "cn" ? "生成专属邀请入口" : "Generate your referral assets"}
                        </h3>
                      </div>
                      <button
                        type="button"
                        className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] text-zinc-300 transition hover:bg-white/[0.06]"
                        onClick={openPosterModal}
                      >
                        {lang === "cn" ? "查看海报" : "Poster preview"}
                      </button>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <InviteField
                        label={lang === "cn" ? "邀请码" : "Invite code"}
                        value={inviteCode}
                        onCopy={copyInviteCode}
                      />
                      <InviteField
                        label={lang === "cn" ? "邀请链接" : "Invite link"}
                        value={inviteLink}
                        onCopy={copyInviteLink}
                      />
                    </div>
                  </div>

                  <div className="real-panel overflow-hidden rounded-[28px] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.28em] text-[#E9C15B]/78">
                          {lang === "cn" ? "推广渠道" : "Share"}
                        </p>
                        <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-white">
                          {lang === "cn" ? "多场景快速传播" : "Launch across channels"}
                        </h3>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] text-zinc-300">
                        HopeConnect
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {shareActions.map((action) => (
                        <ShareCircle
                          key={action.label}
                          label={action.label}
                          subtitle={action.subtitle}
                          icon={action.icon}
                          onClick={action.onClick}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <section className="real-panel invitation-summary-panel relative mt-6 overflow-hidden p-6">
                  <div className="absolute inset-y-0 right-0 hidden w-[320px] bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.12),transparent_68%),radial-gradient(circle_at_70%_40%,rgba(59,130,246,0.14),transparent_58%)] lg:block" />
                  <div className="relative">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.28em] text-[#E9C15B]/78">My info</p>
                        <h2 className="invitation-title invitation-summary-title mt-3 text-[30px] font-semibold text-white">
                          {lang === "cn" ? "我的邀请数据" : "Referral performance snapshot"}
                        </h2>
                      </div>
                      <p className="max-w-[420px] text-[14px] leading-7 text-zinc-400">
                        {lang === "cn"
                          ? "查看当前等级、返佣总额、邀请人数与 APY 加成状态，方便快速追踪邀请转化。"
                          : "Track rank, total returned commission, invitee count, and APY boost status in one place."}
                      </p>
                    </div>
                    <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-6 flex gap-4 overflow-x-auto pb-1 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-5">
                      {summaryMetrics.map((metric) => (
                        <div key={metric.label} className="min-w-[220px] md:min-w-0">
                          <SummaryMetric
                            label={metric.label}
                            value={metric.value}
                            help={metric.help}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <section className="mt-6 pb-2">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
                        <button
                          type="button"
                          className={`rounded-full px-4 py-2 text-sm transition ${
                            activeTab === "invites"
                              ? "bg-[#111111] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                              : "text-zinc-400"
                          }`}
                          onClick={() => {
                            setActiveTab("invites");
                            setPage(1);
                          }}
                        >
                          {lang === "cn" ? "邀请记录" : "Invites"}
                        </button>
                        <button
                          type="button"
                          className={`rounded-full px-4 py-2 text-sm transition ${
                            activeTab === "commission"
                              ? "bg-[#111111] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                              : "text-zinc-400"
                          }`}
                          onClick={() => {
                            setActiveTab("commission");
                            setPage(1);
                          }}
                        >
                          {lang === "cn" ? "佣金记录" : "Commission"}
                        </button>
                      </div>

                      {activeTab === "invites" ? (
                        <div className="grid gap-3 xl:grid-cols-[260px_170px_170px]">
                          <InviteSearch
                            value={searchValue}
                            onChange={(value) => {
                              setSearchValue(value);
                              setPage(1);
                            }}
                            placeholder={lang === "cn" ? "请输入受邀人地址" : "Search invitee address"}
                          />
                          <DateField
                            value={inviteStartDate}
                            onChange={(value) => {
                              setInviteStartDate(value);
                              setPage(1);
                            }}
                          />
                          <DateField
                            value={inviteEndDate}
                            onChange={(value) => {
                              setInviteEndDate(value);
                              setPage(1);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="grid gap-3 xl:grid-cols-[170px_170px]">
                          <DateField
                            value={rewardStartDate}
                            onChange={(value) => {
                              setRewardStartDate(value);
                              setPage(1);
                            }}
                          />
                          <DateField
                            value={rewardEndDate}
                            onChange={(value) => {
                              setRewardEndDate(value);
                              setPage(1);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-3 md:hidden">
                      {activeTab === "invites" ? (
                        pageRows.length ? (
                          (pageRows as InviteRecord[]).map((row) => (
                            <article
                              key={row.address}
                              className="rounded-[18px] border border-white/10 bg-[#090909]/72 p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-[15px] font-medium text-white">{row.address}</p>
                                  <p className="mt-1 text-[12px] text-zinc-500">{row.createdAt}</p>
                                </div>
                                <button
                                  type="button"
                                  className="rounded-lg border border-white/20 px-3 py-1.5 text-[12px] text-white transition hover:bg-white/5"
                                  onClick={() => openInviteDetail(row)}
                                >
                                  Detail
                                </button>
                              </div>
                              <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                                  <p className="text-[12px] text-zinc-500">{lang === "cn" ? "总交易额" : "Total Trade Volume"}</p>
                                  <p className="mt-1 font-mono text-[14px] text-white">$ {formatMoney(row.totalTradeVolume)}</p>
                                </div>
                                <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                                  <p className="text-[12px] text-zinc-500">{lang === "cn" ? "注册日期" : "Registered"}</p>
                                  <p className="mt-1 font-mono text-[14px] text-white">{row.createdOn}</p>
                                </div>
                              </div>
                            </article>
                          ))
                        ) : (
                          <div className="rounded-[18px] border border-white/10 bg-[#090909]/72 px-4 py-5 text-sm text-zinc-500">
                            {lang === "cn" ? "暂无受邀人记录" : "No invitee records"}
                          </div>
                        )
                      ) : pageRows.length ? (
                        (pageRows as CommissionRecord[]).map((row) => (
                          <article
                            key={row.issuedAt}
                            className="rounded-[18px] border border-white/10 bg-[#090909]/72 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[15px] font-medium text-white">{row.level}</p>
                                <p className="mt-1 text-[12px] text-zinc-500">{row.issuedAt}</p>
                              </div>
                              <span className="rounded-full border border-[#E3B940]/25 bg-[#E3B940]/10 px-3 py-1 text-[12px] text-[#E3B940]">
                                {formatMoney(row.commissionUsd1)} USD1
                              </span>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                                <p className="text-[12px] text-zinc-500">{lang === "cn" ? "合格人数" : "Qualified"}</p>
                                <p className="mt-1 text-[14px] text-white">{row.qualifiedInvites}</p>
                              </div>
                              <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                                <p className="text-[12px] text-zinc-500">{lang === "cn" ? "加成时长" : "Duration"}</p>
                                <p className="mt-1 text-[14px] text-white">{row.durationDays} {lang === "cn" ? "天" : "days"}</p>
                              </div>
                              <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                                <p className="text-[12px] text-zinc-500">{lang === "cn" ? "APR 加成" : "APR Boost"}</p>
                                <p className="mt-1 text-[14px] text-white">{row.aprBoost.toFixed(2)}%</p>
                              </div>
                              <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                                <p className="text-[12px] text-zinc-500">{lang === "cn" ? "发放日期" : "Issued"}</p>
                                <p className="mt-1 font-mono text-[14px] text-white">{row.issuedOn}</p>
                              </div>
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="rounded-[18px] border border-white/10 bg-[#090909]/72 px-4 py-5 text-sm text-zinc-500">
                          {lang === "cn" ? "暂无奖励记录" : "No reward records"}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 hidden overflow-x-auto overflow-y-hidden rounded-[18px] border border-white/10 bg-[#090909]/72 md:block">
                      {activeTab === "invites" ? (
                        <>
                          <div className="grid grid-cols-[1.2fr_1fr_1fr_132px] border-b border-white/10 bg-white/5 px-4 py-4 text-[14px] text-zinc-400">
                            <div>{lang === "cn" ? "受邀人地址" : "Invitees address"}</div>
                            <div>{lang === "cn" ? "注册时间" : "Registration Time"}</div>
                            <div>{lang === "cn" ? "总交易额" : "Total Trade Volume"}</div>
                            <div className="text-right">{lang === "cn" ? "操作" : "Operate"}</div>
                          </div>
                          {pageRows.length ? (
                            (pageRows as InviteRecord[]).map((row) => (
                              <div
                                key={row.address}
                                className="grid grid-cols-[1.2fr_1fr_1fr_132px] items-center border-b border-white/6 px-4 py-4 text-[15px] text-zinc-200 last:border-b-0"
                              >
                                <div>{row.address}</div>
                                <div className="font-mono text-zinc-300">{row.createdAt}</div>
                                <div className="font-mono text-zinc-300">$ {formatMoney(row.totalTradeVolume)}</div>
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    className="rounded-lg border border-white/20 px-4 py-1.5 text-[13px] text-white transition hover:bg-white/5"
                                    onClick={() => openInviteDetail(row)}
                                  >
                                    Detail
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <EmptyTable label={lang === "cn" ? "暂无受邀人记录" : "No invitee records"} />
                          )}
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-[1fr_100px_140px_150px_150px_140px] border-b border-white/10 bg-white/5 px-4 py-4 text-[14px] text-zinc-400">
                            <div>{lang === "cn" ? "发放日期" : "Issued At"}</div>
                            <div>{lang === "cn" ? "等级" : "Level"}</div>
                            <div>{lang === "cn" ? "合格受邀人数" : "Qualified Invites"}</div>
                            <div>{lang === "cn" ? "佣金总额" : "Commission"}</div>
                            <div>{lang === "cn" ? "利率加成" : "APR Boost"}</div>
                            <div>{lang === "cn" ? "时长" : "Duration"}</div>
                          </div>
                          {pageRows.length ? (
                            (pageRows as CommissionRecord[]).map((row) => (
                              <div
                                key={row.issuedAt}
                                className="grid grid-cols-[1fr_100px_140px_150px_150px_140px] items-center border-b border-white/6 px-4 py-4 text-[15px] text-zinc-200 last:border-b-0"
                              >
                                <div className="font-mono text-zinc-300">{row.issuedAt}</div>
                                <div>{row.level}</div>
                                <div>{row.qualifiedInvites} {lang === "cn" ? "人" : "users"}</div>
                                <div className="font-mono">{formatMoney(row.commissionUsd1)} USD1</div>
                                <div>{row.aprBoost.toFixed(2)}%</div>
                                <div>{row.durationDays} {lang === "cn" ? "天" : "days"}</div>
                              </div>
                            ))
                          ) : (
                            <EmptyTable label={lang === "cn" ? "暂无奖励记录" : "No reward records"} />
                          )}
                        </>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-3 text-sm text-zinc-400">
                      <button
                        type="button"
                        className="rounded-md p-1 transition hover:bg-white/5 disabled:opacity-35"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          className={`min-w-8 rounded-md px-2 py-1 transition ${
                            currentPage === pageNum
                              ? "bg-[#E3B940] text-black"
                              : "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
                          }`}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="rounded-md p-1 transition hover:bg-white/5 disabled:opacity-35"
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </section>
                </section>
              </div>
            </section>
            </>
          ) : (
            <>
              <InviteCenterHeadline lang={lang} connected={false} onConnect={openConnect} />

              <section id="invite-how" className="mx-auto mt-8 max-w-[1200px]">
                <h2 className="invitation-display invitation-section-title text-center text-[34px] font-semibold tracking-[-0.03em] text-white lg:text-[48px]">
                  {lang === "cn" ? "如何邀请好友获得收益" : "How to earn from referrals"}
                </h2>
                <div className="mt-10 grid gap-5 lg:grid-cols-4">
                  {inviteSteps.map((item, index) => (
                    <article
                      key={item.step}
                      className="invitation-step-card relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,20,0.95),rgba(10,10,10,0.98))] px-5 pb-7 pt-7"
                    >
                      <span className="text-[22px] font-semibold text-[#F4C94A]">{item.step}</span>
                      <span className="pointer-events-none absolute right-3 top-2 text-[160px] font-semibold leading-none tracking-[-0.06em] text-white/[0.05]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="invitation-display invitation-card-title mt-6 text-[24px] font-semibold leading-[1.15] text-white lg:text-[32px]">
                        {item.title}
                      </h3>
                      <p className="invitation-copy mt-5 text-[16px] leading-8 text-zinc-400">{item.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </section>

      <InvitationFooter lang={lang} displayIdentity={displayIdentity} connected={connectedView} />

      <PosterModal
        open={posterOpen}
        onOpenChange={setPosterOpen}
        variant={posterVariant}
        onVariantChange={setPosterVariant}
        inviteCode={inviteCode}
        proofAddress={posterProofAddress}
        onDownload={downloadPoster}
      />

      <InviteDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        record={selectedInvite}
        page={detailPage}
        onPageChange={setDetailPage}
      />
    </>
  );
}

function InviteCenterHeadline({
  lang,
  connected,
  onConnect,
}: {
  lang: "cn" | "en";
  connected: boolean;
  onConnect?: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,18,18,0.96),rgba(10,10,10,0.98))] px-5 py-8 text-center lg:rounded-[28px] lg:px-10 lg:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,201,74,0.16),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.10),transparent_34%)]" />
      <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F4C94A]/8 lg:h-[300px] lg:w-[300px]" />
      <div className="absolute left-1/2 top-1/2 h-[164px] w-[164px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F4C94A]/12 lg:h-[220px] lg:w-[220px]" />
      <div className="absolute left-1/2 top-1/2 h-[124px] w-[124px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(244,201,74,0.16),transparent_72%)] lg:h-[160px] lg:w-[160px]" />
      <div className="relative mx-auto max-w-[720px]">
        <p className="text-[12px] uppercase tracking-[0.32em] text-[#E9C15B]/78">
          {connected ? "HopeConnect" : lang === "cn" ? "邀请计划" : "Referral Program"}
        </p>
        <h2 className="invitation-display invitation-center-title mt-4 text-[30px] font-semibold leading-none tracking-[-0.04em] text-white sm:text-[34px] lg:text-[58px]">
          {lang === "cn" ? "立即赚取收益" : "Start earning now"}
        </h2>
        <p className="invitation-copy mt-4 text-[14px] leading-6 text-zinc-400 lg:mt-5 lg:text-[18px] lg:leading-8">
          {lang === "cn"
            ? "成为邀请人并邀请好友，完成注册与申购后即可获得 USD1 返佣和 APY 加成。"
            : "Become an inviter, help friends register and subscribe, then unlock USD1 cash commission and APY boosts."}
        </p>
        {!connected ? (
          <Button
            type="button"
            className="real-gold-btn mt-6 h-11 w-full rounded-xl px-7 text-[15px] sm:w-auto"
            onClick={onConnect}
          >
            Connect
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function InviteHeroVisual() {
  return (
    <div className="relative mx-auto flex h-[220px] w-full max-w-[320px] items-center justify-center overflow-visible sm:h-[260px] sm:max-w-[360px] lg:h-[320px] lg:max-w-[420px]">
      <div className="absolute inset-x-10 bottom-0 top-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(246,207,89,0.18),rgba(246,207,89,0.02)_52%,transparent_76%)] blur-[2px]" />
      <div className="absolute right-4 top-2 h-12 w-12 rounded-2xl border border-[#F4C94A]/30 bg-[#141414] shadow-[0_18px_40px_rgba(246,207,89,0.12)] sm:right-6 sm:h-14 sm:w-14 lg:right-8 lg:top-0 lg:h-16 lg:w-16">
        <div className="grid h-full place-items-center text-[#F4C94A]">
          <TrendingUp className="size-6 sm:size-7 lg:size-8" />
        </div>
      </div>
      <div className="absolute left-4 top-10 h-[88px] w-[88px] rounded-[24px] border border-white/10 bg-[#111112] sm:left-7 sm:h-[108px] sm:w-[108px] lg:left-10 lg:top-8 lg:h-[120px] lg:w-[120px]" />
      <div className="relative h-[164px] w-[146px] rounded-[24px] border border-[#F4C94A]/25 bg-[linear-gradient(180deg,#171717,#101010)] shadow-[0_18px_60px_rgba(246,207,89,0.18)] sm:h-[188px] sm:w-[168px] lg:h-[210px] lg:w-[186px] lg:rounded-[28px]">
        <div className="absolute left-5 right-5 top-6 h-4 rounded-full bg-[#2a2412]" />
        <div className="absolute left-5 right-5 top-16 h-[76px] rounded-[18px] border border-[#F4C94A]/18 bg-[linear-gradient(180deg,#1d1a14,#0f0f0f)]">
          <div className="absolute left-5 right-5 top-8 h-[2px] bg-[#F4C94A]/55" />
          <div className="absolute right-8 top-5 h-9 w-9 rounded-full border border-[#F4C94A]/35" />
        </div>
        <div className="absolute bottom-5 left-5 right-5 grid gap-3">
          <div className="h-3 rounded-full bg-[#2a2412]" />
          <div className="h-3 w-3/4 rounded-full bg-[#2a2412]" />
        </div>
      </div>
      <div className="absolute right-[28px] top-[56px] h-[122px] w-[108px] rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(244,201,74,0.10),rgba(19,19,19,0.92))] shadow-[0_18px_60px_rgba(0,0,0,0.26)] rotate-[12deg] sm:right-[46px] sm:h-[138px] sm:w-[122px] lg:right-[70px] lg:top-[70px] lg:h-[160px] lg:w-[140px] lg:rounded-[24px]">
        <div className="absolute left-5 right-5 top-7 h-3 rounded-full bg-[#3a2c10]" />
        <div className="absolute left-5 right-5 top-14 h-[54px] rounded-[14px] border border-[#F4C94A]/16" />
        <div className="absolute bottom-6 left-5 right-5 grid gap-2">
          <div className="h-2 rounded-full bg-[#2a2412]" />
          <div className="h-2 w-2/3 rounded-full bg-[#2a2412]" />
        </div>
      </div>
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="absolute rounded-full border border-[#F4C94A]/30 bg-[linear-gradient(180deg,#E8BF55,#7A5A16)] shadow-[0_10px_26px_rgba(246,207,89,0.22)]"
          style={{
            width: item % 2 === 0 ? 42 : 34,
            height: item % 2 === 0 ? 42 : 34,
            left: ["22%", "18%", "64%", "72%", "80%", "62%"][item],
            top: ["76%", "62%", "74%", "60%", "83%", "88%"][item],
          }}
        />
      ))}
    </div>
  );
}

function InviteField({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4">
      <label className="mb-3 block text-[13px] text-zinc-500">{label}</label>
      <div className="flex h-[56px] items-center rounded-xl border border-white/12 bg-black/30 px-4">
        <span className="invitation-mono flex-1 truncate text-[16px] text-zinc-200">{value}</span>
        <button
          type="button"
          className="grid size-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white"
          onClick={onCopy}
        >
          <Copy className="size-4" />
        </button>
      </div>
    </div>
  );
}

function ShareCircle({
  label,
  subtitle,
  icon,
  onClick,
  compact = false,
}: {
  label: string;
  subtitle: string;
  icon: ReactNode;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      className={`group rounded-[20px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] text-left transition hover:border-[#F4C94A]/25 hover:bg-[#F4C94A]/8 ${
        compact ? "p-3 text-center" : "p-4"
      }`}
      onClick={onClick}
    >
      <span className={`grid place-items-center rounded-2xl border border-white/12 bg-black/30 text-white transition group-hover:border-[#F4C94A]/35 group-hover:bg-[#F4C94A]/10 ${
        compact ? "mx-auto size-10" : "size-11"
      }`}>
        {icon}
      </span>
      <span className={`block font-medium text-white ${compact ? "mt-3 text-[12px]" : "mt-4 text-[14px]"}`}>{label}</span>
      {subtitle ? <span className="mt-1 block text-[12px] text-zinc-500">{subtitle}</span> : null}
    </button>
  );
}

function SummaryMetric({
  label,
  value,
  help = false,
  compact = false,
}: {
  label: string;
  value: string;
  help?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`min-w-0 rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] ${
      compact ? "p-3" : "p-4"
    }`}>
      <p className={`flex items-center gap-1 text-zinc-400 ${compact ? "text-[12px]" : "text-[14px]"}`}>
        <span>{label}</span>
        {help ? <CircleHelp className="size-3.5 opacity-60" /> : null}
      </p>
      <p className={`invitation-mono invitation-metric-value mt-3 font-mono font-semibold tracking-tight text-white ${
        compact ? "text-[20px]" : "text-[30px]"
      }`}>{value}</p>
    </div>
  );
}

function InviteSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex h-[44px] items-center rounded-xl border border-white/10 bg-black/45 px-3">
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="border-0 bg-transparent px-0 text-sm text-zinc-200 shadow-none focus-visible:ring-0"
      />
      <Search className="size-4 text-zinc-500" />
    </div>
  );
}

function DateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-black/45 px-3 text-sm text-zinc-500">
      <CalendarDays className="size-4" />
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm text-zinc-200 outline-none [&::-webkit-calendar-picker-indicator]:opacity-0"
      />
    </label>
  );
}

function EmptyTable({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-6 text-sm text-zinc-500">
      {label}
    </div>
  );
}

function InvitationFooter({
  lang,
  displayIdentity,
  connected,
}: {
  lang: "cn" | "en";
  displayIdentity: string;
  connected: boolean;
}) {
  return (
    <footer className="border-t border-white/6 bg-[#060606]">
      <div className="real-page-wrap mx-auto max-w-[1560px] px-6 py-10 lg:py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(120px,1fr))]">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg border border-[#FACC15]/55 bg-[#16120a]">
                <Image src="/logo-mark.svg" alt="REAL" width={22} height={22} className="size-[22px]" />
              </div>
              <span className="text-[34px] font-semibold tracking-tight text-white">REAL</span>
            </div>
            <p className="mt-4 text-[20px] font-semibold text-white lg:mt-5 lg:text-[24px]">
              {lang === "cn" ? "资产无界，债券新生" : "Reinvent borderless bond finance"}
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              {connected ? displayIdentity : "real.finance"}
            </p>
            <div className="mt-6 flex items-center gap-4 text-zinc-500 lg:mt-10">
              <span className="text-[18px]">X</span>
              <Send className="size-4" />
              <Link2 className="size-4" />
              <Download className="size-4" />
            </div>
          </div>

          <FooterColumn
            title={lang === "cn" ? "关于" : "About"}
            items={lang === "cn" ? ["白皮书", "RWA 资讯", "用户协议"] : ["Whitepaper", "RWA News", "User Agreement"]}
          />
          <FooterColumn
            title={lang === "cn" ? "产品" : "Products"}
            items={lang === "cn" ? ["交易", "质押", "借贷", "治理"] : ["Trade", "Stake", "Lend", "Governance"]}
          />
          <FooterColumn
            title={lang === "cn" ? "服务" : "Services"}
            items={lang === "cn" ? ["储备金", "保险"] : ["Reserve", "Insurance"]}
          />
          <FooterColumn
            title={lang === "cn" ? "推荐" : "Referral"}
            items={lang === "cn" ? ["推荐人", "被邀请者"] : ["Inviter", "Invitee"]}
          />
        </div>
      </div>
    </footer>
  );
}

function PosterModal({
  open,
  onOpenChange,
  variant,
  onVariantChange,
  inviteCode,
  proofAddress,
  onDownload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: "elite" | "proof";
  onVariantChange: (variant: "elite" | "proof") => void;
  inviteCode: string;
  proofAddress: string;
  onDownload: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="real-modal-surface left-0 top-0 h-[100svh] max-w-none translate-x-0 translate-y-0 rounded-none border-x-0 border-b-0 border-t border-white/10 bg-[#1B1B1B] p-0 text-white sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-w-[1040px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:border"
      >
        <div className="relative flex h-full min-h-0 flex-col p-4 sm:p-7">
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full p-1 text-zinc-500 transition hover:bg-white/5 hover:text-white sm:right-5 sm:top-5"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </button>

          <DialogTitle className="invitation-title invitation-modal-title pt-1 text-center text-[18px] font-medium text-white sm:text-[20px]">
            More
          </DialogTitle>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:mt-6">
            <PosterSwitch
              active={variant === "elite"}
              label="精英邀请"
              onClick={() => onVariantChange("elite")}
            />
            <PosterSwitch
              active={variant === "proof"}
              label="数据证明"
              onClick={() => onVariantChange("proof")}
            />
          </div>

          <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 xl:grid xl:grid-cols-[1fr_236px]">
            <div className="flex min-h-0 flex-1 flex-col rounded-[22px] bg-[#171717] p-3 sm:rounded-[26px] sm:p-8">
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 sm:pr-2">
                <div className="mx-auto w-full max-w-[360px] sm:max-w-[520px]">
                  <PosterCanvas variant={variant} inviteCode={inviteCode} proofAddress={proofAddress} />
                </div>
              </div>
              <div className="shrink-0 border-t border-white/6 pt-4 sm:mt-5 sm:border-0 sm:pt-0">
                <Button
                  type="button"
                  variant="outline"
                  className="real-outline-btn h-11 w-full rounded-xl text-[14px] sm:h-12 sm:text-[15px]"
                  onClick={onDownload}
                >
                  保存到本地
                </Button>
              </div>
            </div>

            <div className="hidden rounded-[24px] bg-[#191919] p-4 xl:block">
              <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#0F0F0F]">
                <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-7 place-items-center rounded-md border border-[#FACC15]/35 bg-[#111111]">
                      <Image src="/logo-mark.svg" alt="REAL" width={14} height={14} className="size-[14px]" />
                    </div>
                    <div className="h-3 w-3 rounded-full bg-zinc-500/50" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#D9B444] px-3 py-1 text-[10px] font-medium text-black">
                      Desposit
                    </span>
                    <div className="grid size-6 place-items-center rounded-full border border-white/15 text-[10px] text-zinc-400">
                      ○
                    </div>
                  </div>
                </div>

                <div className="px-4 py-4">
                  <p className="invitation-title invitation-modal-title text-[22px] text-white">More</p>
                  <button
                    type="button"
                    className="absolute opacity-0"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                  <div className="mt-4 flex gap-2">
                    <PosterSwitch
                      compact
                      active={variant === "elite"}
                      label="精英邀请"
                      onClick={() => onVariantChange("elite")}
                    />
                    <PosterSwitch
                      compact
                      active={variant === "proof"}
                      label="数据证明"
                      onClick={() => onVariantChange("proof")}
                    />
                  </div>

                  <div className="mt-4 scale-[0.52] origin-top-left">
                    <PosterCanvas variant={variant} inviteCode={inviteCode} proofAddress={proofAddress} compact />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="real-outline-btn mt-[-90px] h-10 w-full rounded-xl text-[13px]"
                    onClick={onDownload}
                  >
                    保存到本地
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PosterSwitch({
  active,
  label,
  onClick,
  compact = false,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      className={`rounded-full px-4 py-2 text-sm transition ${
        compact ? "text-[12px]" : "flex-1 whitespace-nowrap sm:flex-none"
      } ${active ? "bg-white/14 text-white" : "bg-transparent text-zinc-500 hover:text-zinc-200"}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function PosterCanvas({
  variant,
  inviteCode,
  proofAddress,
  compact = false,
}: {
  variant: "elite" | "proof";
  inviteCode: string;
  proofAddress: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`poster-surface relative overflow-hidden rounded-none bg-black ${
        compact ? "h-[690px] w-[420px]" : "h-[540px] w-full sm:h-[760px]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,rgba(244,201,74,0.18),transparent_28%),linear-gradient(180deg,#040404_0%,#070707_100%)]" />
      <div className="absolute left-7 top-7 flex items-center gap-3 text-[#E7C56D]">
        <Image src="/logo-mark.svg" alt="REAL" width={24} height={24} className="size-6" />
        <span className="text-[22px] font-semibold">REAL</span>
      </div>

      {variant === "elite" ? (
        <>
          <div className="absolute inset-x-0 top-[78px] text-center">
            <h3 className="invitation-poster-title text-[74px] font-black italic leading-[1.08] tracking-[-0.05em] text-[#E2BD66] [text-shadow:0_4px_12px_rgba(0,0,0,0.35)]">
              财富倍增
            </h3>
            <h3 className="invitation-poster-title mt-2 text-[74px] font-black italic leading-[1.08] tracking-[-0.05em] text-[#E2BD66] [text-shadow:0_4px_12px_rgba(0,0,0,0.35)]">
              领袖奖励
            </h3>
            <p className="invitation-poster-copy mt-8 text-[22px] leading-9 text-[#D4AF5B]">三步开启债券日日收益</p>
            <p className="invitation-poster-copy text-[22px] leading-9 text-[#D4AF5B]">像存银行一样简单</p>
          </div>

          <div className="absolute left-1/2 top-[340px] h-[292px] w-[320px] -translate-x-1/2">
            <div className="absolute bottom-0 left-[34px] h-[28px] w-[250px] rounded-full bg-[radial-gradient(circle_at_center,rgba(224,162,43,0.55),transparent_68%)] blur-sm" />
            <div className="absolute bottom-[60px] left-[84px] h-[162px] w-[160px] rounded-[12px] bg-[linear-gradient(180deg,#F4E6CE,#CCAD71)] shadow-[0_18px_50px_rgba(0,0,0,0.45)] -rotate-[7deg]" />
            <div className="absolute bottom-[82px] left-[110px] h-[2px] w-[90px] bg-[#DDA45D]/55" />
            <div className="absolute bottom-[110px] left-[122px] h-[2px] w-[72px] bg-[#DDA45D]/45" />
            <div className="absolute bottom-[140px] left-[118px] h-[2px] w-[96px] bg-[#DDA45D]/35" />
            <div className="absolute left-[14px] top-[104px] h-4 w-4 rounded-full bg-[#E7C56D]" />
            <div className="absolute right-[10px] top-[86px] h-4 w-4 rounded-full bg-[#E7C56D]" />
            <div className="absolute right-[34px] top-[186px] h-4 w-4 rounded-full bg-[#E7C56D]" />
            <div className="absolute bottom-[52px] left-[46px] h-4 w-4 rounded-full bg-[#E7C56D]" />
            <div className="absolute bottom-[94px] left-[52px] h-[18px] w-[194px] rounded-[12px] bg-[#C29131]" />
            <div className="absolute bottom-[78px] left-[54px] h-[18px] w-[194px] rounded-[12px] bg-[#B7842A]" />
            <div className="absolute bottom-[76px] left-[28px] h-[18px] w-[194px] rotate-[-28deg] rounded-[12px] bg-[#C89533]" />
            <div className="absolute bottom-[224px] left-[184px] h-[18px] w-[74px] rotate-[42deg] rounded-[12px] bg-[#C89533]" />
            <div className="absolute bottom-[250px] left-[230px] h-[18px] w-[18px] rotate-[42deg] rounded-[4px] border-t-[10px] border-t-transparent border-l-[18px] border-l-[#C89533]" />
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-x-0 top-[90px] text-center">
            <h3 className="invitation-poster-title text-[76px] font-black italic leading-[1.05] tracking-[-0.06em] text-[#E2BD66] [text-shadow:0_4px_12px_rgba(0,0,0,0.35)]">
              未来先知
            </h3>
            <h3 className="invitation-poster-title mt-2 text-[76px] font-black italic leading-[1.05] tracking-[-0.06em] text-[#E2BD66] [text-shadow:0_4px_12px_rgba(0,0,0,0.35)]">
              远见之选
            </h3>
            <p className="invitation-poster-copy mt-8 text-[22px] leading-9 text-[#D4AF5B]">在债券世界的风浪中</p>
            <p className="invitation-poster-copy text-[22px] leading-9 text-[#D4AF5B]">这里是你的稳定泊位</p>
          </div>

          <div className="absolute left-1/2 top-[320px] h-[210px] w-[220px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(235,176,62,0.22),transparent_64%)]" />
          <div className="absolute left-1/2 top-[430px] h-[236px] w-[140px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(210,150,40,0.28),transparent_70%)]" />
          <div className="absolute left-1/2 top-[392px] h-[270px] w-[170px] -translate-x-1/2">
            <div className="absolute left-1/2 top-0 h-[244px] w-[28px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#D79A2D,#6A4315)] blur-[0.5px]" />
            <div className="absolute left-[18px] top-[54px] h-[24px] w-[130px] rotate-[22deg] rounded-full bg-[#D79A2D]" />
            <div className="absolute left-[8px] top-[114px] h-[24px] w-[148px] rotate-[-18deg] rounded-full bg-[#D79A2D]" />
            <div className="absolute left-[22px] top-[174px] h-[24px] w-[122px] rotate-[12deg] rounded-full bg-[#D79A2D]" />
          </div>

          <div className="absolute left-1/2 top-[430px] w-[380px] -translate-x-1/2 rounded-[16px] border border-white/10 bg-[#1e1e1e] px-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[10px] bg-white/[0.04] p-4">
                <p className="text-[12px] text-zinc-400">持仓债券代币数量</p>
                <p className="invitation-mono mt-3 font-mono text-[34px] font-semibold text-[#F0D185]">1,000.00 USDC</p>
              </div>
              <div className="rounded-[10px] bg-white/[0.04] p-4">
                <p className="text-[12px] text-zinc-400">收益总数量</p>
                <p className="invitation-mono mt-3 font-mono text-[34px] font-semibold text-[#F0D185]">$ 23,785.19</p>
              </div>
            </div>
            <div className="mt-4 text-[13px] text-zinc-400">邀请人地址</div>
            <p className="invitation-mono mt-2 break-all font-mono text-[14px] leading-6 text-zinc-100">{proofAddress}</p>
            <p className="invitation-mono break-all font-mono text-[14px] leading-6 text-zinc-100">0x9d352d7dcc0e4676ad7478d</p>
          </div>
        </>
      )}

      <div className="absolute bottom-10 left-7">
        <p className="text-[18px] text-zinc-500">邀请码</p>
        <p className="invitation-mono invitation-poster-code mt-2 font-mono text-[42px] font-semibold text-white">{inviteCode}</p>
      </div>

      <div className="absolute bottom-10 right-7">
        <PosterQr />
      </div>
    </div>
  );
}

function PosterQr() {
  const rows = [
    "111110001011111",
    "100010111010001",
    "101010100010101",
    "101010111010101",
    "100010001010001",
    "111110101011111",
    "000000001000000",
    "111011101011101",
    "001100011100010",
    "111011001011101",
    "100101111010101",
    "000000101000000",
    "111110001011111",
    "100010101010001",
    "111110001011111",
  ];

  return (
    <div className="grid h-[92px] w-[92px] grid-cols-15 gap-[2px] rounded-[6px] bg-[#0f0f0f] p-[6px]">
      {rows.flatMap((row, rowIndex) =>
        [...row].map((cell, cellIndex) => (
          <span
            key={`${rowIndex}-${cellIndex}`}
            className={`rounded-[1px] ${cell === "1" ? "bg-white" : "bg-transparent"}`}
          />
        ))
      )}
    </div>
  );
}

function InviteDetailModal({
  open,
  onOpenChange,
  record,
  page,
  onPageChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: InviteRecord | null;
  page: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="real-modal-surface left-0 top-0 h-[100svh] max-w-none translate-x-0 translate-y-0 rounded-none border-x-0 border-b-0 border-t border-white/10 bg-[#1A1A1A] p-0 text-white sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-w-[1120px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:border"
      >
        <div className="relative flex h-full min-h-0 flex-col p-4 sm:p-7">
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full p-1 text-zinc-500 transition hover:bg-white/5 hover:text-white sm:right-5 sm:top-5"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </button>

          <DialogTitle className="invitation-title invitation-modal-title pt-7 text-center text-[18px] font-medium text-white sm:pt-10">
            Invitees Detail
          </DialogTitle>

          <div className="mt-4 rounded-[18px] bg-white/[0.04] px-4 py-4 sm:mt-6 sm:px-4 sm:py-5">
            <div className="grid grid-cols-2 gap-3 text-[13px] text-zinc-400 sm:grid-cols-2 sm:gap-4 sm:text-[14px] lg:grid-cols-4">
              <InfoPair label="Invitees address:" value={record?.address ?? "HkAo3sqe...93ujhMq1"} />
              <InfoPair label="Chinese fund bonds" value="3 Years" />
              <InfoPair label="Data sources:" value="Mon 04, Mar 2024" />
              <InfoPair label="Valid invitation:" value="$1,000,000.00" />
            </div>
          </div>

          <div className="mt-4 inline-flex rounded-full bg-white/[0.06] p-1 sm:mt-5">
            <button type="button" className="rounded-full bg-white/[0.08] px-5 py-2 text-sm text-white">
              订单
            </button>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 sm:mt-5">
            <div className="space-y-3 lg:hidden">
              {INVITE_DETAIL_ROWS.map((row, index) => (
                <article
                  key={`mobile-detail-${row.time}-${index}`}
                  className="rounded-[18px] border border-white/10 bg-[#111111] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] text-white">{row.coin}</p>
                      <p className="mt-1 text-[12px] text-zinc-500">{row.time}</p>
                    </div>
                    <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[12px] text-emerald-300">
                      {row.type}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                      <p className="text-[11px] text-zinc-500">Price</p>
                      <p className="mt-1 font-mono text-[13px] text-white">{row.price}</p>
                    </div>
                    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                      <p className="text-[11px] text-zinc-500">Size</p>
                      <p className="mt-1 font-mono text-[13px] text-white">{row.size}</p>
                    </div>
                    <div className="rounded-[12px] border border-white/8 bg-white/[0.03] px-3 py-3">
                      <p className="text-[11px] text-zinc-500">Amount</p>
                      <p className="mt-1 font-mono text-[13px] text-white">{row.amount}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[18px] border border-white/10 bg-[#111111] lg:block">
              <div className="grid grid-cols-[1.3fr_1.1fr_0.6fr_0.8fr_0.8fr_0.9fr] border-b border-white/8 bg-white/[0.04] px-4 py-4 text-[14px] text-zinc-400">
                <div>Time</div>
                <div>Coin</div>
                <div>Type</div>
                <div>Price</div>
                <div>Size</div>
                <div>Amount</div>
              </div>
              {INVITE_DETAIL_ROWS.map((row, index) => (
                <div
                  key={`${row.time}-${index}`}
                  className="grid grid-cols-[1.3fr_1.1fr_0.6fr_0.8fr_0.8fr_0.9fr] border-b border-white/6 px-4 py-5 text-[15px] text-zinc-200 last:border-b-0"
                >
                  <div className="font-mono">{row.time}</div>
                  <div>{row.coin}</div>
                  <div className="text-emerald-400">{row.type}</div>
                  <div className="font-mono">{row.price}</div>
                  <div className="font-mono">{row.size}</div>
                  <div className="font-mono">{row.amount}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3 border-t border-white/8 pt-3 text-sm text-zinc-400 lg:justify-end">
            <button
              type="button"
              className="rounded-md p-1 transition hover:bg-white/5 disabled:opacity-35"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: 5 }, (_, index) => index + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`min-w-8 rounded-md px-2 py-1 transition ${
                  page === pageNum ? "bg-[#E3B940] text-black" : "bg-white/[0.05] text-zinc-400"
                }`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              type="button"
              className="rounded-md p-1 transition hover:bg-white/5 disabled:opacity-35"
              onClick={() => onPageChange(Math.min(5, page + 1))}
              disabled={page === 5}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoPair({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p>{label}</p>
      <p className="invitation-detail-value mt-3 text-[18px] text-zinc-200">{value}</p>
    </div>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="text-[18px] font-semibold text-white">{title}</h3>
      <div className="mt-5 space-y-4 text-sm text-zinc-500">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}
