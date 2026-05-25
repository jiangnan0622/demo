import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { TradeOrderPage } from "@/projects/market-making-demo/components/trade-order-page";

export default function TradeOrderRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="trade"
      activeItem="trade-orders"
      breadcrumb={[{ label: "交易管理" }, { label: "成交订单" }]}
    >
      <TradeOrderPage />
    </BackendConsoleShell>
  );
}
