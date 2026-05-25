import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { SalesDataPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function SalesDataRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="dashboard"
      activeItem="sales-data"
      breadcrumb={[{ label: "数据看板" }, { label: "销售数据" }]}
    >
      <SalesDataPage />
    </BackendConsoleShell>
  );
}
