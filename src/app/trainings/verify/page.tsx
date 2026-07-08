import { Suspense } from "react";
import { VerifyClient } from "@/components/bake-school/verify-client";
import { RippleLoader } from "@/components/ui/Loader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Confirming your payment",
  description: "Confirming your Bake School application payment.",
  path: "/trainings/verify",
});

export default function ApplyVerifyPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-6 py-16 text-ink">
      <Suspense fallback={<RippleLoader />}>
        <VerifyClient />
      </Suspense>
    </main>
  );
}
