import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RebateConfigManagementPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function RebateConfigRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="rebate-config"
      activeItem="rebate-config"
      breadcrumb={[{ label: "返佣配置" }]}
    >
      <RebateConfigManagementPage />
    </BackendConsoleShell>
  );
}
