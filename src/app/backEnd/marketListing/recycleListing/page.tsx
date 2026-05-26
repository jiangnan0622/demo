import { redirect } from "next/navigation";

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
  const configQuery = initialConfigOpen ? "&config=1" : "";

  redirect(`/backEnd/secondaryListing?tab=recovery${configQuery}`);
}
