import { Suspense } from "react";
import { BackendConsoleShell } from "@/components/back-end/backend-console-shell";
import { RepurchaseConfigPage } from "@/components/market-making/repurchase-config-page";

export default function MarketMakingRepurchaseConfigRoutePage() {
  return (
    <BackendConsoleShell activeGroup="market-making" activeItem="repurchase-listing">
      <Suspense fallback={<div className="px-4 py-12 text-sm text-[#909399]">页面加载中...</div>}>
        <RepurchaseConfigPage />
      </Suspense>
    </BackendConsoleShell>
  );
}
