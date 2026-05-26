import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { PersonalInformationPage } from "@/projects/market-making-demo/components/backend-standard-pages";

export default function PersonalInformationRoutePage() {
  return (
    <BackendConsoleShell
      activeGroup="system"
      activeItem="personal-information"
      breadcrumb={[{ label: "系统管理" }, { label: "个人中心" }]}
    >
      <PersonalInformationPage />
    </BackendConsoleShell>
  );
}
