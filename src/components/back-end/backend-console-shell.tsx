"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ChevronDown,
  Landmark,
  LogOut,
  MoreHorizontal,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

type BackendGroupKey =
  | "market-making"
  | null;

type BackendItemKey =
  | "repurchase-listing"
  | null;

type BackendConsoleShellProps = {
  children: ReactNode;
  activeGroup: BackendGroupKey;
  activeItem?: BackendItemKey;
  initialUserMenuOpen?: boolean;
};

type NavItem = {
  key: Exclude<BackendItemKey, null>;
  label: string;
  href?: string;
};

type NavGroup = {
  key: Exclude<BackendGroupKey, null>;
  label: string;
  icon: typeof Landmark;
  href?: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    key: "market-making",
    label: "做市上架",
    icon: Landmark,
    href: "/backEnd/marketMaking/repurchase",
    items: [{ key: "repurchase-listing", label: "回购上架", href: "/backEnd/marketMaking/repurchase" }],
  },
] as const;

function BrandLockup() {
  return (
    <Link href="/backEnd/marketMaking/repurchase" className="flex items-center gap-2">
      <Image src="/logo-mark.svg" alt="REAL" width={24} height={24} className="size-6 object-contain" />
      <span className="text-[17px] font-semibold tracking-tight text-white">REAL</span>
    </Link>
  );
}

function NavTrigger({
  active,
  href,
  children,
}: {
  active?: boolean;
  href?: string;
  children: ReactNode;
}) {
  const className = cn(
    "flex items-center gap-2.5 rounded-[4px] px-4 py-[7px] text-[14px] transition",
    active ? "bg-[#0052d9] text-white" : "text-white/45 hover:bg-white/5 hover:text-white/72"
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}

function NavLeaf({
  active,
  href,
  label,
}: {
  active?: boolean;
  href?: string;
  label: string;
}) {
  const className = cn(
    "block rounded-[4px] py-[7px] pl-11 pr-4 text-[14px] transition",
    active ? "bg-[#0052d9] font-medium text-white" : "text-white/45 hover:bg-white/5 hover:text-white/72"
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return <div className={className}>{label}</div>;
}

export function BackendConsoleShell({
  children,
  activeGroup,
  activeItem = null,
  initialUserMenuOpen = false,
}: BackendConsoleShellProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(initialUserMenuOpen);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 lg:grid lg:grid-cols-[200px_minmax(0,1fr)]">
      <aside className="flex min-h-screen flex-col justify-between overflow-hidden bg-[#1c222b] text-white">
        <div>
          <div className="flex h-[52px] items-center border-b border-white/12 px-5">
            <BrandLockup />
          </div>

          <nav className="space-y-1 px-2 py-4">
            {NAV_GROUPS.map((group) => {
              const Icon = group.icon;
              const groupActive = activeGroup === group.key;

              return (
                <div key={group.key} className="space-y-1">
                  <NavTrigger active={groupActive} href={group.href}>
                    <Icon className={cn("size-4.5", groupActive ? "text-white" : "text-white/45")} />
                    <span className="flex-1">{group.label}</span>
                    <ChevronDown className="size-4 text-white/70" />
                  </NavTrigger>

                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <NavLeaf key={item.key} active={activeItem === item.key} href={item.href} label={item.label} />
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/12 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[3px] text-white/70">
            <MoreHorizontal className="size-4" />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-[52px] items-center justify-end border-b border-[#eceff5] bg-white px-6">
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-[6px] px-2 py-1 transition hover:bg-[#f5f7fb]"
              onClick={() => setUserMenuOpen((current) => !current)}
            >
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#eff6ff] text-[11px] font-semibold text-[#2563eb]">
                王
              </span>
              <span className="text-right text-[12px] font-medium text-slate-700">王大锤</span>
              <ChevronDown className="size-3.5 text-slate-400" />
            </button>

            {userMenuOpen ? (
              <div className="absolute right-0 top-[42px] w-[100px] overflow-hidden rounded-[6px] border border-[#ebeef5] bg-white py-1 shadow-[0_10px_26px_rgba(15,23,42,0.12)]">
                <div className="flex h-8 items-center gap-2 px-3 text-[13px] text-[#303133] transition hover:bg-[#f5f7fb]">
                  <UserRound className="size-3.5" />
                  个人中心
                </div>
                <div className="flex h-8 items-center gap-2 px-3 text-[13px] text-[#303133] transition hover:bg-[#f5f7fb]">
                  <LogOut className="size-3.5" />
                  退出登录
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <main className="px-5 py-[14px]">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
