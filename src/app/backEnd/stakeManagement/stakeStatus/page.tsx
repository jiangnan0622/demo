import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { StakeOverviewPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function StakeStatusRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="stake"
      activeItem="stake-overview"
      breadcrumb={[{ label: "质押管理" }, { label: "质押情况" }]}
    >
      <StakeOverviewPage />
    </BackendConsoleShell>
  );
}
