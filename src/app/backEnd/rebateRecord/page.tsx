import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RebateRecordPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function RebateRecordRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="rebate-record"
      activeItem="rebate-record"
      breadcrumb={[{ label: "返佣记录" }]}
    >
      <RebateRecordPage />
    </BackendConsoleShell>
  );
}
