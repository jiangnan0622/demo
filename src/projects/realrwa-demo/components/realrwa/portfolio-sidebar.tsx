"use client";

import { ChartCandlestick, Landmark, RectangleEllipsis, Wallet2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRwaAppState } from "@/projects/realrwa-demo/components/realrwa/app-state-provider";
import { REALRWA_ROUTES } from "@/projects/realrwa-demo/lib/realrwa-routes";

type PortfolioSidebarProps = {
  active?: "trade" | "stake" | "lending" | "balance" | null;
};

export function PortfolioSidebar({ active = null }: PortfolioSidebarProps) {
  const router = useRouter();
  const { lang } = useRwaAppState();

  const balanceItem = {
    id: "balance",
    icon: Wallet2,
    label: "Balance",
    route: REALRWA_ROUTES.balance,
  } as const;

  const orderItems = [
    { id: "trade", icon: ChartCandlestick, label: "Spot Order", route: REALRWA_ROUTES.portfolioTrade },
    { id: "stake", icon: RectangleEllipsis, label: "Stake Order", route: REALRWA_ROUTES.portfolioStake },
    { id: "lending", icon: Landmark, label: "Lend Order", route: REALRWA_ROUTES.portfolioLending },
  ] as const;

  const compactItems = [balanceItem, ...orderItems];
  const activeItem = compactItems.find((item) => item.id === active) ?? compactItems[0];
  const activeSection = active === "balance" ? "balance" : "order";

  return (
    <>
      <div className="real-portfolio-sidebar w-full overflow-hidden rounded-[16px] border border-white/5 bg-[#1a1a1a] p-3 md:hidden">
        <div className="mb-3 px-2">
          <h3 className="text-base font-semibold text-[#E4B34C]">
            {activeSection === "balance" ? "Token Balance" : "My Order"}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">{active ? activeItem.label : "Order Center"}</p>
        </div>
        <div className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-2 overflow-x-auto px-1">
          {compactItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                className={`inline-flex shrink-0 items-center gap-2 rounded-[10px] border px-4 py-2.5 text-sm ${
                  isActive
                    ? "border-[#E4B34C] bg-[#F4C955] text-[#16120A] shadow-[inset_0_1px_0_rgba(255,255,255,0.26)]"
                    : "border-transparent bg-transparent text-zinc-400"
                }`}
                type="button"
                onClick={() => router.push(item.route)}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <aside className="hidden w-full rounded-[18px] border border-white/5 bg-[#1a1a1a] p-9 md:block md:w-[280px]">
        <div>
          <h3 className="text-[15px] font-semibold text-[#E4B34C]">Token Balance</h3>
          <div className="mt-4 space-y-1">
            <button
              className={`flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[17px] transition ${
                active === "balance"
                  ? "bg-[#F4C955] text-[#16120A]"
                  : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
              }`}
              type="button"
              onClick={() => router.push(balanceItem.route)}
            >
              <balanceItem.icon className="size-6" />
              {balanceItem.label}
            </button>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-[15px] font-semibold text-[#E4B34C]">My Order</h3>
          <div className="mt-4 space-y-1">
            {orderItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  className={`flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[17px] transition ${
                    isActive
                      ? "bg-[#F4C955] text-[#16120A]"
                      : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
                  }`}
                  type="button"
                  onClick={() => router.push(item.route)}
                >
                  <Icon className="size-6" />
                  {lang === "cn" ? item.label : item.label}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
