import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { SecondaryListingPage } from "@/projects/market-making-demo/components/secondary-listing-page";

type SecondaryListingRoutePageProps = {
  searchParams?: Promise<{
    config?: string;
    tab?: string;
  }>;
};

export default async function SecondaryListingRoutePage({
  searchParams,
}: SecondaryListingRoutePageProps) {
  const params = searchParams ? await searchParams : {};
  const initialConfigOpen = params.config === "1" || params.config === "open";
  const initialPageType = params.tab === "recovery" ? "RECOVERY_LISTING" : "REPURCHASE_LISTING";

  return (
    <BackendConsoleShell activeGroup="market-making" activeItem="secondary-listing">
      <SecondaryListingPage initialPageType={initialPageType} initialConfigOpen={initialConfigOpen} />
    </BackendConsoleShell>
  );
}
