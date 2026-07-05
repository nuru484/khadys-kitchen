import type { Metadata } from "next";
import { SystemMessage } from "@/components/ui/SystemMessage";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5 py-16">
      <div className="w-full max-w-[460px]">
        <SystemMessage
          code="404"
          title="This shelf is empty."
          description="The page you're after was either eaten or never baked. The good stuff is back at the counter."
          actions={[{ label: "← Back to the bakery", href: routes.home, variant: "dark" }]}
        />
      </div>
    </div>
  );
}
