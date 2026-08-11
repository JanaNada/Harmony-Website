import type { ServiceId } from "@/content/services";

/** Every screen the site can show. Service pages use their ServiceId directly. */
export type Page =
  | "services" | "stories" | "about" | "mission"
  | "booking" | "contact" | "login" | "admin" | "dashboard"
  | ServiceId;

/**
 * The URL each page lives at. Typed as a complete Record so adding a new
 * ServiceId without giving it a path is a compile error rather than a
 * silently broken link.
 */
export const PAGE_TO_PATH: Record<Page, string> = {
  about:       "/about",
  mission:     "/mission",
  services:    "/services",
  stories:     "/portfolio",
  booking:     "/booking",
  contact:     "/contact",
  login:       "/login",
  admin:       "/admin",
  dashboard:   "/dashboard",
  business:    "/services/business",
  events:      "/services/events",
  marketing:   "/services/marketing",
  recruitment: "/services/recruitment",
  technology:  "/services/technology",
};

const PATH_TO_PAGE = new Map<string, Page>(
  (Object.keys(PAGE_TO_PATH) as Page[]).map((p) => [PAGE_TO_PATH[p], p]),
);

/** "/" is an alias for the landing page so the bare domain still works. */
const HOME: Page = "about";

/** Drop trailing slashes so "/services/" and "/services" are the same page. */
function normalise(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export const pageToPath = (page: Page) => PAGE_TO_PATH[page];

export function pathToPage(pathname: string): Page {
  const path = normalise(pathname);
  if (path === "/") return HOME;
  return PATH_TO_PAGE.get(path) ?? HOME;
}

/** Guards a stored page name before it's trusted as somewhere to navigate. */
export function isKnownPage(page: string | null | undefined): page is Page {
  return !!page && Object.prototype.hasOwnProperty.call(PAGE_TO_PATH, page);
}

export function isKnownPath(pathname: string) {
  const path = normalise(pathname);
  return path === "/" || PATH_TO_PAGE.has(path);
}
