import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RebateReviewedPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function RebateAuditDoneRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="rebate-audit"
      activeItem="rebate-reviewed"
      breadcrumb={[{ label: "返佣审核" }, { label: "我已审核" }]}
    >
      <RebateReviewedPage />
    </BackendConsoleShell>
  );
}
