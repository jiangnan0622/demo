import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { MemberManagementPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function MemberManagementRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="system"
      activeItem="member-management"
      breadcrumb={[{ label: "系统管理" }, { label: "成员管理" }]}
    >
      <MemberManagementPage />
    </BackendConsoleShell>
  );
}
