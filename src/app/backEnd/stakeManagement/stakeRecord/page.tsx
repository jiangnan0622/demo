import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { StakeRecordPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function StakeRecordManagementRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="stake"
      activeItem="stake-records"
      breadcrumb={[{ label: "质押管理" }, { label: "质押记录" }]}
    >
      <StakeRecordPage />
    </BackendConsoleShell>
  );
}
