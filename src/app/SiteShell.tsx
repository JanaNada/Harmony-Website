"use client";

import { usePathname, useRouter } from "next/navigation";
import { AuthProvider } from "./auth";
import { BriefProvider } from "@/state/BriefContext";
import { BriefBar } from "@/components/brief/BriefBar";
import { ChatNavigator } from "@/components/chat/ChatNavigator";
import { SiteNav } from "@/components/SiteNav";
import { type Page, pageToPath, pathToPage } from "./routes";

/**
 * Everything that must outlive a page change.
 *
 * This lives in the root layout rather than the page. Each URL is a separate
 * match of the catch-all route, so anything mounted inside the page is torn
 * down and rebuilt on every navigation — which was quietly emptying the
 * visitor's brief and closing the guide whenever they moved around the site.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const page = pathToPage(pathname);
  const go = (p: Page) => router.push(pageToPath(p));

  // The portals have their own sidebars and full-height layouts.
  const isPortal = page === "admin" || page === "dashboard";

  return (
    <AuthProvider>
      <BriefProvider>
        <div
          className="h-screen overflow-hidden flex flex-col"
          style={{ background: "#FAF7F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <SiteNav current={page} go={go} />

          {children}

          {!isPortal && <ChatNavigator go={go} />}

          {/* The running selection follows the visitor everywhere except
              checkout and sign-in, where it would sit on top of the form. */}
          {!isPortal && page !== "booking" && page !== "login" && (
            <BriefBar onBook={() => go("booking")} />
          )}
        </div>
      </BriefProvider>
    </AuthProvider>
  );
}
