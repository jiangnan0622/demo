import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { MerchantPositionPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function MerchantPositionRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="merchant"
      activeItem="merchant-holding"
      breadcrumb={[{ label: "商户服务" }, { label: "商户持仓" }]}
    >
      <MerchantPositionPage />
    </BackendConsoleShell>
  );
}
