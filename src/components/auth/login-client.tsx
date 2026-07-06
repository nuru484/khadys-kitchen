"use client";

import { useState } from "react";
import { AuthCard } from "./auth-card";
import { LoginForm } from "./login-form";
import { TwoFactorForm } from "./two-factor-form";

/**
 * The admin sign-in screen. A centered brand card on the cream page, holding
 * either the credentials step or - when the account has 2FA - the code step.
 */
export function LoginClient({ redirectTo }: { redirectTo: string }) {
  const [challengeEmail, setChallengeEmail] = useState<string | null>(null);

  return (
    <AuthCard
      title={challengeEmail ? "Two-step verification" : "Sign in"}
      subtitle={
        challengeEmail
          ? "One more step to keep the kitchen secure."
          : "Welcome back - sign in to manage the shop and bake school."
      }
    >
      {challengeEmail ? (
        <TwoFactorForm
          email={challengeEmail}
          redirectTo={redirectTo}
          onBack={() => setChallengeEmail(null)}
        />
      ) : (
        <LoginForm redirectTo={redirectTo} onChallenge={setChallengeEmail} />
      )}
    </AuthCard>
  );
}
