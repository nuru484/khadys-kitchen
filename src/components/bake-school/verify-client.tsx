"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { RippleLoader } from "@/components/ui/Loader";
import { useVerifyPaymentMutation } from "@/redux/applications/applications-api";
import { extractApiError } from "@/lib/extract-api-error";
import { routes } from "@/lib/routes";
import { APPLY_CODE_KEY } from "./application-form";

type State = "verifying" | "success" | "failed";

export function VerifyClient() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref") ?? "";
  const [verify] = useVerifyPaymentMutation();
  // Seed from the reference so the "no reference" case needs no effect-setState.
  const [state, setState] = useState<State>(reference ? "verifying" : "failed");
  const [message, setMessage] = useState(
    reference ? "" : "No payment reference was found in the link.",
  );
  // Read the stashed code once at mount (client-only; guarded for SSR).
  const [code] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (sessionStorage.getItem(APPLY_CODE_KEY) ?? ""),
  );
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || !reference) return;
    ran.current = true;

    verify({ reference })
      .unwrap()
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setState("success");
          sessionStorage.removeItem(APPLY_CODE_KEY);
        } else {
          setState("failed");
          setMessage("This payment hasn’t been confirmed yet.");
        }
      })
      .catch((err) => {
        setState("failed");
        setMessage(extractApiError(err).message);
      });
  }, [reference, verify]);

  if (state === "verifying") {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <RippleLoader />
        <p className="text-[15px] text-ink/55">Confirming your payment…</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <EmptyState
        title="Payment confirmed"
        description={`Thank you! Your application${code ? ` ${code}` : ""} is paid. Khady’s team will be in touch on WhatsApp.`}
        action={{ label: "Back to the bakery", href: routes.home }}
        className="w-full max-w-[520px]"
      />
    );
  }

  return (
    <EmptyState
      title="We couldn’t confirm this payment"
      description={`${message || "Please try again, or contact us and we’ll sort it out."}${code ? ` Your application code is ${code}.` : ""}`}
      action={{ label: "Back to apply", href: routes.apply }}
      className="w-full max-w-[520px]"
    />
  );
}
