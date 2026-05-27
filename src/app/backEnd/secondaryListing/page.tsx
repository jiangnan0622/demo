import { BackendConsoleShell } from "@/projects/market-making-demo/components/backend-console-shell";
import { SecondaryListingPage } from "@/projects/market-making-demo/components/secondary-listing-page";

export default function SecondaryListingRoutePage() {
  return (
    <BackendConsoleShell activeGroup="market-making" activeItem="secondary-listing">
      <SecondaryListingPage />
    </BackendConsoleShell>
  );
}
