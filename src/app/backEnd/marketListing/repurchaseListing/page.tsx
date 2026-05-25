import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { RepurchaseListingPage } from "@/projects/market-making-demo/components/repurchase-listing-page";

type RepurchaseListingManagementRoutePageProps = {
  searchParams?: Promise<{
    config?: string;
  }>;
};

export default async function RepurchaseListingManagementRoutePage({
  searchParams,
}: RepurchaseListingManagementRoutePageProps) {
  const params = searchParams ? await searchParams : {};
  const initialConfigOpen = params.config === "1" || params.config === "open";

  return (
    <BackendConsoleShell activeGroup="market-making" activeItem="repurchase-listing">
      <RepurchaseListingPage initialConfigOpen={initialConfigOpen} />
    </BackendConsoleShell>
  );
}
