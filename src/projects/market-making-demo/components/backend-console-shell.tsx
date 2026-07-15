"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  BadgeDollarSign,
  ChevronDown,
  Download,
  Layers,
  Landmark,
  LayoutGrid,
  LogOut,
  Package2,
  Receipt,
  Settings,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { publicAsset } from "@/lib/public-asset";

type BackendGroupKey =
  | "trade"
  | "stake"
  | "user-management"
  | "reward-distribution"
  | "product"
  | "asset"
  | "dashboard"
  | "merchant"
  | "rebate-config"
  | "rebate-audit"
  | "rebate-record"
  | "market-making"
  | "system"
  | null;

type BackendItemKey =
  | "trade-orders"
  | "entrust-orders"
  | "stake-overview"
  | "stake-records"
  | "user-list"
  | "reward-release-audit"
  | "reward-release-record"
  | "product-list"
  | "address-list"
  | "price-parameter"
  | "sales-data"
  | "merchant-holding"
  | "merchant-settlement"
  | "rebate-config"
  | "rebate-pending-review"
  | "rebate-reviewed"
  | "rebate-record"
  | "repurchase-listing"
  | "recycle-listing"
  | "secondary-listing"
  | "member-management"
  | "role-management"
  | "personal-information"
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
  icon?: typeof LayoutGrid;
  href?: string;
  items?: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    key: "trade",
    label: "交易管理",
    icon: Receipt,
    items: [
      { key: "trade-orders", label: "成交订单", href: "/backEnd/tradeManagement/dealOrder" },
      { key: "entrust-orders", label: "委托订单", href: "/backEnd/tradeManagement/entrustOrder" },
    ],
  },
  {
    key: "stake",
    label: "质押管理",
    icon: Layers,
    items: [
      { key: "stake-overview", label: "质押情况", href: "/backEnd/stakeManagement/stakeStatus" },
      { key: "stake-records", label: "质押记录", href: "/backEnd/stakeManagement/stakeRecord" },
    ],
  },
  {
    key: "user-management",
    label: "用户管理",
    icon: UsersRound,
    items: [{ key: "user-list", label: "用户列表", href: "/backEnd/userManagement/userList" }],
  },
  {
    key: "reward-distribution",
    label: "奖励发放",
    icon: BadgeDollarSign,
    items: [
      { key: "reward-release-audit", label: "发放审核", href: "/backEnd/rewardDistribution/releaseAudit" },
      { key: "reward-release-record", label: "发放记录", href: "/backEnd/rewardDistribution/releaseRecord" },
    ],
  },
  {
    key: "product",
    label: "产品配置",
    icon: Package2,
    items: [{ key: "product-list", label: "产品列表", href: "/backEnd/productConfig/productList" }],
  },
  {
    key: "asset",
    label: "资产管理",
    icon: WalletCards,
    items: [
      { key: "address-list", label: "地址表", href: "/backEnd/assetManagement/addressList" },
      { key: "price-parameter", label: "价格参数", href: "/backEnd/assetManagement/priceParameter" },
    ],
  },
  {
    key: "dashboard",
    label: "数据看板",
    icon: BarChart3,
    items: [{ key: "sales-data", label: "销售数据", href: "/backEnd/dataBoard/salesData" }],
  },
  {
    key: "merchant",
    label: "商户服务",
    icon: BriefcaseBusiness,
    items: [
      { key: "merchant-holding", label: "商户持仓", href: "/backEnd/merchantService/merchantPosition" },
      { key: "merchant-settlement", label: "商户结算", href: "/backEnd/merchantService/merchantSettlement" },
    ],
  },
  {
    key: "rebate-config",
    label: "返佣配置",
    icon: UsersRound,
    href: "/backEnd/rebateConfig",
  },
  {
    key: "rebate-audit",
    label: "返佣审核",
    icon: Receipt,
    items: [
      { key: "rebate-pending-review", label: "待我审核", href: "/backEnd/rebateAudit/auditForMe" },
      { key: "rebate-reviewed", label: "我已审核", href: "/backEnd/rebateAudit/auditDone" },
    ],
  },
  {
    key: "rebate-record",
    label: "返佣记录",
    icon: Layers,
    href: "/backEnd/rebateRecord",
  },
  {
    key: "market-making",
    label: "产品二次上架",
    icon: Landmark,
    items: [
      { key: "repurchase-listing", label: "回购上架", href: "/backEnd/secondaryListing/repurchaseListing" },
      { key: "recycle-listing", label: "回收上架", href: "/backEnd/secondaryListing/recycleListing" },
    ],
  },
  {
    key: "system",
    label: "系统管理",
    icon: Settings,
    items: [
      { key: "member-management", label: "成员管理", href: "/backEnd/accountCenter/memberManagement" },
      { key: "role-management", label: "角色管理", href: "/backEnd/accountCenter/roleManagement" },
      { key: "personal-information", label: "个人中心", href: "/backEnd/accountCenter/personalInformation" },
    ],
  },
];

