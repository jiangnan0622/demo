import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RewardReleaseRecordPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function RewardReleaseRecordRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="reward-distribution"
      activeItem="reward-release-record"
      breadcrumb={[{ label: "奖励发放" }, { label: "发放记录" }]}
    >
      <RewardReleaseRecordPage />
    </BackendConsoleShell>
  );
}
