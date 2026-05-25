import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RecoveryListingPage } from "@/projects/market-making-demo/components/recovery-listing-page";

type RecycleListingManagementRoutePageProps = {
  searchParams?: Promise<{
    config?: string;
  }>;
};

export default async function RecycleListingManagementRoutePage({
  searchParams,
}: RecycleListingManagementRoutePageProps) {
  const params = searchParams ? await searchParams : {};
  const initialConfigOpen = params.config === "1" || params.config === "open";

  return (
    <BackendConsoleShell activeGroup="market-making" activeItem="recycle-listing">
      <RecoveryListingPage initialConfigOpen={initialConfigOpen} />
    </BackendConsoleShell>
  );
}
