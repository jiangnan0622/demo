import type { Metadata } from "next";
import { Suspense } from "react";
import { RealMobileDemo } from "@/projects/real-mobile-demo/components/real-mobile-demo";
import { realMobileRoutes } from "@/projects/real-mobile-demo/lib/real-mobile-data";

export const metadata: Metadata = {
  title: "Real mobile · Demo",
  description: "Pixel-oriented mobile demo replica for the Real Finance H5 experience.",
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
