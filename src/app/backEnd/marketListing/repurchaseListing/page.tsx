import { redirect } from "next/navigation";

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
  const configQuery = initialConfigOpen ? "&config=1" : "";

  redirect(`/backEnd/secondaryListing?tab=repurchase${configQuery}`);
}
