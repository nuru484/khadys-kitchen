"use client";

import { useState } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { TwoFactorForm } from "./two-factor-form";

function Wordmark() {
  return (
    <span className="font-serif text-[26px] text-ink">
      Khady&rsquo;s{" "}
      <span className="font-sans text-[23px] font-light italic">Kitchen</span>
    </span>
  );
}

/**
 * The admin sign-in screen. A centered brand card on the cream page, holding
 * either the credentials step or — when the account has 2FA — the code step.
 */
export function LoginClient({ redirectTo }: { redirectTo: string }) {
  const [challengeEmail, setChallengeEmail] = useState<string | null>(null);

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-[clamp(20px,5vw,48px)] py-16 text-ink">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <Link href="/" className="no-underline">
            <Wordmark />
          </Link>
          <div className="mt-2 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-accent">
            Admin console
          </div>
        </div>

        <div className="rounded-[22px] border border-ink/10 bg-card p-[clamp(24px,4vw,36px)]">
          <h1 className="mb-1.5 font-serif text-[26px] font-normal">
            {challengeEmail ? "Two-step verification" : "Sign in"}
          </h1>
          <p className="mb-6 text-[14.5px] leading-[1.6] text-ink/60">
            {challengeEmail
              ? "One more step to keep the kitchen secure."
              : "Welcome back — sign in to manage the shop and bake school."}
          </p>

          {challengeEmail ? (
            <TwoFactorForm
              email={challengeEmail}
              redirectTo={redirectTo}
              onBack={() => setChallengeEmail(null)}
            />
          ) : (
            <LoginForm redirectTo={redirectTo} onChallenge={setChallengeEmail} />
          )}
        </div>

        <p className="mt-6 text-center text-[13.5px] text-ink/55">
          <Link
            href="/"
            className="font-semibold text-ink/70 no-underline transition-colors hover:text-accent"
          >
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
