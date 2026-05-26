import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { EntrustOrderPage } from "@/projects/market-making-demo/components/entrust-order-page";

export default function BackendEntrustOrderRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="trade"
      activeItem="entrust-orders"
      breadcrumb={[{ label: "交易管理" }, { label: "委托订单" }]}
    >
      <EntrustOrderPage />
    </BackendConsoleShell>
  );
}
