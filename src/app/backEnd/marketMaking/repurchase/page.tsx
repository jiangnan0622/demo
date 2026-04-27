import { Suspense } from "react";
import { BackendConsoleShell } from "@/components/back-end/backend-console-shell";
import { RepurchaseListingPage } from "@/components/market-making/repurchase-listing-page";

export default function MarketMakingRepurchaseRoutePage() {
  return (
    <BackendConsoleShell activeGroup="market-making" activeItem="repurchase-listing">
      <Suspense fallback={<div className="px-4 py-12 text-sm text-[#909399]">页面加载中...</div>}>
        <RepurchaseListingPage />
      </Suspense>
    </BackendConsoleShell>
  );
}
