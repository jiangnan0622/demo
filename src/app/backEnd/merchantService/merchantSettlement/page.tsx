import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { MerchantSettlementPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function MerchantSettlementRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="merchant"
      activeItem="merchant-settlement"
      breadcrumb={[{ label: "商户服务" }, { label: "商户结算" }]}
    >
      <MerchantSettlementPage />
    </BackendConsoleShell>
  );
}
