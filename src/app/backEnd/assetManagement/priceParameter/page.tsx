import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { PriceParameterPage } from "@/projects/market-making-demo/components/price-parameter-page";

export default function PriceParameterManagementRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="asset"
      activeItem="price-parameter"
      breadcrumb={[{ label: "资产管理" }, { label: "价格参数" }]}
    >
      <PriceParameterPage />
    </BackendConsoleShell>
  );
}
