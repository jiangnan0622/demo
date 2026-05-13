"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  ChevronDown,
  Download,
  Layers,
  Landmark,
  LayoutGrid,
  LogOut,
  Package2,
  Receipt,
  TrendingUp,
  UserRound,
  WalletCards,
} from "lucide-react";

import { cn } from "@/lib/utils";

type BackendGroupKey =
  | "trade"
  | "stake"
  | "product"
  | "asset"
  | "dashboard"
  | "merchant"
  | "market-making"
  | "invite"
  | null;

type BackendItemKey =
  | "trade-orders"
  | "entrust-orders"
  | "stake-overview"
  | "stake-records"
  | "product-list"
  | "address-list"
  | "sales-data"
  | "merchant-holding"
  | "merchant-settlement"
  | "repurchase-listing"
  | "commission-data"
  | "distribution-settings"
  | null;

type BackendConsoleShellProps = {
  children: ReactNode;
  activeGroup: BackendGroupKey;
  activeItem?: BackendItemKey;
  initialUserMenuOpen?: boolean;
  breadcrumb?: { label: string; href?: string }[];
};

type NavItem = {
  key: Exclude<BackendItemKey, null>;
  label: string;
  href?: string;
};

type NavGroup = {
  key: Exclude<BackendGroupKey, null>;
  label: string;
  icon: typeof LayoutGrid;
  defaultOpen?: boolean;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    key: "trade",
    label: "交易管理",
    icon: Receipt,
    defaultOpen: true,
    items: [
      { key: "trade-orders", label: "成交订单", href: "/backEnd/myOrder/tradeOrder" },
      { key: "entrust-orders", label: "委托订单", href: "/backEnd/myOrder/entrustOrder" },
    ],
  },
  {
    key: "stake",
    label: "质押管理",
    icon: Layers,
    defaultOpen: true,
    items: [
      { key: "stake-overview", label: "质押情况", href: "/backEnd/myOrder/stakeOrder" },
      { key: "stake-records", label: "质押记录", href: "/backEnd/myOrder/supplyOrder" },
    ],
  },
  {
    key: "product",
    label: "产品配置",
    icon: Package2,
    defaultOpen: true,
    items: [{ key: "product-list", label: "产品列表", href: "/backEnd/product/list" }],
  },
  {
    key: "asset",
    label: "资产管理",
    icon: WalletCards,
    items: [{ key: "address-list", label: "地址表", href: "/backEnd/token/Balance" }],
  },
  {
    key: "dashboard",
    label: "数据看板",
    icon: BarChart3,
    items: [{ key: "sales-data", label: "销售数据" }],
  },
  {
    key: "merchant",
    label: "商户服务",
    icon: BriefcaseBusiness,
    items: [{ key: "merchant-holding", label: "商户持仓" }],
  },
  {
    key: "invite",
    label: "邀请机制",
    icon: TrendingUp,
    items: [
      { key: "commission-data", label: "佣金数据", href: "/rebate/commission-data" },
      { key: "distribution-settings", label: "分销设置", href: "/rebate/config" },
    ],
  },
  {
    key: "market-making",
    label: "做市上架",
    icon: Landmark,
    items: [
      {
        key: "repurchase-listing",
        label: "回购上架",
        href: "/backEnd/marketMaking/repurchase",
      },
    ],
  },
];

function BrandLockup() {
  return (
    <Link href="/backEnd/product/list" className="flex items-center gap-2.5">
      <Image src="/logo-mark.svg" alt="REAL" width={28} height={28} className="size-7 object-contain" />
      <span className="text-[18px] font-semibold tracking-tight text-white">REAL</span>
    </Link>
  );
}

export function BackendConsoleShell({
  children,
  activeGroup,
  activeItem = null,
  initialUserMenuOpen = false,
  breadcrumb,
}: BackendConsoleShellProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(initialUserMenuOpen);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      NAV_GROUPS.map((group) => [group.key, group.defaultOpen ?? group.key === activeGroup])
    )
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 lg:grid lg:grid-cols-[228px_minmax(0,1fr)]">
      <aside className="flex min-h-screen flex-col bg-[#1f2329] text-white">
        <div className="flex h-14 items-center border-b border-white/8 px-5">
          <BrandLockup />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => {
            const Icon = group.icon;
            const groupActive = activeGroup === group.key;
            const expanded = openGroups[group.key] ?? false;

            return (
              <div key={group.key} className="mb-1">
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2.5 text-[13px] font-medium transition",
                    groupActive
                      ? "text-white"
                      : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  )}
                  onClick={() =>
                    setOpenGroups((prev) => ({ ...prev, [group.key]: !prev[group.key] }))
                  }
                >
                  <Icon className="size-[15px] text-slate-400" />
                  <span className="flex-1 text-left">{group.label}</span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-slate-400 transition",
                      expanded ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>

                {expanded ? (
                  <div className="mt-1 space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = activeItem === item.key;
                      const className = cn(
                        "block rounded-[6px] py-2 pl-9 pr-3 text-[12.5px] transition",
                        isActive
                          ? "bg-[#1f5bd8] font-medium text-white"
                          : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                      );
                      return item.href ? (
                        <Link key={item.key} href={item.href} className={className}>
                          {item.label}
                        </Link>
                      ) : (
                        <div key={item.key} className={className}>
                          {item.label}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-end border-b border-[#eceff5] bg-white px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="grid size-8 place-items-center rounded-[6px] text-slate-500 hover:bg-slate-100"
            >
              <Download className="size-[15px]" />
            </button>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-[6px] px-2 py-1 transition hover:bg-slate-100"
                onClick={() => setUserMenuOpen((current) => !current)}
              >
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#eff6ff] text-[12px] font-semibold text-[#2563eb]">
                  A
                </span>
                <span className="text-[13px] font-medium text-slate-700">admin</span>
                <ChevronDown className="size-3.5 text-slate-400" />
              </button>
              {userMenuOpen ? (
                <div className="absolute right-0 top-[42px] w-[120px] overflow-hidden rounded-[6px] border border-[#ebeef5] bg-white py-1 shadow-[0_10px_26px_rgba(15,23,42,0.12)]">
                  <div className="flex h-9 cursor-pointer items-center gap-2 px-3 text-[13px] text-[#303133] transition hover:bg-[#f5f7fb]">
                    <UserRound className="size-3.5" />
                    个人中心
                  </div>
                  <div className="flex h-9 cursor-pointer items-center gap-2 px-3 text-[13px] text-[#303133] transition hover:bg-[#f5f7fb]">
                    <LogOut className="size-3.5" />
                    退出登录
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="px-6 py-5">
          {breadcrumb ? (
            <div className="mb-4 flex items-center gap-1.5 text-[14px] text-slate-500">
              {breadcrumb.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? <span className="text-slate-300">/</span> : null}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-slate-700">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={index === breadcrumb.length - 1 ? "text-slate-700" : ""}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
