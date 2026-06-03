import type { Metadata } from "next";
import { Suspense } from "react";
import { RealMobileDemo } from "@/projects/real-mobile-demo-v1/components/real-mobile-demo";
import { realMobileRoutes } from "@/projects/real-mobile-demo-v1/lib/real-mobile-data";

export const metadata: Metadata = {
  title: "Real mobile v1 · Demo",
  description: "Archived first mobile demo version for the Real Finance H5 experience.",
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
