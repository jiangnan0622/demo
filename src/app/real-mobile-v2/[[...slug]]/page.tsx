import type { Metadata } from "next";
import { Suspense } from "react";
import { RealMobileDemo } from "@/projects/real-mobile-demo-v2/components/real-mobile-demo";
import { realMobileRoutes } from "@/projects/real-mobile-demo-v2/lib/real-mobile-data";

export const metadata: Metadata = {
  title: "Real mobile v2 · Demo",
  description: "Archived iteration before the Plan A mobile trading flow.",
};

export function generateStaticParams() {
  return [{ slug: [] }, ...realMobileRoutes.map((route) => ({ slug: route.path.split("/").filter(Boolean) }))];
}

export default async function RealMobilePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={null}>
      <RealMobileDemo slug={slug} />
    </Suspense>
  );
}
