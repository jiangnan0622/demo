import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { LendingOrderPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function BorrowOrderRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="trade"
      breadcrumb={[{ label: "交易管理" }, { label: "借贷订单" }]}
    >
      <LendingOrderPage />
    </BackendConsoleShell>
  );
}
