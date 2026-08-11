import { notFound } from "next/navigation";
import App from "../App";
import { isKnownPath } from "../routes";

/**
 * Every site URL renders the same app shell; App picks the screen from the
 * pathname. Unknown URLs 404 instead of quietly falling back to the homepage.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  if (!isKnownPath("/" + (slug ?? []).join("/"))) notFound();
  return <App />;
}
