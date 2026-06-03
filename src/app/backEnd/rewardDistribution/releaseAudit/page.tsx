import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RewardReleaseAuditPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function RewardReleaseAuditRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="reward-distribution"
      activeItem="reward-release-audit"
      breadcrumb={[{ label: "奖励发放" }, { label: "发放审核" }]}
    >
      <RewardReleaseAuditPage />
    </BackendConsoleShell>
  );
}
