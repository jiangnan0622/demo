import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RebatePendingReviewPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function RebateAuditForMeRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="rebate-audit"
      activeItem="rebate-pending-review"
      breadcrumb={[{ label: "返佣审核" }, { label: "待我审核" }]}
    >
      <RebatePendingReviewPage />
    </BackendConsoleShell>
  );
}
