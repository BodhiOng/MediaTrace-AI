import { notFound } from "next/navigation";
import { RouteWorkspace } from "../route-workspace";

const pages = ["instagram", "processing", "results", "settings"] as const;
type RoutePage = (typeof pages)[number];

export function generateStaticParams() {
  return pages.map((page) => ({ page }));
}

export default async function RoutedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!pages.includes(page as RoutePage)) notFound();
  return <RouteWorkspace page={page as RoutePage} />;
}