function BrandLockup() {
  return (
    <Link href="/backEnd/product/list" className="flex items-center gap-[9px]">
      <Image src={publicAsset("/logo-mark.svg")} alt="REAL" width={46} height={32} className="h-8 w-[46px] object-contain" />
      <span className="text-[18px] font-semibold tracking-[-0.02em] text-white">REAL</span>
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

  return (
    <div className="grid h-screen grid-cols-[208px_minmax(0,1fr)] overflow-hidden bg-[#f5f5f5] text-[#303133]">
      <aside className="flex h-screen min-h-0 flex-col overflow-hidden bg-[#1f2329] text-white">
        <div className="flex h-[52px] shrink-0 items-center justify-center border-b border-white/8">
          <BrandLockup />
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-[14px]">
          {NAV_GROUPS.map((group) => {
            const Icon = group.icon;
            const groupActive = activeGroup === group.key;
            const items = group.items ?? [];
            const groupClassName = cn(
              "flex h-11 w-full items-center gap-[13px] rounded-[2px] text-[16px] font-semibold transition",
              Icon ? "px-[18px]" : "pl-[52px] pr-[18px]",
              groupActive ? "text-white" : "text-[#aeb4bf] hover:bg-white/[0.04] hover:text-white"
            );
            const groupContent = (
              <>
                {Icon ? <Icon className="size-[17px] text-current opacity-90" /> : null}
                <span className="flex-1 text-left">{group.label}</span>
              </>
            );

            return (
              <div key={group.key} className="mb-1">
                {group.href ? (
                  <Link href={group.href} className={groupClassName}>
                    {groupContent}
                  </Link>
                ) : (
                  <div className={groupClassName}>{groupContent}</div>
                )}

                {items.length > 0 ? (
                  <div className="mt-1 space-y-0.5">
                    {items.map((item) => {
                      const isActive = activeItem === item.key;
                      const className = cn(
                        "block h-10 rounded-[2px] py-[9px] pl-[46px] pr-3 text-[16px] font-semibold leading-[22px] transition",
                        isActive
                          ? "bg-[#2d5bd7] text-white"
                          : "text-[#aeb4bf] hover:bg-white/[0.04] hover:text-white"
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

      <div className="flex h-screen min-w-0 flex-col overflow-hidden">
        <header className="z-20 flex h-[52px] shrink-0 items-center justify-end border-b border-[#eeeeee] bg-white px-[26px]">
          <div className="flex items-center gap-[18px]">
            <button
              type="button"
              className="grid size-8 place-items-center rounded-[4px] text-[#2f6fe8] hover:bg-[#f4f7ff]"
            >
              <Download className="size-[18px]" />
            </button>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-[6px] py-1 pl-1 pr-0 transition hover:bg-slate-100"
                onClick={() => setUserMenuOpen((current) => !current)}
              >
                <span className="inline-flex size-[26px] items-center justify-center rounded-full bg-[#2b58d8] text-[12px] font-semibold text-white">
                  A
                </span>
                <span className="text-[16px] font-medium text-[#303133]">admin</span>
                <ChevronDown className="size-3.5 text-[#303133]" />
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

        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-[22px]">
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
